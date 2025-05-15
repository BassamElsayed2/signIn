import CheckInClient from "@/components/CheckInButton";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // حساب بداية اليوم
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // نتحقق إذا سجل المستخدم اليوم
  const { data: existingRecords } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString())
    .limit(1);

  // لو سجل اليوم، نعيد التوجيه لصفحة تفاصيل الحضور
  if (existingRecords && existingRecords.length > 0) {
    redirect("/user/checkin"); // غيّرها حسب مسار صفحتك لعرض تفاصيل الحضور
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">أهلاً {profile?.full_name}</h1>
      <CheckInClient />
    </div>
  );
}
