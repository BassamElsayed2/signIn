"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(prevState, formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword(data);

  if (signInError) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }

  const userId = signInData.user.id;

  // جلب دور المستخدم من جدول "profiles" (عدل الاسم حسب جدولك)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    // لو حصل خطأ أو ما وجد دور، نوجه المستخدم بشكل افتراضي
    redirect("/user");
  }

  revalidatePath("/user", "layout");

  // توجه بناءً على الدور
  if (profile.role === "admin") {
    redirect("/admin");
  } else {
    redirect("/user");
  }
}
