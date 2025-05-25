"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export default function LanguageToggle() {
  const locale = useLocale(); // "en" أو "ar"
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    // استبدل أول جزء من المسار (locale) باللغة الجديدة
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <Button
      onClick={toggleLocale}
      className="rounded-2xl px-4 py-2 text-sm font-semibold"
      variant="outline"
    >
      {locale === "en" ? "ar عربي" : "🇺🇸 English"}
    </Button>
  );
}
