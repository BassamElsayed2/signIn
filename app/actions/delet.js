// app/admin/actions/deleteUser.ts
import { createClient } from "@/utils/supabase/server";

export async function deleteUser(userId) {
  const supabase = createClient();

  // حذف المستخدم من auth
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) throw authError;

  // حذف بياناته من جدول البروفايل (مثلاً)
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (profileError) throw profileError;
}
