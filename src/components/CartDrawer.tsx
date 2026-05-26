"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { animate, stagger } from "animejs";

export default function CartDrawer() {
  const { items, totalItems, totalPrice, increment, decrement, removeItem, isDrawerOpen, closeDrawer } = useCart();
  const listRef = useRef<HTMLUListElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) closeDrawer();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
      const t = setTimeout(() => {
        if (listRef.current) {
          const children = listRef.current.querySelectorAll("li");
          if (children.length) {
            animate(children, {
              opacity: [0, 1],
              translateY: [10, 0],
              duration: 240,
              delay: stagger(50),
              ease: "outCubic",
            });
          }
        }
      }, 120);
      return () => { clearTimeout(t); document.body.style.overflow = ""; };
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      {/* Scrim */}
      <div
        onClick={closeDrawer}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: "rgba(14,14,16,0.42)",
          backdropFilter: "blur(2px)",
          opacity: isDrawerOpen ? 1 : 0,
          pointerEvents: isDrawerOpen ? "auto" : "none",
          transition: "opacity 300ms",
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        style={{
          position: "fixed",
          top: 0, right: 0, bottom: 0,
          width: "min(460px, 100vw)",
          background: "var(--bg-elev)",
          borderLeft: "1px solid var(--line-hair)",
          boxShadow: "-8px 0 40px rgba(14,14,16,0.12)",
          display: "flex",
          flexDirection: "column",
          zIndex: 201,
          transform: isDrawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 320ms cubic-bezier(.22,.61,.36,1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--line-hair)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CartIcon />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>
              Sua sacola
            </span>
            {totalItems > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 999, background: "var(--c-cherry)", color: "#fff", fontSize: 10, fontWeight: 700 }}>
                {totalItems}
              </span>
            )}
          </div>
          <button
            ref={closeBtnRef}
            onClick={closeDrawer}
            aria-label="Fechar carrinho"
            style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-sunken)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink-3)", transition: "background var(--t-fast)" }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {items.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, textAlign: "center", padding: "64px 0" }}>
              <BagIcon />
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--ink)", margin: 0 }}>
                Sacola vazia
              </p>
              <p style={{ fontSize: 14, color: "var(--ink-3)", margin: 0 }}>
                Adicione produtos para continuar
              </p>
              <Link href="/produtos" onClick={closeDrawer} className="btn btn-cherry btn-sm" style={{ marginTop: 8 }}>
                Ver loja
              </Link>
            </div>
          ) : (
            <ul ref={listRef} style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "var(--bg-sunken)", borderRadius: "var(--r-md)", padding: 12 }}
                >
                  {/* Product thumb 84×84 */}
                  <div style={{ width: 84, height: 84, borderRadius: "var(--r-sm)", background: "var(--bg-elev)", flexShrink: 0, overflow: "hidden", border: "1px solid var(--line-hair)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 32 }}>{item.emoji}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.name}
                    </p>
                    <p className="t-price" style={{ margin: "4px 0 8px", fontSize: 16, color: "var(--ink)" }}>
                      {fmt(item.price)}
                    </p>
                    {/* Qty stepper + remove */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        onClick={() => decrement(item.id)}
                        aria-label="Diminuir quantidade"
                        style={{ width: 28, height: 28, borderRadius: "var(--r-sm)", background: "var(--bg-elev)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
                      >
                        −
                      </button>
                      <span style={{ width: 24, textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increment(item.id)}
                        aria-label="Aumentar quantidade"
                        style={{ width: 28, height: 28, borderRadius: "var(--r-sm)", background: "var(--bg-elev)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remover item"
                        style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", color: "var(--ink-4)", fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.06em", textTransform: "uppercase", padding: 0 }}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: "1px solid var(--line-hair)", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--ink-3)" }}>
              <span>Subtotal</span>
              <span>{fmt(totalPrice)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--ink-3)" }}>
              <span>Frete</span>
              <span style={{ color: "var(--c-kiwi-deep)", fontWeight: 600 }}>Calcular no checkout</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid var(--line-soft)", paddingTop: 12 }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--ink)" }}>Total</span>
              <span className="t-price" style={{ fontSize: 22, color: "var(--ink)" }}>{fmt(totalPrice)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn btn-cherry"
              style={{ width: "100%", justifyContent: "center", height: 52 }}
            >
              Finalizar compra
              <ArrowRight />
            </Link>
            <p style={{ margin: 0, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)" }}>
              COMPRA SEGURA · ENTREGA EM ATÉ 5 DIAS ÚTEIS
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-cherry)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
