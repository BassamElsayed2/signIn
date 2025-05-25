"use client";

import { logoutAction } from "@/app/actions/checkout";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

export default function LogoutButton({ attendanceId, isTimeOver }) {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const handleLogout = () => {
    if (isTimeOver) {
      // الوقت خلص: خروج فوري
      startTransition(() => logoutAction(attendanceId));
    } else {
      // الوقت لم ينتهِ: تأكيد يدوي
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <p>
              {locale == "en"
                ? "Do you want to leave early?"
                : "هل تريد الخروج قبل الموعد المحدد؟"}{" "}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => toast.dismiss(t)}
              >
                {locale == "en" ? "Cancle" : "إلغاء"}
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => {
                  toast.dismiss(t);
                  startTransition(() => logoutAction(attendanceId));
                }}
              >
                {locale == "en" ? "yes , Quit" : " نعم، خروج"}
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
        }
      );
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-6 transition"
    >
      {isPending
        ? locale == "en"
          ? "Loading..."
          : "جارٍ تسجيل الخروج..."
        : locale == "en"
        ? "Finish Today 🚪"
        : "🚪  أنهاء اليوم"}
    </button>
  );
}
