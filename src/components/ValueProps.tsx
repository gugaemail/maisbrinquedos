const items = [
  { icon: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM14 8h4l4 4v6h-2", title: "Frete grátis", desc: "Em compras acima de R$ 199 para todo o Brasil." },
  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Garantia ampliada", desc: "30 dias para trocar, 12 meses contra defeito." },
  { icon: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5", title: "Devolução fácil", desc: "Não gostou? A gente busca, sem custo." },
  { icon: "M2 5h20v14H2zM2 10h20M7 15h.01M12 15h.01", title: "12x sem juros", desc: "Ou 10% off pagando no Pix." },
];

export default function ValueProps() {
  return (
    <section style={{ borderTop: "1.5px solid var(--line)", borderBottom: "1.5px solid var(--line)", background: "var(--bg-elev)" }}>
      <div className="container value-props-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {items.map((it, i) => (
          <div
            key={it.title}
            className={`value-prop-item${i > 0 ? " has-divider" : ""}`}
            style={{
              padding: "32px 24px",
              display: "flex",
              gap: 18,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--bg-sunken)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--c-cherry)",
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={it.icon}/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{it.title}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (min-width: 721px) {
          .value-prop-item.has-divider { border-left: 1px solid var(--line-hair); }
        }
        @media (max-width: 720px) {
          .value-prop-item.has-divider { border-top: 1px solid var(--line-hair); }
        }
      `}</style>
    </section>
  );
}
