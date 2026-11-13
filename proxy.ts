import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "./lib/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/((?!_next|api|images|fonts|models|favicon.ico|.*\\..*).*)"],
};
