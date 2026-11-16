import type { Dict } from "@/lib/i18n";

export default function Hero({ dict }: { dict: Dict }) {
  return (
    <section className="hero">
      <div className="hero-bg" role="img" aria-label={dict.facility.fallbackAlt} />
      <div className="hero-content container">
        <p className="kicker">{dict.hero.kicker}</p>
        <h1 className="hero-title">{dict.hero.title}</h1>
        <p className="hero-sub">{dict.hero.sub}</p>
        <div className="hero-ctas">
          <a className="btn btn-solid" href="#historien">
            {dict.hero.storyCta}
          </a>
          <a className="btn" href="#anlegget">
            {dict.hero.exploreCta}
          </a>
        </div>
      </div>
      <p className="hero-scroll" aria-hidden="true">
        {dict.hero.scroll}
      </p>
    </section>
  );
}
