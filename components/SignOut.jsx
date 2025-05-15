"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // بعد تسجيل الخروج، يرجع لصفحة تسجيل الدخول
  };

  return (
    <button onClick={handleSignOut} className="text-red-500 font-bold">
      تسجيل الخروج
    </button>
  );
}
