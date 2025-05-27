"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";   // إضافة useRouter
import { useTranslations, useLocale } from "next-intl";  // استيراد useTranslations مع useLocale
import NavBar from "@/components/NavBar";
import HistoryCalendar from "@/components/HistoryCalendar";
import { createClient } from "@/utils/supabase/client";

export default function HistoryPage() {
  const [userId, setUserId] = useState(null);
  const locale = useLocale();
  const router = useRouter();  // تهيئة router
  const t = useTranslations();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) setUserId(user.id);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <NavBar />
      <div className="max-w-4xl mx-auto p-6 pt-28">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* العنوان + الزرار */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold mb-6">
              {locale === "en" ? "Attendance Calendar" : "📅 تقويم الحضور"}
            </h2>
            <button
              onClick={() => router.push(`/${locale}/user/checkin`)}
              className="rounded-2xl px-5 py-2 text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition-colors duration-200 shadow-sm"
            >
              🔙 {t("back")}
            </button>

          </div>

          {userId ? (
            <HistoryCalendar userId={userId} />
          ) : (
            <p className="text-center">جاري التحميل...</p>
          )}
        </div>
      </div>
    </div>
  );
}
