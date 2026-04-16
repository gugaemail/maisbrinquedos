"use client";

import Link from "next/link";
import { useRef } from "react";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { animate } from "animejs";

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, increment, decrement } = useCart();
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const pixPrice = totalPrice * 0.95;

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

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] dark:text-white/60 mb-8 font-body">
          <Link href="/" className="hover:text-[#1A1A2E] dark:hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#1A1A2E] dark:text-white">Carrinho</span>
        </nav>

        <h1 className="text-3xl font-display font-extrabold text-[#1A1A2E] dark:text-white mb-8">
          Carrinho{totalItems > 0 && <span className="text-[#6B7080] text-xl font-medium ml-3">({totalItems} {totalItems === 1 ? "item" : "itens"})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🛒</span>
            <h2 className="text-xl font-display font-bold text-[#1A1A2E] dark:text-white mb-2">Seu carrinho está vazio</h2>
            <p className="text-[#6B7080] dark:text-white/60 font-body mb-6">Adicione produtos e volte aqui para finalizar sua compra.</p>
            <Link href="/" className="px-6 py-3 rounded-full bg-[#0057FF] text-white font-semibold hover:bg-[#0057FF]/90 transition-colors">
              Explorar produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el);
                    else itemRefs.current.delete(item.id);
                  }}
                  className="flex items-center gap-4 bg-white dark:bg-white/5 rounded-2xl border border-[#E2E6F0] dark:border-white/10 p-4"
                >
                  {/* Emoji thumb */}
                  <div className="w-16 h-16 rounded-xl bg-[#F0F4FF] dark:bg-white/5 flex items-center justify-center text-3xl shrink-0">
                    {item.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/produto/${item.id}`} className="text-sm font-display font-semibold text-[#1A1A2E] dark:text-white hover:text-[#0057FF] transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-sm font-bold text-[#1A1A2E] dark:text-white mt-1">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => decrement(item.id)}
                      className="w-8 h-8 rounded-full border border-[#E2E6F0] dark:border-white/15 flex items-center justify-center text-[#6B7080] dark:text-white/60 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors font-bold"
                      aria-label="Diminuir"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-[#1A1A2E] dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="w-8 h-8 rounded-full border border-[#E2E6F0] dark:border-white/15 flex items-center justify-center text-[#6B7080] dark:text-white/60 hover:border-[#0057FF] hover:text-[#0057FF] transition-colors font-bold"
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-sm font-bold text-[#1A1A2E] dark:text-white w-20 text-right shrink-0 hidden sm:block">
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-1.5 text-[#6B7080] hover:text-[#FF3D57] transition-colors shrink-0"
                    aria-label="Remover item"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#E2E6F0] dark:border-white/10 p-6 sticky top-24">
                <h2 className="text-lg font-display font-bold text-[#1A1A2E] dark:text-white mb-6">Resumo do pedido</h2>

                <div className="flex flex-col gap-3 text-sm font-body">
                  <div className="flex justify-between text-[#6B7080] dark:text-white/60">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "itens"})</span>
                    <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7080] dark:text-white/60">
                    <span>Frete</span>
                    <span className="text-[#00C48C] font-semibold">Calcular no checkout</span>
                  </div>
                  <div className="border-t border-[#E2E6F0] dark:border-white/10 pt-3 flex justify-between font-bold text-[#1A1A2E] dark:text-white text-base">
                    <span>Total</span>
                    <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-[#00C48C] font-semibold">
                    <span>⚡ No PIX (5% OFF)</span>
                    <span>R$ {pixPrice.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 flex items-center justify-center w-full px-6 py-4 rounded-full bg-[#0057FF] text-white font-display font-bold text-base hover:bg-[#0057FF]/90 transition-colors"
                >
                  Finalizar compra
                </Link>

                <Link
                  href="/"
                  className="mt-3 flex items-center justify-center w-full px-6 py-3 rounded-full border border-[#E2E6F0] dark:border-white/15 text-[#6B7080] dark:text-white/60 text-sm font-semibold hover:border-[#0057FF]/30 hover:text-[#1A1A2E] dark:hover:text-white transition-colors"
                >
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#1A1A2E] text-white/60 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-display font-bold text-white text-lg mb-1">Mais Brinquedos e Presentes</p>
            <p className="text-sm">Variedade, novidades e tecnologia em um só lugar.</p>
          </div>
          <div className="text-sm">
            <p>© 2026 Mais Brinquedos e Presentes</p>
            <p>maisbrinquedos.com.br</p>
          </div>
        </div>
      </footer>
    </>
  );
}
