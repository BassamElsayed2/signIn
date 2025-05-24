"use client";

import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // نجيب اللغة الحالية من رابط الصفحة (segment الثاني)
  const segments = pathname.split("/");
  const currentLocale = segments[1] || "en";

  // لغة أخرى نبدل عليها
  const nextLocale = currentLocale === "ar" ? "en" : "ar";

  // علم اللغة الحالية
  const flag = currentLocale === "ar" ? "AR" : "EN";

  const switchLanguage = (e) => {
    e.preventDefault(); // يمنع إرسال النموذج
    segments[1] = nextLocale;
    router.push(segments.join("/"));
  };

  return (
    <button
      type="button"
      onClick={switchLanguage}
      aria-label="Toggle language"
      title={`Switch to ${nextLocale === "ar" ? "العربية" : "English"}`}
           className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs font-bold text-gray-800 dark:text-white transition-colors duration-200"

    >🌐
      {flag}
    </button>
  );
}
