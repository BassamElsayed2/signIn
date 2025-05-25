import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import HistoryCalendar from "@/components/HistoryCalendar";
import { toggleOutdoor } from "@/app/actions/disableOutdoor";
import loading from "../../loading";

// إضافة Google Maps React component
// يمكن تستخدم مكتبة google-maps-react أو @react-google-maps/api
// هنا مثال بسيط باستخدام iframe مباشر للخريطة

export default async function AdminUserDetailPage({ params }) {
  const supabase = await createClient();
  const userId = params.id;

  // جلب بيانات المستخدم (profile)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // جلب سجلات الحضور
  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("timestamp", { ascending: false });

  // دالة لحساب حالة الحضور
  const getArrivalStatus = () => {
    if (!attendance || attendance.length === 0) {
      return t("not_arrived");
    }

    const lastAttendanceDate = new Date(attendance[0].timestamp);
    const now = new Date();

    const isSameDay =
      lastAttendanceDate.getDate() === now.getDate() &&
      lastAttendanceDate.getMonth() === now.getMonth() &&
      lastAttendanceDate.getFullYear() === now.getFullYear();

    if (isSameDay) {
      const hours = lastAttendanceDate.getHours().toString().padStart(2, "0");
      const minutes = lastAttendanceDate
        .getMinutes()
        .toString()
        .padStart(2, "0");
      return `${t("arrivet_at")} ${hours}:${minutes}`;
    } else {
      return t("not_arrived");
    }
  };

  // تحديد إذا نعرض الخريطة أم لا
  const showMap = () => {
    if (!attendance || attendance.length === 0) return false;
    const lastAttendanceDate = new Date(attendance[0].timestamp);
    const now = new Date();

    return (
      lastAttendanceDate.getDate() === now.getDate() &&
      lastAttendanceDate.getMonth() === now.getMonth() &&
      lastAttendanceDate.getFullYear() === now.getFullYear()
    );
  };

  // إحداثيات آخر حضور

  const t = await getTranslations("admin.user_detail");

  return (
    <div className="w-full h-screen p-4">
      <div className="rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold">{t("role")}</p>
            <p>{profile.role}</p>
          </div>
          <div>
            <p className="font-semibold">{t("name")}</p>
            <p>{profile.full_name}</p>
          </div>

          <div>
            <p className="font-semibold">{t("arrival_time")}</p>
            <p>{getArrivalStatus()}</p>
          </div>

          <form action={toggleOutdoor}>
            <input type="hidden" name="userId" value={userId} />
            <button
              type="submit"
              className={`mt-4 px-4 py-2 rounded text-white ${
                profile.outDoor
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {profile.outDoor ? t("disable_outdoor") : t("enable_outdoor")}
            </button>
          </form>
        </div>

        <div>
          <p className="font-semibold text-gray-700 mb-2">{t("map_title")}</p>
          <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            {showMap() && lastLocation ? (
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${lastLocation.latitude},${lastLocation.longitude}&hl=es;z=14&output=embed`}
                title="موقع المستخدم"
              ></iframe>
            ) : (
              <p>{t("no_location_today")}</p>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 pt-28">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">{t("calendar_title")}</h2>
            {userId ? (
              <HistoryCalendar
                userId={userId}
                translation={{
                  week: t("history_calendar.week"),
                  month: t("history_calendar.month"),
                  threeMonths: t("history_calendar.threeMonths"),
                  loading: t("history_calendar.loading"),
                  presentDays: t("history_calendar.presentDays"),
                  absentDays: t("history_calendar.absentDays"),
                  attendanceRate: t("history_calendar.attendanceRate"),
                  workHoursAfterDeduction: t("history_calendar.workHoursAfterDeduction"),
                  saturday: t("history_calendar.saturday"),
                  sunday: t("history_calendar.sunday"),
                  monday: t("history_calendar.monday"),
                  tuesday: t("history_calendar.tuesday"),
                  wednesday: t("history_calendar.wednesday"),
                  thursday: t("history_calendar.thursday"),
                  friday: t("history_calendar.friday"),
                  present: t("history_calendar.present"),
                  absent: t("history_calendar.absent"),
                  titlePresent: t("history_calendar.titlePresent"),
                  titleAbsent: t("history_calendar.titleAbsent"),
                  checkIn: t("history_calendar.checkIn"),
                  checkOut: t("history_calendar.checkOut"),
                  duration: t("history_calendar.duration"),
                  close: t("history_calendar.close"),
                }}
              />
            ) : (
              <p className="text-center">{t("loading")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
