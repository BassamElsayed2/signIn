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
  className="w-full bg-black text-white py-3 px-6 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg active:scale-95 transition duration-200 ease-in-out disabled:opacity-50"
>
  {loading ? "جاري التسجيل..." : "تسجيل الحضور"}
</button>

  );
}
