import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

        // LOG: Admin sayfasına girilmeye çalışılıyor mu?
        console.log("Middleware Check - Path:", req.nextUrl.pathname);
        console.log("Middleware Check - User Role:", token?.role);

        if (isAdminPage && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        // SENİN ÖZEL AYARIN: Bu isim authOptions ile aynı olmalı
        cookies: {
            sessionToken: {
                name: `cityecho.session-token`,
            },
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
