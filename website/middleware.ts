import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}
const JWT_SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("Environment JWT_SECRET:", JWT_SECRET ? "defined" : "undefined");
  
  // Allow unauthenticated access to /api/auth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  
  // Get the token from cookies
  const token = req.cookies.get("token")?.value;
  console.log("Middleware:: Token:", token ? "present" : "missing", "Pathname:", pathname);
  
  if (!token) {
    // Handle API unauthorized access
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  try {
    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    console.log("Decoded Token:", payload);
    
    // Attach user info to request headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user", JSON.stringify(payload));
    
    // Note: You cannot save to localStorage here - middleware runs on the server
    // The localStorage comment was removed as it's not possible in middleware
    
    return NextResponse.next({
      headers: requestHeaders,  // Fixed: headers should be at the top level, not in 'request'
    });
  } catch (error) {
    console.error("Invalid token:", error);
    
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Configure matcher to protect all API routes and dashboard routes
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};