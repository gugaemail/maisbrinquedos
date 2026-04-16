"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import CheckoutAuth, { type AuthMode } from "@/components/checkout/CheckoutAuth";
import CheckoutForm, { type CheckoutData, type PersonalData } from "@/components/checkout/CheckoutForm";

// ─── Cart empty state ─────────────────────────────────────────────────────────

function CartEmpty() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
        <span className="text-6xl mb-4">🛒</span>
        <h1 className="text-2xl font-display font-bold text-[#1A1A2E] dark:text-white mb-2">
          Carrinho vazio
        </h1>
        <p className="text-[#6B7080] font-body mb-6">
          Adicione produtos antes de finalizar a compra.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-[#0057FF] text-white font-semibold hover:bg-[#0046D4] transition-colors"
        >
          Explorar produtos
        </Link>
      </main>
    </>
  );
}

// ─── Order summary sidebar ────────────────────────────────────────────────────

function OrderSummary({
  items,
  totalPrice,
  collapsed,
  onToggle,
}: {
  items: ReturnType<typeof useCart>["items"];
  totalPrice: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pixPrice = totalPrice * 0.95;

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-[#E2E6F0] dark:border-white/10 overflow-hidden h-fit">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 md:cursor-default md:pointer-events-none"
      >
        <h2 className="text-base font-display font-bold text-[#1A1A2E] dark:text-white">
          Resumo do pedido
        </h2>
        <div className="flex items-center gap-3 md:hidden">
          <span className="text-base font-display font-bold text-[#0057FF]">
            R$ {totalPrice.toFixed(2).replace(".", ",")}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 text-[#6B7080] transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div className={`${collapsed ? "hidden" : "block"} md:block`}>
        <div className="px-6 pb-2 flex flex-col gap-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 text-sm font-body">
              <div className="w-10 h-10 rounded-lg bg-[#F8F9FC] dark:bg-white/8 flex items-center justify-center overflow-hidden shrink-0">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">{item.emoji}</span>
                )}
              </div>
              <span className="flex-1 text-[#1A1A2E] dark:text-white/80 line-clamp-1">
                {item.name}
              </span>
              <span className="text-[#6B7080] shrink-0">x{item.quantity}</span>
              <span className="font-semibold text-[#1A1A2E] dark:text-white shrink-0">
                R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E2E6F0] dark:border-white/10 mx-6 mt-3 pt-4 pb-6 flex flex-col gap-2 text-sm font-body">
          <div className="flex justify-between text-[#6B7080] dark:text-white/50">
            <span>Subtotal</span>
            <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between text-[#6B7080] dark:text-white/50">
            <span>Frete</span>
            <span className="text-[#00C48C]">A calcular</span>
          </div>
          <div className="flex justify-between font-bold text-[#1A1A2E] dark:text-white text-base mt-1">
            <span>Total</span>
            <span>R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between text-[#00C48C] font-semibold text-xs mt-0.5">
            <span>⚡ No PIX (5% OFF)</span>
            <span>R$ {pixPrice.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function CheckoutPageInner() {
  const { items, totalPrice, clear } = useCart();
  const { user, profile, isLoading: authLoading } = useCustomerAuth();
  const searchParams = useSearchParams();

  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [error, setError] = useState("");
  const [summaryColl, setSummaryColl] = useState(true);

  // If user is already authenticated, skip the auth screen
  useEffect(() => {
    if (!authLoading && user) {
      setAuthMode("login");
    }
  }, [authLoading, user]);

  // Show error if OAuth callback returned an error
  useEffect(() => {
    if (searchParams.get("auth_error")) {
      setError("Não foi possível autenticar com o Google. Tente novamente ou continue como visitante.");
    }
  }, [searchParams]);

  if (items.length === 0) return <CartEmpty />;

  // Build prefill from authenticated user's profile
  const prefill: Partial<PersonalData> | undefined = profile
    ? { name: profile.name ?? undefined, email: profile.email ?? undefined }
    : undefined;

  async function handleFormSubmit(data: CheckoutData) {
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          payer: {
            name: data.personal.name,
            email: data.personal.email,
            cpf: data.personal.cpf,
            phone: data.personal.phone,
          },
          shipping: {
            zip: data.address.zip,
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement,
            neighborhood: data.address.neighborhood,
            city: data.address.city,
            state: data.address.state,
          },
          consent: {
            marketingEmail: data.consent.consentMarketingEmail,
            marketingWhatsapp: data.consent.consentMarketingWhatsapp,
          },
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Erro ao criar preferência de pagamento.");
      }

      const { checkoutUrl } = await res.json();
      clear();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
      throw err; // re-throw so CheckoutForm stays in loading=false
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] mb-8 font-body">
          <Link href="/" className="hover:text-[#1A1A2E] dark:hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <Link href="/carrinho" className="hover:text-[#1A1A2E] dark:hover:text-white transition-colors">Carrinho</Link>
          <span>/</span>
          <span className="text-[#1A1A2E] dark:text-white">Checkout</span>
        </nav>

        <h1 className="text-3xl font-display font-extrabold text-[#1A1A2E] dark:text-white mb-8">
          Finalizar compra
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Left column — auth + form */}
          <div>
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-[#FF3D57]/10 border border-[#FF3D57]/20 text-sm text-[#FF3D57] font-body">
                {error}
              </div>
            )}

            {!authMode ? (
              <CheckoutAuth onSelect={setAuthMode} />
            ) : (
              <div>
                {/* Back to auth selection */}
                <button
                  type="button"
                  onClick={() => setAuthMode(null)}
                  className="flex items-center gap-1.5 text-sm text-[#6B7080] dark:text-white/50 hover:text-[#0057FF] transition-colors font-body mb-6"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Alterar forma de acesso
                </button>

                <CheckoutForm
                  authMode={authMode}
                  prefill={prefill}
                  onSubmit={handleFormSubmit}
                />
              </div>
            )}
          </div>

          {/* Right column — order summary */}
          <div className="md:sticky md:top-6">
            <OrderSummary
              items={items}
              totalPrice={totalPrice}
              collapsed={summaryColl}
              onToggle={() => setSummaryColl((v) => !v)}
            />
          </div>
        </div>
      </main>

      <footer className="bg-[#1A1A2E] text-white/60 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm font-body">
          <p>© 2026 Mais Brinquedos e Presentes • maisbrinquedos.com.br</p>
        </div>
      </footer>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutPageInner />
    </Suspense>
  );
}
