import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const cookieStore = await request.cookies;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const pathname = request.nextUrl.pathname;

    // اسمح بالمرور إذا كان في صفحة تسجيل الدخول أو صفحات auth (بما في ذلك مع locale)
    const allowedPaths = ["/login", "/auth"];
    const isOnAllowedPath = allowedPaths.some(
      (path) =>
        pathname === path ||
        pathname.startsWith(`/ar${path}`) ||
        pathname.startsWith(`/en${path}`)
    );

    if (!isOnAllowedPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/login"; // أو استعمل locale هنا لو عندك
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  const pathname = request.nextUrl.pathname;

  // توجيه من الصفحة الرئيسية حسب الدور
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin" : "/user";
    return NextResponse.redirect(url);
  }

  // حماية صفحات الأدمن فقط
  if (pathname.startsWith("/admin") && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/user";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
