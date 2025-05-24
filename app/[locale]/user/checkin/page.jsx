"use client";

import { useTranslations } from "next-intl";
import CheckinCountdown from "@/components/CheckinCountdown";
import LogoutButton from "@/components/CheckOut";
import NavBar from "@/components/NavBar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // عميل supabase للـ client
import { formatTime } from "@/components/formatTime";
import { useLocale } from "next-intl";
export default function CheckinPage() {
  const t = useTranslations("Checkin");
const locale = useLocale();

  const [profile, setProfile] = useState(null);
  const [lastRecord, setLastRecord] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = "/login";
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileData?.role === "admin") {
      window.location.href = "/admin";
      return;
    }

    const { data: records } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false });

    if (!records || records.length === 0) {
      setLoading(false);
      return;
    }

    const last = records[0];

    if (last.logout_time) {
      window.location.href = "/user/history";
      return;
    }

    setProfile(profileData);
    setLastRecord(last);

    if (last.location?.latitude && last.location?.longitude && !last.address) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${last.location.latitude}&lon=${last.location.longitude}&format=json&accept-language=${locale}`
        );
        const data = await res.json();
        setFullAddress(data.display_name);
      } catch (e) {
        console.error("Error fetching address", e);
      }
    } else {
      setFullAddress(last.address || "");
    }

    setLoading(false);
  };

  fetchData();
}, [locale]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">{t("loading")}</div>
    );

  if (!lastRecord)
    return (
      <div className="p-6 text-center text-gray-500">{t("noRecords")}</div>
    );

  const { latitude, longitude } = lastRecord.location || {};

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
        {t("checkinDetails")}
      </h2>

      <div className="space-y-4 text-gray-800">
        <p className="text-lg">
          <span className="font-semibold text-gray-900">👤 {t("name")}:</span>{" "}
          {profile?.full_name}
        </p>
        <p className="text-lg">
  <span className="font-semibold text-gray-900">
    🕒 {t("time1")}:
  </span>{" "}
  {formatTime(lastRecord.timestamp, locale)}
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

      <Link href="/user/history">
        <button className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 mt-6 transition">
          📜 {t("viewAttendanceLog")}
        </button>
      </Link>
    </div>
  );
}
