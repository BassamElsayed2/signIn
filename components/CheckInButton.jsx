"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkInUser } from "@/app/actions/checkin";
import { useLocale } from "next-intl";

export default function CheckInClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    const time = new Date().toISOString();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setShowModal(false);
        const res = await checkInUser(
          pos.coords.latitude,
          pos.coords.longitude,
          time
        );

        if (res.success) {
          router.push(`/${locale}/user/checkin`);
        } else {
          setError(locale === "en" ? "Something went wrong" : "حدث خطأ");
        }
        setLoading(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          // فتح المودال لطلب السماح
          setShowModal(true);
        } else {
          setError(
            locale === "en"
              ? "Sorry, we could not get your location."
              : "عذراً، لم نتمكن من الحصول على الموقع."
          );
        }
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <button
        onClick={requestLocation}
        disabled={loading}
        className="w-full bg-black text-white py-3 px-6 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg active:scale-95 transition duration-200 ease-in-out disabled:opacity-50"
      >
        {loading
          ? locale === "en"
            ? "Loading..."
            : "جاري التسجيل..."
          : locale === "en"
          ? "Get Attendance"
          : "تسجيل الحضور"}
      </button>

      {error && (
        <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>
      )}

      {showModal && (
<div className="fixed inset-0 bg-gray-100 bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 text-center shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {locale === "en"
                ? "Location Permission Needed"
                : "مطلوب السماح بالموقع"}
            </h3>
            <p className="mb-6">
              {locale === "en"
                ? "Please allow location access to register your attendance."
                : "يرجى السماح بالوصول إلى الموقع لتسجيل الحضور."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
              >
                {locale === "en" ? "Cancel" : "إلغاء"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  requestLocation(); // يحاول يطلب الإذن مرة تانية
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {locale === "en" ? "Try Again" : "حاول مرة أخرى"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
