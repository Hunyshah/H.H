import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects /admin: refreshes the Supabase session cookie and sends signed-out
 * visitors to the login page. Admin membership is re-checked on the server in
 * the admin layout, so this is only the first gate.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = request.nextUrl.pathname.startsWith("/admin/login");

  if (!url || !key) {
    return isLogin ? NextResponse.next() : redirectToLogin(request);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Do not run code between createServerClient and getClaims: it refreshes the session.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  if (!signedIn && !isLogin) return redirectToLogin(request);

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function redirectToLogin(request: NextRequest) {
  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = "";
  if (request.nextUrl.pathname !== "/admin") {
    login.searchParams.set("next", request.nextUrl.pathname);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
