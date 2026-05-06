"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

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

export default function FreteAdminPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ShippingZone | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zonas de Frete — Motoboy</h1>
          <p className="text-sm text-gray-500 mt-1">
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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          {editing ? `Editar: ${editing.name}` : "Nova zona de entrega"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nome da zona</label>
            <input
              className={inputCls}
              placeholder="Ex: Centro, Zona Sul"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">CEP início</label>
            <input
              className={inputCls}
              placeholder="00000-000"
              maxLength={9}
              value={formatCep(form.cepStart)}
              onChange={(e) => setForm({ ...form, cepStart: e.target.value.replace(/\D/g, "") })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">CEP fim</label>
            <input
              className={inputCls}
              placeholder="00000-000"
              maxLength={9}
              value={formatCep(form.cepEnd)}
              onChange={(e) => setForm({ ...form, cepEnd: e.target.value.replace(/\D/g, "") })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Preço (R$)</label>
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
            <label className="block text-xs font-semibold text-gray-600 mb-1">Prazo (dias úteis)</label>
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
              <span className="text-sm text-gray-700">Ativa</span>
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
              className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">
            {zones.length} {zones.length === 1 ? "zona cadastrada" : "zonas cadastradas"}
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Carregando…</div>
        ) : zones.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            Nenhuma zona cadastrada. Crie a primeira zona acima.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">CEP início</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">CEP fim</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Preço</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prazo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {zones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{zone.name}</td>
                    <td className="px-4 py-4 text-gray-600 font-mono">
                      {zone.cepStart.slice(0, 5)}-{zone.cepStart.slice(5)}
                    </td>
                    <td className="px-4 py-4 text-gray-600 font-mono">
                      {zone.cepEnd.slice(0, 5)}-{zone.cepEnd.slice(5)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      R$ {zone.price.toFixed(2).replace(".", ",")}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {zone.deliveryDays === 1 ? "1 dia" : `${zone.deliveryDays} dias`}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleActive(zone)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors
                          ${zone.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${zone.active ? "bg-green-500" : "bg-gray-400"}`} />
                        {zone.active ? "Ativa" : "Inativa"}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => startEdit(zone)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded"
                          title="Editar"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteId(zone.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
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

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-gray-600 mb-5">
              Tem certeza que deseja remover esta zona de entrega? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-sm text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
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
