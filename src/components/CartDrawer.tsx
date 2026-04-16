"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[200] bg-[#1A1A2E]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        className={`fixed top-0 right-0 z-[201] h-full w-full max-w-md bg-white dark:bg-[#0D0D1A] border-l border-transparent dark:border-white/8 shadow-[-8px_0_40px_rgba(0,0,0,0.12)] dark:shadow-[-8px_0_60px_rgba(0,0,0,0.5)] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E6F0] dark:border-white/8">
          <div className="flex items-center gap-2">
            <CartIcon />
            <span className="font-display font-bold text-lg text-[#1A1A2E] dark:text-white">
              Carrinho
            </span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0057FF] text-white text-[10px] font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <button
            ref={closeBtnRef}
            onClick={closeDrawer}
            aria-label="Fechar carrinho"
            className="p-1.5 rounded-lg text-[#6B7080] dark:text-white/40 hover:text-[#1A1A2E] dark:hover:text-white hover:bg-[#F0F4FF] dark:hover:bg-white/8 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <span className="text-6xl">🛒</span>
              <p className="font-display font-semibold text-[#1A1A2E] dark:text-white text-lg">
                Seu carrinho está vazio
              </p>
              <p className="text-sm text-[#6B7080]">
                Adicione produtos para continuar
              </p>
              <Link
                href="/produtos"
                onClick={closeDrawer}
                className="mt-2 inline-flex items-center px-5 py-2.5 rounded-full bg-[#0057FF] text-white text-sm font-semibold hover:bg-[#0046D4] transition-colors"
              >
                Ver loja
              </Link>
            </div>
          ) : (
            <ul ref={listRef} className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 bg-[#F8F9FC] dark:bg-white/5 rounded-2xl p-3"
                >
                  {/* Product thumb */}
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/8 flex items-center justify-center overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.07)] shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{item.emoji}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1A1A2E] dark:text-white/85 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm font-bold text-[#0057FF]">
                      {fmt(item.price)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => decrement(item.id)}
                      aria-label="Diminuir quantidade"
                      className="w-7 h-7 rounded-lg bg-white dark:bg-white/8 border border-[#E2E6F0] dark:border-white/10 flex items-center justify-center text-[#6B7080] dark:text-white/50 hover:text-[#1A1A2E] dark:hover:text-white hover:border-[#0057FF] transition-colors text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-[#1A1A2E] dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increment(item.id)}
                      aria-label="Aumentar quantidade"
                      className="w-7 h-7 rounded-lg bg-white dark:bg-white/8 border border-[#E2E6F0] dark:border-white/10 flex items-center justify-center text-[#6B7080] dark:text-white/50 hover:text-[#1A1A2E] dark:hover:text-white hover:border-[#0057FF] transition-colors text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remover item"
                    className="p-1 text-[#6B7080] hover:text-[#FF3D57] transition-colors shrink-0"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E2E6F0] dark:border-white/8 px-5 py-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm text-[#6B7080] dark:text-white/40">
              <span>{totalItems} {totalItems === 1 ? "item" : "itens"}</span>
              <span className="text-xs">Frete calculado no checkout</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-[#1A1A2E] dark:text-white text-lg">Total</span>
              <span className="font-display font-bold text-[#0057FF] text-xl">{fmt(totalPrice)}</span>
            </div>
            <p className="text-xs text-[#00C48C] font-medium text-center">
              💚 5% de desconto pagando com PIX
            </p>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0057FF] text-white font-semibold text-sm hover:bg-[#0046D4] hover:shadow-[0_4px_20px_rgba(0,87,255,0.4)] transition-all duration-200"
            >
              Finalizar compra
              <ArrowRight />
            </Link>
            <button
              onClick={closeDrawer}
              className="w-full text-center text-sm text-[#6B7080] dark:text-white/35 hover:text-[#1A1A2E] dark:hover:text-white transition-colors py-1"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0057FF]">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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
