"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import HistoryCalendar from "@/components/HistoryCalendar";
import { createClient } from "@/utils/supabase/client";

export default function HistoryPage() {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const [userId, setUserId] = useState(null);
  const router = useRouter();

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
          <div
            className={`flex items-center justify-between mb-6 `}
          >
            <h2 className="text-2xl font-bold">📅 {t("attendanceCalendar")}</h2>
            <button
              onClick={() => router.push("/user/checkin")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm"
            >
              🔙 {t("back")}
            </button>
          </div>

          {userId ? (
            <HistoryCalendar userId={userId} />
          ) : (
            <p className="text-center">{t("loading")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
