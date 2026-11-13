import type { Dict } from "@/lib/i18n";

export default function Cta({ dict }: { dict: Dict }) {
  return (
    <section className="cta" id="kontakt">
      <div className="container">
        <h2 className="section-heading">{dict.cta.heading}</h2>
        <p>{dict.cta.body}</p>
        <a className="btn btn-dark" href="mailto:info@himaseafood.com">
          {dict.cta.button}
        </a>
      </div>
    </section>
  );
}
