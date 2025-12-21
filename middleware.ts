import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({
        req,
        secret: "zV22PNw8gg+IKhWotNcQmkH2u6jBEs2qPhHWUQSdX3A=", // Hardcoded in auth.ts, matching here
        cookieName: "cityecho.session-token"
    });

    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    // LOG: Admin check
    // console.log("Middleware Check - Path:", req.nextUrl.pathname);
    // console.log("Middleware Check - User Role:", token?.role);

    if (isAdminPage) {
        if (!token) {
            return NextResponse.redirect(new URL("/api/auth/signin", req.url));
        }

        if (token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
