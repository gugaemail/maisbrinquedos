"use client";

import { useState } from "react";
import { toast } from "sonner";

interface PromoBanner {
  active: boolean;
  label: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

const inp = "w-full px-4 py-2.5 rounded-xl border border-[#E2E6F0] text-sm font-body text-[#1A1A2E] outline-none focus:border-[#FF3D5A] transition-colors bg-white";

export default function PromoBannerForm({ initial }: { initial: PromoBanner }) {
  const [form, setForm] = useState<PromoBanner>(initial);
  const [saving, setSaving] = useState(false);

  function set(field: keyof PromoBanner, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promo-banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Banner promo salvo!");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E2E6F0] p-6 max-w-2xl space-y-5">
      {/* Preview */}
      {form.active && (
        <div className="rounded-xl bg-[#FFE14D] px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-block px-3 py-0.5 rounded-[100px] bg-[#0F0F0F] text-white text-[10px] font-display font-bold uppercase tracking-wider">
              {form.label || "Label"}
            </span>
            <p className="font-display font-black text-[#0F0F0F] text-lg leading-tight">{form.title || "Título do banner"}</p>
            <p className="font-body text-[#0F0F0F]/70 text-xs">{form.description}</p>
          </div>
          <span className="shrink-0 px-5 py-2 rounded-[100px] bg-[#FF3D5A] text-white font-display font-bold text-xs">
            {form.ctaText || "CTA"}
          </span>
        </div>
      )}

      {/* Active toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-display font-bold text-[#1A1A2E]">Banner visível na loja</p>
          <p className="text-xs text-[#6B7080] font-body">Desative para ocultar sem apagar as configurações</p>
        </div>
        <button
          type="button"
          onClick={() => set("active", !form.active)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.active ? "bg-[#3DDC84]" : "bg-[#E2E6F0]"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.active ? "translate-x-6" : "translate-x-0"}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-display font-bold text-[#1A1A2E] block mb-1">Título principal *</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inp} placeholder="Frete grátis em pedidos acima de R$ 150" />
        </div>
        <div>
          <label className="text-xs font-display font-bold text-[#1A1A2E] block mb-1">Label do badge</label>
          <input value={form.label} onChange={(e) => set("label", e.target.value)} className={inp} placeholder="Oferta especial" />
        </div>
        <div>
          <label className="text-xs font-display font-bold text-[#1A1A2E] block mb-1">Descrição</label>
          <input value={form.description} onChange={(e) => set("description", e.target.value)} className={inp} placeholder="Entrega rápida para todo o Brasil." />
        </div>
        <div>
          <label className="text-xs font-display font-bold text-[#1A1A2E] block mb-1">Texto do botão</label>
          <input value={form.ctaText} onChange={(e) => set("ctaText", e.target.value)} className={inp} placeholder="Aproveitar agora →" />
        </div>
        <div>
          <label className="text-xs font-display font-bold text-[#1A1A2E] block mb-1">Link do botão</label>
          <input value={form.ctaLink} onChange={(e) => set("ctaLink", e.target.value)} className={inp} placeholder="/produtos" />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2.5 rounded-[100px] bg-[#FF3D5A] text-white text-sm font-display font-bold hover:bg-[#e62e4a] transition-colors disabled:opacity-50"
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
