"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";

export async function login(prevState, formData) {
  const supabase = await createClient();

  const locale = await getLocale(); // ✅ إصلاح هنا

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword(data);

  if (signInError) {
  return { error: "errorInvalid" }; // فقط المفتاح
}


  const userId = signInData.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    redirect(`/${locale}/user`);
  }

  revalidatePath(`/${locale}/user`, "layout");

  const targetPath = profile.role === "admin" ? "admin" : "user";
redirect(`/${locale}/${targetPath}`);

}
