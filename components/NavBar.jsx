"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  // هنا ممكن تجيب بيانات المستخدم من localStorage أو context أو من supabase client (لو في client side)
  useEffect(() => {
    // مثال: جلب بيانات المستخدم من localStorage لو مخزنة
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    setUser(storedUser);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-sm bg-white/30 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          {/* لوجو نصي بسيط */}
          <div className="text-2xl font-extrabold text-gray-900 select-none">
            🗂️
          </div>
          <span className="font-semibold text-lg text-gray-900">ENS.</span>
        </Link>

        <div>
          <Link
            href="/login"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            تسجيل الخروج
          </Link>
        </div>
      </div>
    </nav>
  );
}
