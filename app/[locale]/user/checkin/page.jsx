import CheckinCountdown from "@/components/CheckinCountdown";
import LogoutButton from "@/components/CheckOut";
import NavBar from "@/components/NavBar";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckinPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role == "admin") redirect("/admin");

  const { data: records } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false });

  if (!records || records.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>لا يوجد سجلات حضور.</p>
      </div>
    );
  }

  const lastRecord = records[0];
  const { latitude, longitude } = lastRecord.location || {};
  let fullAddress = lastRecord.address;

  if (lastRecord.logout_time) {
    redirect("/user/history");
  }

  if (latitude && longitude && !fullAddress) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();
      fullAddress = data.display_name;
    } catch (error) {
      console.error("حدث خطأ أثناء جلب العنوان:", error);
    }
  }

  function getWorkingHoursByRole(role) {
    switch (role) {
      case "developer":
        return 5;
      case "it":
        return 7;
      default:
        return 5;
    }
  }

  const loginTime = new Date(lastRecord.timestamp);
  const hoursToAdd = getWorkingHoursByRole(profile?.role);
  const logoutDeadline = new Date(
    loginTime.getTime() + hoursToAdd * 60 * 60 * 1000
  );

  return (
    <div className="pt-26 p-8 max-w-xl mx-auto bg-white rounded-xl shadow-md text-center">
      <NavBar />
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">
        تفاصيل تسجيل الحضور
      </h2>

      <div className="space-y-4 text-gray-800">
        <p className="text-lg">
          <span className="font-semibold text-gray-900">👤 الاسم:</span>{" "}
          {profile?.full_name}
        </p>
        <p className="text-lg">
          <span className="font-semibold text-gray-900">🕒 الوقت:</span>{" "}
          {new Date(lastRecord.timestamp).toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {fullAddress ? (
          <p className="text-lg">
            <span className="font-semibold text-gray-900">📍 العنوان:</span>{" "}
            {fullAddress}
          </p>
        ) : (
          <p className="text-lg">
            <span className="font-semibold text-gray-900">📍 الإحداثيات:</span>{" "}
            {latitude}, {longitude}
          </p>
        )}
      </div>

      {latitude && longitude && (
        <div className="w-full h-64 mt-6 rounded-lg overflow-hidden border border-gray-400">
          <iframe
            title="خريطة الموقع"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
          ></iframe>
        </div>
      )}

      <CheckinCountdown
        role={profile?.role}
        checkInTime={lastRecord.timestamp}
        attendanceId={lastRecord.id}
        checkInLocation={{
          latitude,
          longitude,
        }}
        forceAllowTimer={profile.outDoor}
      />
      <LogoutButton
        role={profile?.role}
        checkInTime={lastRecord.timestamp}
        attendanceId={lastRecord.id}
      />

      <Link href="/user/history">
        <button className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 mt-6 transition">
          📜 عرض سجل الحضور
        </button>
      </Link>
    </div>
  );
}
