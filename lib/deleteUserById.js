"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteUserById(userId) {
  const supabase = createClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
}
