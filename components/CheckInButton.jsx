"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkInUser } from "@/app/actions/checkin";
import { useLocale, useTranslations } from "next-intl";

export default function CheckInClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale()
  const t = useTranslations("Checkin");

  const handleCheckIn = () => {
    setLoading(true);

    const time = new Date().toISOString();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await checkInUser(
          pos.coords.latitude,
          pos.coords.longitude,
          time
        );

        if (res.success) {
          router.push(`${locale}/user/checkin`);
        } else {
          alert(t("error") || "حدث خطأ");
        }

        setLoading(false);
      },
      () => {
        alert(t("locationError"));
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
      {loading ? t("checkingIn") : t("checkin")}
    </button>
  );
}
