"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pixPrice = totalPrice * 0.95;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, payer: { name, email } }),
      });

      if (!res.ok) throw new Error("Erro ao criar preferência de pagamento.");

      const data = await res.json();
      clear();
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
          <span className="text-6xl mb-4">🛒</span>
          <h1 className="text-2xl font-display font-bold text-[#1A1A2E] mb-2">Carrinho vazio</h1>
          <p className="text-[#6B7080] font-body mb-6">Adicione produtos antes de finalizar a compra.</p>
          <Link href="/" className="px-6 py-3 rounded-full bg-[#0057FF] text-white font-semibold hover:bg-[#0057FF]/90 transition-colors">
            Explorar produtos
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] mb-8 font-body">
          <Link href="/" className="hover:text-[#1A1A2E] transition-colors">Início</Link>
          <span>/</span>
          <Link href="/carrinho" className="hover:text-[#1A1A2E] transition-colors">Carrinho</Link>
          <span>/</span>
          <span className="text-[#1A1A2E]">Checkout</span>
        </nav>

        <h1 className="text-3xl font-display font-extrabold text-[#1A1A2E] mb-8">Finalizar compra</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleCheckout} className="flex flex-col gap-5">
            <h2 className="text-lg font-display font-bold text-[#1A1A2E]">Seus dados</h2>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-[#1A1A2E] font-body">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="João da Silva"
                className="px-4 py-3 rounded-xl border border-[#E2E6F0] bg-white text-[#1A1A2E] text-sm font-body focus:outline-none focus:border-[#0057FF] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-[#1A1A2E] font-body">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@email.com"
                className="px-4 py-3 rounded-xl border border-[#E2E6F0] bg-white text-[#1A1A2E] text-sm font-body focus:outline-none focus:border-[#0057FF] transition-colors"
              />
            </div>

            {/* Payment methods info */}
            <div className="rounded-2xl bg-[#F0F4FF] border border-[#0057FF]/10 p-4">
              <p className="text-sm font-display font-semibold text-[#1A1A2E] mb-3">Formas de pagamento aceitas</p>
              <div className="flex flex-wrap gap-2 text-xs font-body text-[#6B7080]">
                <span className="px-3 py-1 rounded-full bg-white border border-[#E2E6F0]">⚡ PIX (5% OFF)</span>
                <span className="px-3 py-1 rounded-full bg-white border border-[#E2E6F0]">💳 Cartão de crédito</span>
                <span className="px-3 py-1 rounded-full bg-white border border-[#E2E6F0]">💳 Cartão de débito</span>
                <span className="px-3 py-1 rounded-full bg-white border border-[#E2E6F0]">📄 Boleto</span>
              </div>
              <p className="text-xs text-[#6B7080] mt-3 font-body">
                Você será redirecionado ao Mercado Pago para escolher a forma de pagamento com segurança.
              </p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-[#FF3D57]/10 border border-[#FF3D57]/20 text-sm text-[#FF3D57] font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-full bg-[#0057FF] text-white font-display font-bold text-base hover:bg-[#0057FF]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Redirecionando..." : "Ir para o pagamento →"}
            </button>
          </form>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-[#E2E6F0] p-6 h-fit">
            <h2 className="text-lg font-display font-bold text-[#1A1A2E] mb-4">Resumo do pedido</h2>
            <div className="flex flex-col gap-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm font-body">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="flex-1 text-[#1A1A2E] line-clamp-1">{item.name}</span>
                  <span className="text-[#6B7080] shrink-0">x{item.quantity}</span>
                  <span className="font-semibold text-[#1A1A2E] shrink-0">
                    R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E2E6F0] pt-4 flex flex-col gap-2 text-sm font-body">
              <div className="flex justify-between text-[#6B7080]">
                <span>Total</span>
                <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-[#00C48C] font-semibold">
                <span>⚡ No PIX (5% OFF)</span>
                <span>R$ {pixPrice.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#1A1A2E] text-white/60 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm">
          <p>© 2026 Mais Brinquedos e Presentes • maisbrinquedos.com.br</p>
        </div>
      </footer>
    </>
  );
}
