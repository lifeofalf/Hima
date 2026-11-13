import type { Dict } from "@/lib/i18n";

export default function Specs({ dict }: { dict: Dict }) {
  return (
    <section className="specs">
      <div className="container">
        <h2 className="section-heading">{dict.specs.heading}</h2>
        <dl className="specs-grid">
          {dict.specs.items.map((item) => (
            <div className="spec" key={item.label}>
              <dt className="value">{item.value}</dt>
              <dd className="label">{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
