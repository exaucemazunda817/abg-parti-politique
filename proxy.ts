import { NextRequest, NextResponse } from "next/server";
import { isValidRole, ROLES, SESSION_COOKIE_NAME, verifySessionToken, type Role } from "@/lib/session";

function roleForPath(pathname: string): Role | null {
  if (pathname.startsWith("/secretariat") || pathname.startsWith("/api/secretariat")) {
    return "SECRETARIAT";
  }
  if (pathname.startsWith("/president") || pathname.startsWith("/api/president")) {
    return "PRESIDENT";
  }
  const secretaryMatch = pathname.match(/^\/(?:api\/)?secretaires\/([^/]+)/);
  if (secretaryMatch && isValidRole(secretaryMatch[1])) {
    return secretaryMatch[1] as Role;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = roleForPath(pathname);
  if (!role) return NextResponse.next();

  if (pathname === ROLES[role].loginPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (!session || session.role !== role) {
    // Une route API protégée renvoie 401 plutôt qu'une redirection HTML.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }
    return NextResponse.redirect(new URL(ROLES[role].loginPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/secretariat/:path*",
    "/president/:path*",
    "/secretaires/:path*",
    "/api/secretariat/:path*",
    "/api/president/:path*",
    "/api/secretaires/:path*",
  ],
};
