"use client";

import { useTranslations } from "next-intl";
import CheckInClient from "@/components/CheckInButton";
import NavBar from "@/components/NavBar";

export default function ClientComponent({ profile }) {
  const t = useTranslations("Home"); // غيّري المفتاح لو ملف الترجمة اسمه مختلف

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-300 px-4 py-12">
      <NavBar />
      <div className="text-center bg-white border border-gray-200 p-10 rounded-2xl shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t("welcome", { name: profile?.full_name })}
        </h1>
        <p className="text-lg text-gray-700 mb-6">{t("readyToCheckIn")}</p>
        <CheckInClient />
      </div>
    </section>
  );
}
