import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}
// 배열 대신 객체를 사용해야 자원 소모가 적고 검색이 빠르다. - Edge Runtime 에서 권장되는 방식
const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};
export async function middleware(req: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[req.nextUrl.pathname];
  if (!session.id) {
    //로그인후 세션이없고
    if (!exists) {
      //publicOnlyUrls가 허락하는 페이지 아니면,
      // return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    //로그인후
    if (exists) {
      //publicOnlyUrls 외에 다른페이지 가려하면
      return NextResponse.redirect(new URL("/products", req.url));
    }
  }
  //   const pathname = req.nextUrl.pathname;
  //   if (pathname === "/") {
  //     const res = NextResponse.next();
  //     res.cookies.set("middleware-cookie", "hello");
  //     return res;
  //   }
  //   if (pathname === "/profile") {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // {
    //   source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
    //   missing: [
    //     { type: "header", key: "next-router-prefetch" },
    //     { type: "header", key: "purpose", value: "prefetch" },
    //   ],
    // },
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
