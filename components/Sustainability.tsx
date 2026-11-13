import type { Dict } from "@/lib/i18n";

export default function Sustainability({ dict }: { dict: Dict }) {
  return (
    <section className="sustain dark" id="baerekraft">
      <div className="sustain-bg" aria-hidden="true" />
      <div className="container">
        <h2 className="section-heading">{dict.sustain.heading}</h2>
        <div className="sustain-grid">
          {dict.sustain.items.map((item) => (
            <div className="sustain-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
