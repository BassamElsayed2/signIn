import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from 'next-intl/middleware';



export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};



export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
  localeDetection: true,
});
