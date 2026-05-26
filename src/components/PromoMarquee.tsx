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
            <span className="chip chip-solid" style={{ fontSize: 10 }}>{item.tag}</span>
            {item.text}
            <span style={{ opacity: 0.4 }}>✻</span>
          </span>
        ))}
      </div>
    </div>
  );
}
