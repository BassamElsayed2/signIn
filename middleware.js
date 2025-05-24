import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const DEFAULT_LOCALE = "ar";
const SUPPORTED_LOCALES = ["en", "ar"];

export async function middleware(request) {
  // ✨ Step 1: تحديث الجلسة من Supabase
  const response = await updateSession(request);

  // ✨ Step 2: توجيه المستخدم حسب اللغة
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return response;
  }

  // لو المسار مفيهوش اللغة، نوجهه لها
  const hasLocale = SUPPORTED_LOCALES.some((locale) =>
    pathname.startsWith(`/${locale}`)
  );

  if (!hasLocale) {
    const locale = DEFAULT_LOCALE;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  return response;
}

// 🛡️ خليه يشتغل على كل المسارات ماعدا ملفات عامة
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
