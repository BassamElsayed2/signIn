"use server";

import { createClient } from "@/utils/supabase/server";

export async function checkInUser(latitude, longitude, time) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { success: false, error: "User not found" };
  }

  const user = data.user;

  // التحقق إذا فيه تسجيل اليوم بالفعل
  const today = new Date();
  today.setHours(0, 0, 0, 0); // بداية اليوم

  const { data: existingRecords, error: checkError } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  if (checkError) {
    return { success: false, error: "خطأ أثناء التحقق من الحضور السابق" };
  }

  if (existingRecords && existingRecords.length > 0) {
    return { success: false, error: "تم تسجيل الحضور مسبقًا اليوم" };
  }

  const { error: insertError } = await supabase.from("attendance").insert({
    user_id: user.id,
    location: { latitude, longitude },
    created_at: time,
  });

  if (insertError) {
    console.error("Insert error:", insertError);
    return { success: false, error: "فشل في تسجيل الحضور" };
  }

  return { success: true };
}
