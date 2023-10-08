import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { Pages, Routes } from "./constants/enums";

export default withAuth(
  async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const isAuth = await getToken({ req });
    const isAuthPage = pathname.startsWith(`/${Routes.AUTH}`);
    const protectedRoutes = [`/${Routes.PROFILE}`, `/${Routes.ADMIN}`];

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    if (isAuthPage) {
      if (isAuth && isAuth.active) {
        const role = isAuth.role;
        if (role === "ADMIN") {
          return NextResponse.redirect(new URL(`/${Routes.ADMIN}`, req.url));
        }
        return NextResponse.redirect(new URL(`/${Routes.PROFILE}`, req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth && isProtectedRoute) {
      return NextResponse.redirect(
        new URL(`/${Routes.AUTH}/${Pages.LOGIN}`, req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    `/${Routes.PROFILE}/:path*`,
    `/${Routes.AUTH}/:path*`,
    `/${Routes.ADMIN}/:path*`,
  ],
};
