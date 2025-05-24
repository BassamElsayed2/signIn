"use client";

import { logoutAction } from "@/app/actions/checkout";
import { useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function LogoutButton({ attendanceId, isTimeOver }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Checkin");

  const handleLogout = () => {
    if (isTimeOver) {
      // الوقت خلص: خروج فوري
      startTransition(() => logoutAction(attendanceId));
    } else {
      // الوقت لم ينتهِ: تأكيد يدوي
      toast(
        (tToast) => (
          <div className="flex flex-col gap-2">
            <p>{t("confirmEarlyLogout")}</p>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => toast.dismiss(tToast)}
              >
                {t("cancel")}
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded"
                onClick={() => {
                  toast.dismiss(tToast);
                  startTransition(() => logoutAction(attendanceId));
                }}
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        ),
        { duration: 10000 }
      );
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-6 transition"
    >
      {isPending ? t("loggingOut") : `🚪  ${t("endDay")}`}
    </button>
  );
}
