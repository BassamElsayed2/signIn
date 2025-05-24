import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

import HistoryCalendar from "@/components/HistoryCalendar";
import { toggleOutdoor } from "@/app/actions/disableOutdoor";

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
      return "لم يحضر بعد";
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
      return `وصل الساعة: ${hours}:${minutes}`;
    } else {
      return "لم يحضر بعد";
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
  const lastLocation = attendance?.[0]?.location;

  console.log(profile.outDoor);

  return (
    <div className="w-full h-screen p-4">
      <div className="rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold">:الدور</p>
            <p>{profile.role}</p>
          </div>
          <div>
            <p className="font-semibold">:الاسم</p>
            <p>{profile.full_name}</p>
          </div>

          <div>
            <p className="font-semibold">وقت الوصول:</p>
            <p>{getArrivalStatus()}</p>
          </div>
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
            {profile.outDoor
              ? "تعطيل وضع خارج النطاق"
              : "تفعيل وضع خارج النطاق"}
          </button>
        </form>

        <div>
          <p className="font-semibold text-gray-700 mb-2">
            الموقع على الخريطة:
          </p>
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
              <p>لا توجد بيانات حضور اليوم لعرض الموقع</p>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 pt-28">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">📅 تقويم الحضور</h2>
            {userId ? (
              <HistoryCalendar userId={userId} />
            ) : (
              <p className="text-center">جاري التحميل...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
