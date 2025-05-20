"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleOutdoor(formData) {
  const userId = formData.get("userId");

  const supabase = await createClient();

  // جلب القيمة الحالية
  const { data, error } = await supabase
    .from("profiles")
    .select("outDoor")
    .eq("id", userId)
    .single();

  if (error || !data) return;

  const newValue = !data.outDoor;

  await supabase
    .from("profiles")
    .update({ outDoor: newValue })
    .eq("id", userId);

  revalidatePath(`/admin/user/${userId}`);
}
// إعادة تحميل الصفحة
