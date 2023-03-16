// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(process.env.NEXT_PUBLIC_API_LINK);
  console.log("test");
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/user/session`, {
    headers: {
      authorization: request.cookies.get("token")?.value as any,
    },
  });
  const session = await res.json();
  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (session.id) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (!session.id && authorized.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}
const authorized = ["/new-post", "/verify"];
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};
