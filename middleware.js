import { NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { routing } from "./i18n/routing";

const PUBLIC_FILE = /\.(.*)$/;
const locales = routing.locales;
const defaultLocale = routing.defaultLocale;

function getLocale(request) {
  const negotiatorHeaders = {};
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

export async function middleware(request) {
  const response = await updateSession(request);

  const url = new URL(request.url);
  let pathname = url.pathname;

  // تجاهل الملفات و api والمسارات الخاصة
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return response;
  }

  // تحقق من وجود locale في بداية المسار
  const localeInPath = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!localeInPath) {
    // لو ما فيه locale، حدد اللغة من الهيدر أو استخدم الافتراضي
    const locale = getLocale(request) || defaultLocale;

    // أعد توجيه مع إضافة locale في بداية المسار
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // لو المسار فيه locale، تابع عادي
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
