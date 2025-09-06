import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value || request.cookies.get("token")?.value;
  console.log("Middleware token:", token);
  if (!token) {
    
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    return NextResponse.next();
  }
}
 
export const config = {
  matcher:"/dashboard/:path*",
}