export default function PromoMarquee() {
  const items = [
    { tag: "FRETE", text: "Frete grátis acima de R$199" },
    { tag: "TROCA", text: "Troca fácil em 30 dias" },
    { tag: "PIX", text: "10% de desconto no PIX" },
    { tag: "PARCEL", text: "Parcele em até 12x" },
    { tag: "ORIG", text: "Produtos 100% originais" },
    { tag: "SAFE", text: "Compra 100% segura" },
  ];

  const allItems = [...items, ...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {allItems.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", border: "1.5px solid var(--ink)", borderRadius: 4, background: "transparent" }}>
              {item.tag}
            </span>
            {item.text}
            <span style={{ opacity: 0.4 }}>✻</span>
          </span>
        ))}
      </div>
    </div>
  );
}
