import type { Dict } from "@/lib/i18n";

const images = ["/images/chapter-fish.jpg", "/images/chapter-water.jpg", "/images/chapter-place.jpg"];

export default function Chapters({ dict }: { dict: Dict }) {
  return (
    <section className="chapters" id="historien">
      <div className="container">
        <div className="chapters-head">
          <p className="kicker">{dict.hero.kicker.split("·")[0].trim()}</p>
          <h2 className="section-heading">{dict.chapters.heading}</h2>
        </div>
        {dict.chapters.items.map((item, i) => (
          <article className="chapter" key={item.num}>
            <div className="chapter-text">
              <span className="chapter-num">{item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
            <div className="chapter-media">
              <img src={images[i]} alt={item.alt} loading="lazy" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
