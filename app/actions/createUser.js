"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function createUser(formData) {
  const supabase = createAdminClient();

  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  // 🔍 تحقق من وجود الاسم مسبقًا
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("full_name", full_name)
    .single();

  if (existingProfile) {
    return { success: false, error: "هذا الاسم مسجل بالفعل" };
  }

  // 🔍 تحقق من وجود الإيميل مسبقًا
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    return { success: false, error: "هذا الإيميل مسجل بالفعل" };
  }

  // ✅ إنشاء المستخدم
  const { data: signUpData, error: signUpError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (signUpError) return { success: false, error: signUpError.message };

  const userId = signUpData.user.id;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    full_name,
    role,
  });

  if (profileError) return { success: false, error: profileError.message };

  return { success: true };
}
