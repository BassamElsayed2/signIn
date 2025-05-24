"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getMessages } from "@/lib/i18n"; // ضفنا دالة الترجمة

export async function login(prevState, formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

 const locale = formData.get("locale") || "en"; // جاي من الفورم
  const messages = getMessages(locale); // هنستخدمه للرسائل

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: messages.Login.error.invalid }; // بدل ما تكتبي النص
  }

  revalidatePath("/", "layout");
  redirect("/");
}
