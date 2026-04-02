import { NextRequest, NextResponse } from "next/server";

// ============================================================================
//  ENVIRONMENT CONFIG & CONSTANTS
// ============================================================================
const ENV = {
  IS_DEV: process.env.NODE_ENV === "development",
  IS_PROD: process.env.NODE_ENV === "production",
  CSRF_SECRET: process.env.CSRF_SECRET ?? "CHANGE_ME_IN_PRODUCTION",
  TRUSTED_ORIGINS: (process.env.TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED === "true",
  DEV_AUTH_BYPASS: false, // Set to true to bypass auth entirely in dev
} as const;

// Cookie Keys
const COOKIES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  AUTH_SESSION: "authSession",
  USER_PERMISSIONS: "userPermissions",
  USER_ROLE: "userRole", // Still kept for landing redirects
  CSRF_TOKEN: "csrfToken",
} as const;

// ============================================================================
//  ROUTE & PERMISSION DEFINITIONS
// ============================================================================

const AUTH_ROUTES: string[] = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];
const PUBLIC_ONLY_ROUTES: string[] = [
  "/success",
  "/lakes",
  "/catches",
  "/reports",
  "/",
];
const INFO_ROUTES: string[] = [
  "/privacy",
  "/terms",
  "/about-us",
  "/contact-us",
  "/faq",
  "/cookie-policy",
];

// Map of page prefixes to required permission atoms
// Map of page prefixes to required permission atoms
// Important: Place more specific routes BEFORE general prefixes like "/admin"
// to ensure correct matching, or use longest-prefix matching.
const PERMISSION_ROUTES: Record<string, string> = {
  "/admin/dashboard": "",
  "/admin/jobs": "manage_jobs",
  "/admin/applications": "view_applications",
  "/admin/leads": "view_leads",
  "/admin/tasks": "view_tasks",
  "/admin/reports": "view_reports",
  "/admin/audit-logs": "view_audit_logs",
  "/admin/categories": "manage_categories",
  "/admin/users": "manage_users",
  "/admin/settings": "manage_settings",
  "/admin/privacy-policy": "manage_settings",
  "/admin/notifications": "view_notifications",
  "/user/dashboard": "",
  "/customer/portal": "view_customer_portal",
  // Base admin catch-all (least specific)
  "/admin": "view_dashboard",
};

// ============================================================================
//  UTILITIES
// ============================================================================

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

function getRequiredPermission(pathname: string): string | null {
  // Find all matches
  const matches = Object.entries(PERMISSION_ROUTES).filter(
    ([route]) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (matches.length === 0) return null;

  // Return the atom for the longest (most specific) matching route
  return matches.reduce((prev, curr) =>
    curr[0].length > prev[0].length ? curr : prev,
  )[1];
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (ENV.IS_PROD)
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  return res;
}

function allow(): NextResponse {
  return applySecurityHeaders(NextResponse.next());
}

function redirectTo(
  path: string,
  request: NextRequest,
  status: 307 | 302 = 307,
): NextResponse {
  return applySecurityHeaders(
    NextResponse.redirect(new URL(path, request.url), { status }),
  );
}

function isCsrfValid(request: NextRequest): boolean {
  if (ENV.IS_DEV) return true;
  const method = request.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return true;

  const cookieToken = request.cookies.get(COOKIES.CSRF_TOKEN)?.value;
  const headerToken = request.headers.get("x-csrf-token");
  if (!cookieToken || !headerToken || cookieToken !== headerToken) return false;
  return true;
}

// ============================================================================
//  MAIN PROXY GATE
// ============================================================================

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".") ||
    matchesRoute(pathname, INFO_ROUTES) ||
    pathname === "/" ||
    matchesRoute(pathname, PUBLIC_ONLY_ROUTES)
  ) {
    return NextResponse.next();
  }

  if (!isCsrfValid(request))
    return new NextResponse("Forbidden", { status: 403 });

  // Get permissions from cookie (set by our frontend login handler)
  const permissionsStr = request.cookies.get(COOKIES.USER_PERMISSIONS)?.value;
  const rawRole = request.cookies.get(COOKIES.USER_ROLE)?.value || "";
  const role = rawRole.toLowerCase();

  // Frontend-domain auth marker for route protection.
  // Keep refreshToken fallback for backward compatibility during rollout.
  const isAuthenticated =
    !!request.cookies.get(COOKIES.AUTH_SESSION) ||
    !!request.cookies.get(COOKIES.REFRESH_TOKEN);

  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (isAuthenticated) {
      if (role === "customer") return redirectTo("/customer/portal", request);
      if (role === "user") return redirectTo("/user/dashboard", request);
      return redirectTo("/admin/dashboard", request);
    }
    return allow();
  }

  if (!isAuthenticated) {
    const dest = encodeURIComponent(pathname + search);
    return redirectTo(`/signin?redirect=${dest}`, request);
  }

  let userPermissions: string[] = [];
  try {
    userPermissions = permissionsStr ? JSON.parse(permissionsStr) : [];
  } catch (e) {}

  // "admin" has all permissions implicitly.
  // We'll require atoms via route map.
  const requiredAtom = getRequiredPermission(pathname);

  if (requiredAtom !== null) {
    // If atom is empty string, it just means authentication is required (already checked)
    if (
      requiredAtom === "" ||
      role === "admin" ||
      userPermissions.includes(requiredAtom)
    ) {
      return allow();
    } else {
      console.warn(
        `[proxy] 🚫 Access denied | user lacks atom="{"role":"${role}","userPermissions":"${userPermissions}","pathname":"${pathname}","requiredAtom":"${requiredAtom}"}"`,
      );
      // User doesn't have the permission atom -> 403 Forbidden screen
      return redirectTo(`/403?atom=${requiredAtom}`, request);
    }
  }

  // If route is protected but no specific permission map matches, assume standard access (or deny all?)
  // Better to deny by default if under /admin/
  if (pathname.startsWith("/admin/")) {
    if (role === "admin") return allow(); // Fallback for pure Admins
    return redirectTo(`/403`, request);
  }

  return allow();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
