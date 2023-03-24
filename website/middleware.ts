// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const checkLoggedin = async (token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/user/session`, {
    headers: {
      authorization: token as any,
    },
  });
  return res.ok;
};
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/auth")) {
    const loggedin = await checkLoggedin(
      request.cookies.get("token")?.value as any
    );
    if (loggedin) return NextResponse.redirect(new URL("/", request.url));
  } else if (request.nextUrl.pathname.startsWith("/admin")) {
    let resAdmin = await fetch(
      `${process.env.NEXT_PUBLIC_API_LINK}/admin/check`,
      {
        headers: {
          authorization: request.cookies.get("token")?.value as any,
        },
      }
    );
    if (!resAdmin.ok) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (authorized.includes(request.nextUrl.pathname)) {
    const loggedin = await checkLoggedin(
      request.cookies.get("token")?.value as any
    );
    if (!loggedin)
      return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}
const authorized = ["/new-post", "/verify"];
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
