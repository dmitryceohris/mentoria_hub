import { faqItems } from "../data/content";

export function FaqSection() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="match-copy product-copy faq-copy">
        <h2 id="faq-title">Quick answers</h2>
        <p>A few basics for students, schools, and Mentoria partners.</p>
      </div>

      <div className="faq-console" aria-label="Frequently asked questions">
        {faqItems.map((item) => (
          <details key={item.question} open={item.open}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
