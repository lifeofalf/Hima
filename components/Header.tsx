import Link from "next/link";
import Logo from "./Logo";
import { locales, type Locale, type Dict } from "@/lib/i18n";

export default function Header({ locale, dict }: { locale: Locale; dict: Dict }) {
  return (
    <header className="site-header">
      <Link href={`/${locale}`} className="logo" aria-label="Hima Seafood">
        <Logo />
      </Link>
      <div className="header-right">
        <nav className="lang-switch" aria-label="Språk / Language">
          {locales.map((l) => (
            <Link key={l} href={`/${l}`} aria-current={l === locale} lang={l}>
              {l.toUpperCase()}
            </Link>
          ))}
        </nav>
        <a className="header-contact" href="#kontakt">
          {dict.nav.contact}
        </a>
      </div>
    </header>
  );
}
