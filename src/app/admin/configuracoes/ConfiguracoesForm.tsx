"use client";

import { useState } from "react";
import { toast } from "sonner";

const PAYMENT_OPTIONS = [
  { key: "credit_card", label: "Cartão de crédito" },
  { key: "debit_card", label: "Cartão de débito" },
  { key: "pix", label: "PIX" },
  { key: "bolbradesco", label: "Boleto" },
];

interface Props {
  pixDiscountPercent: string;
  maxInstallments: string;
  freeShippingThreshold: string;
  paymentMethodsDisabled: string[];
}

export default function ConfiguracoesForm({
  pixDiscountPercent,
  maxInstallments,
  freeShippingThreshold,
  paymentMethodsDisabled,
}: Props) {
  const [pix, setPix] = useState(pixDiscountPercent);
  const [installments, setInstallments] = useState(maxInstallments);
  const [shipping, setShipping] = useState(freeShippingThreshold);
  const [disabled, setDisabled] = useState<string[]>(paymentMethodsDisabled);
  const [saving, setSaving] = useState(false);

  function togglePayment(key: string) {
    setDisabled((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/configuracoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pix_discount_percent: pix,
        max_installments: installments,
        free_shipping_threshold: shipping,
        payment_methods_disabled: JSON.stringify(disabled),
      }),
    });
    setSaving(false);
    if (!res.ok) { toast.error("Erro ao salvar configurações"); return; }
    toast.success("Configurações salvas!");
  }

  const inp = "px-4 py-3 rounded-xl border border-[#E2E6F0] text-sm font-body text-[#1A1A2E] outline-none focus:border-[#0057FF] transition-colors w-32";

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      <section className="bg-white rounded-2xl border border-[#E2E6F0] p-6 flex flex-col gap-6">
        <h2 className="text-sm font-display font-bold text-[#1A1A2E]">Pagamentos</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1A1A2E]">Desconto PIX (%)</p>
            <p className="text-xs text-[#6B7080] font-body">Percentual de desconto para pagamentos via PIX</p>
          </div>
          <input type="number" min="0" max="50" value={pix} onChange={(e) => setPix(e.target.value)} className={inp} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1A1A2E]">Máximo de parcelas</p>
            <p className="text-xs text-[#6B7080] font-body">Número máximo de parcelas sem juros</p>
          </div>
          <input type="number" min="1" max="24" value={installments} onChange={(e) => setInstallments(e.target.value)} className={inp} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1A1A2E]">Frete grátis a partir de (R$)</p>
            <p className="text-xs text-[#6B7080] font-body">Valor mínimo para frete grátis</p>
          </div>
          <input type="number" min="0" value={shipping} onChange={(e) => setShipping(e.target.value)} className={inp} />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-[#E2E6F0] p-6 flex flex-col gap-4">
        <h2 className="text-sm font-display font-bold text-[#1A1A2E]">Meios de pagamento</h2>
        <p className="text-xs text-[#6B7080] font-body">Desmarque para desabilitar no checkout</p>
        <div className="flex flex-col gap-3">
          {PAYMENT_OPTIONS.map((opt) => (
            <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!disabled.includes(opt.key)}
                onChange={() => togglePayment(opt.key)}
                className="w-4 h-4 accent-[#0057FF]"
              />
              <span className="text-sm font-body text-[#1A1A2E]">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="self-start px-8 py-3 rounded-full bg-[#0057FF] text-white font-display font-bold text-sm hover:bg-[#0046CC] transition-colors disabled:opacity-60"
      >
        {saving ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}
