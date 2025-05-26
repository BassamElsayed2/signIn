import CheckinCountdown from "@/components/CheckinCountdown";
import LogoutButton from "@/components/CheckOut";
import NavBar from "@/components/NavBar";

import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CheckinPage({ params }) {
  const locale = params.locale;
  const t = await getTranslations({ locale });

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect(`/${locale}/login`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role == "admin") redirect(`/${locale}/admin`);

  const { data: records } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false });

  if (!records || records.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>
          {locale == "en" ? "No attendance records." : "لا يوجد سجلات حضور."}
        </p>
      </div>
    );
  }

  const lastRecord = records[0];
  const { latitude, longitude } = lastRecord.location || {};
  let fullAddress = lastRecord.address;

  if (lastRecord.logout_time) {
    redirect(`/${locale}/user/history`);
  }

  if (latitude && longitude && !fullAddress) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${locale}`
    );
    const data = await res.json();
    fullAddress = data.display_name;
  } catch (error) {
    console.error(
      locale == "en" ? "Something went wrong" : "حدث خطأ أثناء جلب العنوان:",
      error
    );
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
        {t("attendanceDetails")}
      </h2>

      <div className="space-y-4 text-gray-800">
        <p className="text-lg">
          <span className="font-semibold text-gray-900">👤 {t("name")}:</span>{" "}
          {profile?.full_name}
        </p>

        <p className="text-lg">
          <span className="font-semibold text-gray-900">🗓️ {t("dateTime")}:</span>{" "}
          {new Date(lastRecord.timestamp).toLocaleString(
            locale === "ar" ? "ar-EG" : "en-US",
            {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </p>

        {fullAddress ? (
          <p className="text-lg">
            <span className="font-semibold text-gray-900">📍 {t("address")}:</span>{" "}
            {fullAddress}
          </p>
        ) : (
          <p className="text-lg">
            <span className="font-semibold text-gray-900">📍 {t("coordinates")}:</span>{" "}
            {latitude}, {longitude}
          </p>
        )}
      </div>

      {latitude && longitude && (
        <div className="w-full h-64 mt-6 rounded-lg overflow-hidden border border-gray-400">
          <iframe
            title={t("mapTitle")}
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

      <Link href={`/${locale}/user/history`}>
        <button className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 mt-6 transition">
          {t("viewAttendanceRecord")}
        </button>
      </Link>
    </div>
  );
}
