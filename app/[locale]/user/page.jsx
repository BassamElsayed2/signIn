import CheckInClient from "@/components/CheckInButton";
import NavBar from "@/components/NavBar";

import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function UserPage({ params }) {
  const locale = params.locale;

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

  if (profile?.role == "admin") redirect(`/${locale}/admin`);

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
    redirect(`/${locale}/user/checkin`); // غيّرها حسب مسار صفحتك لعرض تفاصيل الحضور
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-300 px-4 py-12">
      <NavBar />
      <div className="text-center bg-white border border-gray-200 p-10 rounded-2xl shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {`${locale === "en" ? "Hello" : "مرحباً،"} ${profile?.full_name} 👋`}
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          {" "}
          {locale == "en"
            ? "Ready for your attendance today?"
            : "جاهز لحضورك اليوم؟"}
        </p>
        <CheckInClient />
      </div>
    </section>
  );
}
