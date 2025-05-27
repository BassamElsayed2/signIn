"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SignOutButton from "./SignOut";
import LanguageToggle from "./LanguageToggle";
import { useLocale } from "next-intl";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const locale = useLocale()

  // هنا ممكن تجيب بيانات المستخدم من localStorage أو context أو من supabase client (لو في client side)
  useEffect(() => {
    // مثال: جلب بيانات المستخدم من localStorage لو مخزنة
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-sm bg-white/30 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href={`/${locale}/user/checkin`} className="flex items-center space-x-3">
          {/* لوجو نصي بسيط */}
          <div className="text-2xl font-extrabold text-gray-900 select-none">
            🗂️
          </div>
          <span className="font-semibold text-lg text-gray-900">ENS.</span>
        </Link>

        <div className="flex items-center space-x-4">
          <SignOutButton />
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
