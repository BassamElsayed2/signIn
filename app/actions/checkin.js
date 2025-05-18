"use server";

import { createClient } from "@/utils/supabase/server";

export async function checkInUser(latitude, longitude, time) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return { success: false, error: "User not found" };
  }

  const user = data.user;

  // 1. نجيب آخر تسجيل حضور/غياب للمستخدم
  const { data: lastRecord, error: lastError } = await supabase
    .from("attendance")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // بداية اليوم

  if (lastRecord) {
    const lastDate = new Date(lastRecord.created_at);
    lastDate.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 2. نضيف غياب عن كل يوم مفيش فيه تسجيل من آخر يوم وحتى أمس
    if (daysDifference > 0) {
      const absentRecords = [];

      for (let i = 1; i <= daysDifference; i++) {
        const missedDay = new Date(today);
        missedDay.setDate(today.getDate() - i);

        absentRecords.push({
          user_id: user.id,

          created_at: missedDay.toISOString(),
        });
      }

      const { error: absentInsertError } = await supabase
        .from("attendance")
        .insert(absentRecords);

      if (absentInsertError) {
        console.error("خطأ أثناء إضافة الغياب:", absentInsertError);
      }
    }
  }

  // 3. التحقق من وجود حضور اليوم
  const { data: existingRecords, error: checkError } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  if (checkError) {
    console.error("خطأ في استعلام الحضور السابق:", checkError);
    return { success: false, error: "خطأ أثناء التحقق من الحضور السابق" };
  }

  if (existingRecords && existingRecords.length > 0) {
    return { success: false, error: "تم تسجيل الحضور مسبقًا اليوم" };
  }

  // 4. تسجيل الحضور الحالي
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
