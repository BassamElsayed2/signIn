"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const t = useTranslations();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/70 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="text-2xl">🗂️</span>
          <span className="font-bold text-lg text-gray-900">ENS.</span>
        </Link>

        {/* Actions: Language + Logout */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
          >
            {t("logout")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
