import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n";

/**
 * Settes miljøvariabelen SITE_PASSWORD (f.eks. på Vercel), krever hele
 * siden HTTP Basic Auth: brukernavn «hima», passord = variabelens verdi.
 * Uten variabelen (f.eks. lokal utvikling) er siden åpen.
 */
function requireAuth(request: NextRequest): NextResponse | null {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null;
  const expected = "Basic " + btoa(`hima:${password}`);
  if (request.headers.get("authorization") === expected) return null;
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Hima Trout"' },
  });
}

export function proxy(request: NextRequest) {
  const denied = requireAuth(request);
  if (denied) return denied;

  const { pathname } = request.nextUrl;

  // Statiske filer og interne stier: kun auth, ingen locale-omdirigering
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  // /himatrout-mønsteret fra QR-koder: pek til forbrukerdelen av siden
  const target = pathname === "/himatrout" ? `/${defaultLocale}#anlegget` : `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  const url = request.nextUrl.clone();
  url.pathname = target.split("#")[0];
  if (target.includes("#")) url.hash = target.split("#")[1];
  return NextResponse.redirect(url);
}

export const config = {
  // Kjører på alle stier slik at også modell, bilder og chunks er bak passord
  matcher: ["/(.*)"],
};
