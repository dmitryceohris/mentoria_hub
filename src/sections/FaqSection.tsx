import { useT } from "../lib/i18n";

export function FaqSection() {
  const t = useT();

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-title">
      <div className="match-copy product-copy faq-copy">
        <h2 id="faq-title">{t.public.faqTitle}</h2>
        <p>{t.public.faqCopy}</p>
      </div>

      <div className="faq-console" aria-label={t.public.faqLabel}>
        {t.faq.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
