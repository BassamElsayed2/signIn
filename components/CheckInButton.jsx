"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkInUser } from "@/app/actions/checkin";
import { useLocale } from "next-intl";

export default function CheckInClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const handleCheckIn = () => {
    setLoading(true);

    const time = new Date().toISOString(); // ✅ وقت الضغط على الزر

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await checkInUser(
          pos.coords.latitude,
          pos.coords.longitude,
          time
        );

        if (res.success) {
          router.push("/user/checkin");
        } else {
          alert(res.error || locale == "en" ? "Somthing Wrong" : "حدث خطأ");
        }

        setLoading(false);
      },
      () => {
        alert(
          locale == "en"
            ? "Faild to get the Location"
            : "فشل في الحصول على الموقع"
        );
        setLoading(false);
      }
    );
  };

  return (
    <button
      onClick={handleCheckIn}
      disabled={loading}
      className="w-full bg-black text-white py-3 px-6 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg active:scale-95 transition duration-200 ease-in-out disabled:opacity-50"
    >
      {loading
        ? locale == "en"
          ? "Loading..."
          : "جاري التسجيل..."
        : locale == "en"
        ? "Get Attendance"
        : "تسجيل الحضور"}
    </button>
  );
}
