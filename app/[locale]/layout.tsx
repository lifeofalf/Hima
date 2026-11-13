import type { Metadata } from "next";
import localFont from "next/font/local";
import { locales, getDict, type Locale } from "@/lib/i18n";
import "../globals.css";

const reckless = localFont({
  src: [
    { path: "../../public/fonts/recklessneue-light.woff2", weight: "300" },
    { path: "../../public/fonts/recklessneue-regular.woff2", weight: "400" },
  ],
  variable: "--font-reckless",
  display: "swap",
});

const reader = localFont({
  src: "../../public/fonts/reader-light-pro.woff2",
  weight: "300",
  variable: "--font-reader",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDict(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: "Hima Seafood",
      images: ["/images/hero-valley.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale as Locale}>
      <body className={`${reckless.variable} ${reader.variable}`}>{children}</body>
    </html>
  );
}
