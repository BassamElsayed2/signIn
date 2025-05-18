import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

import UserAttendanceHistory from "@/components/UserAttendanceHistory";

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

  // جلب سجلات الغياب
  const { data: absence, error: absenceError } = await supabase
    .from("absence")
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
                // src={`https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${lastLocation.latitude},${lastLocation.longitude}&zoom=16&maptype=roadmap`}
                src={`https://www.google.com/maps?q=${lastLocation.latitude},${lastLocation.longitude}&hl=es;z=14&output=embed`}
                title="موقع المستخدم"
              ></iframe>
            ) : (
              <p>لا توجد بيانات حضور اليوم لعرض الموقع</p>
            )}
          </div>
        </div>

        {/* <div className="justify-items-center mt-10 w-full">
          <UserAttendanceHistory
            attendance={attendance || []}
            absence={absence || []}
          />
        </div> */}
      </div>
    </div>
  );
}
