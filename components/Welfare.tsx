import type { Dict } from "@/lib/i18n";

export default function Welfare({ dict }: { dict: Dict }) {
  return (
    <section className="welfare" id="fiskevelferd">
      <div className="container">
        <div className="welfare-top">
          <div>
            <p className="kicker">{dict.welfare.kicker}</p>
            <h2 className="section-heading">{dict.welfare.heading}</h2>
            <p className="welfare-intro">{dict.welfare.intro}</p>
          </div>
          <div className="welfare-media">
            <img src="/images/dish-roe.jpg" alt="" loading="lazy" />
          </div>
        </div>
        <div className="welfare-grid">
          {dict.welfare.items.map((item) => (
            <div className="welfare-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
