"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(`${locale}/login`); // بعد تسجيل الخروج، يرجع لصفحة تسجيل الدخول
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-red-500 font-bold flex items-center justify-center mb-5 gap-2 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
        />
      </svg>
      تسجيل الخروج
    </button>
  );
}
