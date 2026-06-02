"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface CorreiosConfig {
  fromCep: string;
  services: string;
  active: boolean;
  connected: boolean;
  expiresAt: string | null;
  clientIdConfigured: boolean;
}

const EMPTY_CORREIOS: CorreiosConfig = {
  fromCep: "",
  services: "1,2",
  active: false,
  connected: false,
  expiresAt: null,
  clientIdConfigured: false,
};

interface ShippingZone {
  id: string;
  name: string;
  cepStart: string;
  cepEnd: string;
  price: number;
  deliveryDays: number;
  active: boolean;
}

const EMPTY_FORM = {
  name: "",
  cepStart: "",
  cepEnd: "",
  price: "",
  deliveryDays: "1",
  active: true,
};

function formatCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

function OAuthToastHandler() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const result = searchParams.get("melhorenvio");
    if (result === "success") toast.success("Melhor Envio conectado com sucesso!");
    if (result === "error") {
      const reason = searchParams.get("reason") ?? "erro desconhecido";
      toast.error(`Erro ao conectar Melhor Envio: ${reason}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function FreteAdminPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ShippingZone | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [correios, setCorreios] = useState<CorreiosConfig>(EMPTY_CORREIOS);
  const [correiosSaving, setCorreiosSaving] = useState(false);

  const fetchCorreios = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/frete/correios");
      if (!res.ok) return;
      const data = await res.json();
      setCorreios(data);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => { fetchCorreios(); }, [fetchCorreios]);

  async function handleSaveCorreios() {
    const fromCepClean = correios.fromCep.replace(/\D/g, "");
    if (fromCepClean.length !== 8) {
      toast.error("CEP de origem deve ter 8 dígitos");
      return;
    }
    const services = [
      correios.services.includes("1") ? "1" : "",
      correios.services.includes("2") ? "2" : "",
    ].filter(Boolean).join(",");
    if (!services) {
      toast.error("Selecione ao menos um serviço (PAC ou SEDEX)");
      return;
    }
    setCorreiosSaving(true);
    try {
      const res = await fetch("/api/admin/frete/correios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromCep: fromCepClean, services, active: correios.active }),
      });
      if (!res.ok) throw new Error();
      toast.success("Configuração salva");
      await fetchCorreios();
    } catch {
      toast.error("Erro ao salvar configuração");
    } finally {
      setCorreiosSaving(false);
    }
  }

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/frete/zonas");
      if (!res.ok) throw new Error("Erro ao carregar zonas");
      const data = await res.json();
      setZones(data.map((z: ShippingZone & { price: string | number }) => ({
        ...z,
        price: Number(z.price),
      })));
    } catch {
      toast.error("Erro ao carregar zonas de frete");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  function startEdit(zone: ShippingZone) {
    setEditing(zone);
    setForm({
      name: zone.name,
      cepStart: zone.cepStart,
      cepEnd: zone.cepEnd,
      price: zone.price.toFixed(2),
      deliveryDays: String(zone.deliveryDays),
      active: zone.active as unknown as boolean,
    });
  }

  function startNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  async function handleSave() {
    const payload = {
      name: form.name.trim(),
      cepStart: form.cepStart.replace(/\D/g, ""),
      cepEnd: form.cepEnd.replace(/\D/g, ""),
      price: parseFloat(form.price),
      deliveryDays: parseInt(form.deliveryDays),
      active: form.active,
    };

    if (!payload.name || payload.cepStart.length !== 8 || payload.cepEnd.length !== 8 || isNaN(payload.price)) {
      toast.error("Preencha todos os campos corretamente (CEPs devem ter 8 dígitos)");
      return;
    }
    if (payload.cepStart > payload.cepEnd) {
      toast.error("CEP inicial deve ser menor ou igual ao CEP final");
      return;
    }

    setSaving(true);
    try {
      const url = editing
        ? `/api/admin/frete/zonas/${editing.id}`
        : "/api/admin/frete/zonas";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      toast.success(editing ? "Zona atualizada" : "Zona criada");
      setEditing(null);
      setForm(EMPTY_FORM);
      await fetchZones();
    } catch {
      toast.error("Erro ao salvar zona");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/frete/zonas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Zona removida");
      setDeleteId(null);
      await fetchZones();
    } catch {
      toast.error("Erro ao remover zona");
    }
  }

  async function toggleActive(zone: ShippingZone) {
    try {
      await fetch(`/api/admin/frete/zonas/${zone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !zone.active }),
      });
      await fetchZones();
    } catch {
      toast.error("Erro ao atualizar status");
    }
  }

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-[#0F0F0F] dark:text-white bg-white dark:bg-[#0A0A0F] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Suspense><OAuthToastHandler /></Suspense>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Zonas de Frete — Motoboy</h1>
          <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
            Defina faixas de CEP para entrega via motoboy com preço fixo.
          </p>
        </div>
        <button
          onClick={startNew}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nova zona
        </button>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-white/10 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          {editing ? `Editar: ${editing.name}` : "Nova zona de entrega"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 mb-1">Nome da zona</label>
            <input
              className={inputCls}
              placeholder="Ex: Centro, Zona Sul"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 mb-1">CEP início</label>
            <input
              className={inputCls}
              placeholder="00000-000"
              maxLength={9}
              value={formatCep(form.cepStart)}
              onChange={(e) => setForm({ ...form, cepStart: e.target.value.replace(/\D/g, "") })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 mb-1">CEP fim</label>
            <input
              className={inputCls}
              placeholder="00000-000"
              maxLength={9}
              value={formatCep(form.cepEnd)}
              onChange={(e) => setForm({ ...form, cepEnd: e.target.value.replace(/\D/g, "") })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 mb-1">Preço (R$)</label>
            <input
              className={inputCls}
              placeholder="15,00"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 mb-1">Prazo (dias úteis)</label>
            <input
              className={inputCls}
              type="number"
              min="1"
              value={form.deliveryDays}
              onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600"
                checked={form.active as unknown as boolean}
                onChange={(e) => setForm({ ...form, active: e.target.checked as unknown as boolean })}
              />
              <span className="text-sm text-gray-700 dark:text-white/70">Ativa</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {saving ? "Salvando…" : editing ? "Salvar alterações" : "Criar zona"}
          </button>
          {(editing || form.name) && (
            <button
              type="button"
              onClick={() => { setEditing(null); setForm(EMPTY_FORM); }}
              className="px-5 py-2 text-sm text-gray-600 dark:text-white/50 border border-gray-200 dark:border-white/10 rounded-lg hover:border-gray-400 dark:hover:border-white/30 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/8">
          <p className="text-sm font-semibold text-gray-700 dark:text-white/70">
            {zones.length} {zones.length === 1 ? "zona cadastrada" : "zonas cadastradas"}
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400 dark:text-white/30">Carregando…</div>
        ) : zones.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400 dark:text-white/30">
            Nenhuma zona cadastrada. Crie a primeira zona acima.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/4">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">Nome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">CEP início</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">CEP fim</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">Preço</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">Prazo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{zone.name}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-white/50 font-mono">
                      {zone.cepStart.slice(0, 5)}-{zone.cepStart.slice(5)}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-white/50 font-mono">
                      {zone.cepEnd.slice(0, 5)}-{zone.cepEnd.slice(5)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-white">
                      R$ {zone.price.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-white/50">
                      {zone.deliveryDays === 1 ? "1 dia" : `${zone.deliveryDays} dias`}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleActive(zone)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors
                          ${zone.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/12"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${zone.active ? "bg-green-500" : "bg-gray-400 dark:bg-white/30"}`} />
                        {zone.active ? "Ativa" : "Inativa"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => startEdit(zone)}
                          className="p-1.5 text-gray-400 dark:text-white/30 hover:text-blue-600 transition-colors rounded"
                          title="Editar"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(zone.id)}
                          className="p-1.5 text-gray-400 dark:text-white/30 hover:text-red-600 transition-colors rounded"
                          title="Excluir"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Melhor Envio / Correios config */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Correios via Melhor Envio</h1>
            <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
              Configure PAC e SEDEX para entregas em todo o Brasil.
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            correios.connected
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${correios.connected ? "bg-green-500" : "bg-amber-500"}`} />
            {correios.connected ? "Conectado" : "Não conectado"}
          </span>
        </div>

        {/* Connection card */}
        <div className="mb-4 bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-white/10 p-5 flex items-center justify-between gap-4">
          <div>
            {correios.connected ? (
              <>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Conta Melhor Envio autorizada</p>
                {correios.expiresAt && (
                  <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
                    Token expira em {new Date(correios.expiresAt).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Autorize sua conta Melhor Envio</p>
                <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">Necessário para calcular PAC e SEDEX no checkout</p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {correios.connected && (
              <button
                onClick={async () => {
                  await fetch("/api/admin/frete/correios", { method: "DELETE" });
                  toast.success("Conta desconectada");
                  await fetchCorreios();
                }}
                className="px-4 py-2 border border-red-200 dark:border-red-500/30 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Desconectar
              </button>
            )}
            <a
              href="/api/auth/melhorenvio/authorize"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {correios.connected ? "Reconectar" : "Conectar Melhor Envio"}
            </a>
          </div>
        </div>

        {!correios.clientIdConfigured && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 text-sm text-amber-800 dark:text-amber-300">
            Configure as variáveis de ambiente <code className="font-mono font-bold">MELHOR_ENVIO_CLIENT_ID</code> e <code className="font-mono font-bold">MELHOR_ENVIO_CLIENT_SECRET</code> para habilitar a autorização OAuth.
          </div>
        )}

        <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 mb-1">CEP de origem</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-[#0F0F0F] dark:text-white bg-white dark:bg-[#0A0A0F] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="00000-000"
                maxLength={9}
                value={correios.fromCep.replace(/^(\d{5})(\d)/, "$1-$2")}
                onChange={(e) => setCorreios({ ...correios, fromCep: e.target.value.replace(/\D/g, "") })}
              />
              <p className="text-xs text-gray-400 dark:text-white/30 mt-1">CEP do seu endereço de despacho</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 mb-2">Serviços ativos</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-600"
                    checked={correios.services.includes("1")}
                    onChange={(e) => {
                      const parts = correios.services.split(",").filter(Boolean);
                      const next = e.target.checked
                        ? [...new Set([...parts, "1"])].sort().join(",")
                        : parts.filter((s) => s !== "1").join(",");
                      setCorreios({ ...correios, services: next });
                    }}
                  />
                  <span className="text-sm text-gray-700 dark:text-white/70">PAC (econômico)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-blue-600"
                    checked={correios.services.includes("2")}
                    onChange={(e) => {
                      const parts = correios.services.split(",").filter(Boolean);
                      const next = e.target.checked
                        ? [...new Set([...parts, "2"])].sort().join(",")
                        : parts.filter((s) => s !== "2").join(",");
                      setCorreios({ ...correios, services: next });
                    }}
                  />
                  <span className="text-sm text-gray-700 dark:text-white/70">SEDEX (expresso)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100 dark:border-white/8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-blue-600"
                checked={correios.active}
                onChange={(e) => setCorreios({ ...correios, active: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-white/70">Ativar Correios no checkout</span>
            </label>
            <button
              onClick={handleSaveCorreios}
              disabled={correiosSaving}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {correiosSaving ? "Salvando…" : "Salvar configuração"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#18181B] rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-100 dark:border-white/10">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-gray-600 dark:text-white/50 mb-5">
              Tem certeza que deseja remover esta zona de entrega? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-white/70 rounded-lg hover:border-gray-400 dark:hover:border-white/30 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
