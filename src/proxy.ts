import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/config";
import {
  verifyScopedSessionToken,
  verifySessionToken,
} from "@/lib/auth/session";
import {
  isKitchenCareAccessPath,
  isKitchenCareSharePath,
  KITCHENCARE_SHARE,
  KITCHENCARE_SHARE_COOKIE,
  KITCHENCARE_SHARE_SCOPE,
} from "@/lib/share/kitchencare";
import { applyIndexingHeaders } from "@/lib/site/indexing";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/login") return true;
  if (isKitchenCareAccessPath(pathname)) return true;
  if (pathname === "/c" || pathname.startsWith("/c/")) return true;
  if (pathname === "/santiago") return true;
  if (pathname === "/quedate") return true; // redirect abajo
  if (pathname === "/g" || pathname.startsWith("/g/")) return true;
  if (pathname.startsWith("/eventos/")) return true;
  if (pathname.startsWith("/alojamiento/")) return true;
  if (pathname === "/llms.txt") return true;
  if (pathname === "/santiago/feriados" || pathname === "/santiago/negocios") return true;
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") return true;
  if (pathname === "/manifest.webmanifest" || pathname === "/manifest") return true;
  if (pathname.startsWith("/api/share-card/")) return true;
  return false;
}

function finish(response: NextResponse, pathname: string) {
  return applyIndexingHeaders(response, pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/quedate") {
    const url = request.nextUrl.clone();
    url.pathname = "/santiago";
    return finish(NextResponse.redirect(url, 308), pathname);
  }

  if (isPublicPath(pathname)) {
    if (pathname === "/login") {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (token && (await verifySessionToken(token))) {
        return finish(
          NextResponse.redirect(new URL("/propiedades", request.url)),
          pathname,
        );
      }
    }
    return finish(NextResponse.next(), pathname);
  }

  if (isKitchenCareSharePath(pathname)) {
    const adminOk = await verifySessionToken(
      request.cookies.get(SESSION_COOKIE)?.value,
    );
    const shareOk = await verifyScopedSessionToken(
      KITCHENCARE_SHARE_SCOPE,
      request.cookies.get(KITCHENCARE_SHARE_COOKIE)?.value,
    );
    if (adminOk || shareOk) return finish(NextResponse.next(), pathname);

    if (pathname.startsWith("/api/")) {
      return finish(
        NextResponse.json({ error: "No autorizado" }, { status: 401 }),
        pathname,
      );
    }
    const acceso = new URL(KITCHENCARE_SHARE.acceso, request.url);
    const next = `${pathname}${request.nextUrl.search}`;
    if (next && next !== "/") acceso.searchParams.set("next", next);
    return finish(NextResponse.redirect(acceso), pathname);
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionToken(token);

  if (!ok) {
    if (pathname.startsWith("/api/")) {
      return finish(
        NextResponse.json({ error: "No autorizado" }, { status: 401 }),
        pathname,
      );
    }
    const loginUrl = new URL("/login", request.url);
    const next = `${pathname}${request.nextUrl.search}`;
    if (next && next !== "/") {
      loginUrl.searchParams.set("next", next);
    }
    return finish(NextResponse.redirect(loginUrl), pathname);
  }

  return finish(NextResponse.next(), pathname);
}

export const config = {
  matcher: [
    /*
     * Todo excepto estáticos de Next y assets comunes.
     * Públicos: /, /login, /c/*, /santiago, /g/*, sitemap, robots.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
