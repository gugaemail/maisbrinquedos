"use client";

import Link from "next/link";
import { useRef } from "react";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";

const FREE_SHIPPING_THRESHOLD = 199;

export default function CartPageClient() {
  const { items, totalItems, totalPrice, removeItem, increment, decrement } = useCart();
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const progress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);

  function handleRemove(id: string) {
    const el = itemRefs.current.get(id);
    if (el) {
      animate(el, {
        translateX: [0, 80],
        opacity: [1, 0],
        duration: 280,
        ease: "inCubic",
        onComplete: () => removeItem(id),
      });
    } else {
      removeItem(id);
    }
  }

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <main style={{ background: "var(--bg)", flex: 1 }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 96 }}>

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 32 }}>
          <Link href="/" style={{ color: "var(--ink-3)" }}>Início</Link>
          <span>›</span>
          <span style={{ color: "var(--ink)" }}>Sacola</span>
        </nav>

        <h1 className="t-h1" style={{ margin: "0 0 40px" }}>
          Sacola{totalItems > 0 && <span style={{ color: "var(--ink-3)", fontSize: "0.45em", fontWeight: 400, marginLeft: 16 }}>({totalItems} {totalItems === 1 ? "item" : "itens"})</span>}
        </h1>

        {items.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 0", textAlign: "center", gap: 16 }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2 className="t-h2" style={{ margin: 0 }}>Sacola vazia.</h2>
            <p style={{ color: "var(--ink-3)", margin: 0 }}>Adicione produtos e volte aqui para finalizar sua compra.</p>
            <Link href="/" className="btn btn-cherry btn-lg" style={{ marginTop: 8 }}>
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40, alignItems: "start" }}>

            {/* Items list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el);
                    else itemRefs.current.delete(item.id);
                  }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 16, background: "var(--bg-elev)", borderRadius: "var(--r-lg)", border: "1px solid var(--line-hair)", padding: 20 }}
                >
                  {/* Image 140×140 */}
                  <div style={{ width: 140, height: 140, borderRadius: "var(--r-md)", background: "var(--bg-sunken)", flexShrink: 0, overflow: "hidden", border: "1px solid var(--line-hair)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 48 }}>{item.emoji}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 4px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 18, color: "var(--ink)", letterSpacing: "-0.01em" }}>
                      {item.name}
                    </p>
                    <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--c-kiwi-deep)", fontWeight: 600 }}>✓ Frete grátis</p>

                    {/* Qty stepper */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={() => decrement(item.id)}
                        aria-label="Diminuir"
                        style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--line-soft)", background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)", fontWeight: 700, fontSize: 16 }}
                      >
                        −
                      </button>
                      <span style={{ width: 28, textAlign: "center", fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{item.quantity}</span>
                      <button
                        onClick={() => increment(item.id)}
                        aria-label="Aumentar"
                        style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--line-soft)", background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)", fontWeight: 700, fontSize: 16 }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "var(--ink-4)", fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase" }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span className="t-price" style={{ fontSize: 22, color: "var(--ink)" }}>{fmt(item.price * item.quantity)}</span>
                    {item.quantity > 1 && (
                      <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink-4)" }}>{fmt(item.price)} un.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky summary */}
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ background: "var(--bg-elev)", borderRadius: "var(--r-lg)", border: "1px solid var(--line-hair)", padding: 28 }}>
                <h3 className="t-h3" style={{ margin: "0 0 20px" }}>Resumo</h3>

                {/* Free shipping progress */}
                {remaining > 0 && (
                  <div style={{ background: "var(--c-cream)", borderRadius: "var(--r-md)", padding: "12px 16px", marginBottom: 20 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--ink-2)", fontWeight: 500 }}>
                      Faltam <strong style={{ color: "var(--ink)" }}>{fmt(remaining)}</strong> para frete grátis
                    </p>
                    <div style={{ height: 6, background: "rgba(0,0,0,0.08)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progress}%`, background: "var(--c-kiwi)", borderRadius: 999, transition: "width 600ms var(--ease-out)" }} />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-3)" }}>
                    <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})</span>
                    <span>{fmt(totalPrice)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-3)" }}>
                    <span>Frete</span>
                    <span style={{ color: remaining === 0 ? "var(--c-kiwi-deep)" : "var(--ink-3)", fontWeight: remaining === 0 ? 600 : 400 }}>
                      {remaining === 0 ? "Grátis" : "Calcular no checkout"}
                    </span>
                  </div>

                  {/* Coupon */}
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <input
                      type="text"
                      placeholder="Cupom de desconto"
                      className="input"
                      style={{ flex: 1, height: 40, fontSize: 13 }}
                    />
                    <button className="btn btn-ghost" style={{ height: 40, padding: "0 14px", fontSize: 13 }}>Aplicar</button>
                  </div>

                  <div style={{ borderTop: "1.5px solid var(--line-soft)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>Total</span>
                    <span className="t-price" style={{ fontSize: 28, color: "var(--ink)" }}>{fmt(totalPrice)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn btn-cherry btn-lg" style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
                  Ir para o pagamento
                </Link>

                {/* Trust items */}
                <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
                  {[
                    { icon: "🔒", text: "Pagamento seguro" },
                    { icon: "🔄", text: "Troca grátis" },
                  ].map((t) => (
                    <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-3)" }}>
                      <span>{t.icon}</span>
                      <span>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 860px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 540px) {
          .cart-item-img { width: 80px !important; height: 80px !important; }
        }
      `}</style>
    </main>
  );
}
