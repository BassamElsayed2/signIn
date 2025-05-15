"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkInUser } from "@/app/actions/checkin";

export default function CheckInClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckIn = () => {
    setLoading(true);

    const time = new Date().toISOString(); // ✅ وقت الضغط على الزر

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const res = await checkInUser(
          pos.coords.latitude,
          pos.coords.longitude,
          time // ✅ تمريره للسيرفر
        );

        if (res.success) {
          router.push("/user/checkin"); // ✅ صفحة عرض التفاصيل
        } else {
          alert(res.error || "حدث خطأ");
        }

        setLoading(false);
      },
      () => {
        alert("فشل في الحصول على الموقع");
        setLoading(false);
      }
    );
  };

  return (
    <button
      onClick={handleCheckIn}
      disabled={loading}
      className="bg-blue-600 text-white py-2 px-4 rounded"
    >
      {loading ? "جاري التسجيل..." : "تسجيل الحضور"}
    </button>
  );
}
