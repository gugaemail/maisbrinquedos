"use client";

import { useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { showToast } from "@/components/Toast";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    emoji: string;
    imageUrl?: string;
  };
}

export default function ProductActions({ product }: Props) {
  const { addItem } = useCart();
  const { trackAddToCart } = useMetaPixel();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleAdd() {
    if (added) return;
    trackAddToCart({ id: product.id, name: product.name, price: product.price });

    if (btnRef.current) {
      animate(btnRef.current, {
        scale: [1, 0.93, 1.05, 1],
        duration: 400,
        ease: "outCubic",
        onComplete: () => {
          for (let i = 0; i < qty; i++) addItem(product);
          showToast(`${product.name} adicionado`);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        },
      });
    } else {
      for (let i = 0; i < qty; i++) addItem(product);
      showToast(`${product.name} adicionado`);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {/* Qty stepper */}
      <div style={{ display: "inline-flex", alignItems: "center", border: "1.5px solid var(--line-soft)", borderRadius: "var(--r-pill)", overflow: "hidden", flexShrink: 0, height: 52 }}>
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Diminuir quantidade"
          style={{ width: 44, height: "100%", border: "none", background: "transparent", color: "var(--ink)", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background var(--t-fast)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          −
        </button>
        <span style={{ minWidth: 36, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 600, color: "var(--ink)", userSelect: "none" }}>
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          aria-label="Aumentar quantidade"
          style={{ width: 44, height: "100%", border: "none", background: "transparent", color: "var(--ink)", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background var(--t-fast)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-sunken)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          +
        </button>
      </div>

      {/* CTA */}
      <button
        ref={btnRef}
        onClick={handleAdd}
        style={{
          flex: 1,
          height: 52,
          borderRadius: "var(--r-pill)",
          border: "none",
          background: added ? "var(--c-kiwi)" : "var(--c-cherry)",
          color: "#fff",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "background var(--t) var(--ease)",
          letterSpacing: "-0.01em",
        }}
      >
        {added ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Adicionado!
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Adicionar à sacola
          </>
        )}
      </button>
    </div>
  );
}
