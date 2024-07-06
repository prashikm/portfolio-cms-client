import { NextResponse, type NextRequest } from "next/server";
import { getUser } from "./lib/actions";

export async function middleware(request: NextRequest) {
  const user = await getUser();
  const { pathname } = request.nextUrl;

  if (user) {
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL(`/${user.username}`, request.url));
    }
  }

  // Allow the request to proceed if no redirects are needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
