"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  active: boolean;
  order: number;
}

export default function CategoriasList({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", emoji: "" });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: categories.length }),
    });
    if (!res.ok) { toast.error("Erro ao criar categoria"); return; }
    const created: Category = await res.json();
    setCategories((prev) => [...prev, created]);
    setForm({ name: "", slug: "", emoji: "" });
    setCreating(false);
    toast.success("Categoria criada!");
  }

  async function handleToggle(id: string, active: boolean) {
    const res = await fetch(`/api/admin/categorias/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    if (!res.ok) { toast.error("Erro ao atualizar"); return; }
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, active: !active } : c));
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir categoria? Os produtos vinculados ficarão sem categoria.")) return;
    const res = await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erro ao excluir"); return; }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Categoria excluída");
  }

  const inp = "px-4 py-2.5 rounded-xl border border-[#E2E6F0] text-sm font-body text-[#1A1A2E] outline-none focus:border-[#0057FF] transition-colors";

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-[#E2E6F0] overflow-hidden mb-6">
        <table className="w-full text-sm font-body">
          <thead className="border-b border-[#E2E6F0] bg-[#F8F9FC]">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7080] uppercase">Categoria</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7080] uppercase">Slug</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#6B7080] uppercase">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6F0]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8F9FC] transition-colors">
                <td className="px-6 py-4 font-semibold text-[#1A1A2E]">{c.emoji} {c.name}</td>
                <td className="px-4 py-4 text-[#6B7080]">{c.slug}</td>
                <td className="px-4 py-4 text-center">
                  <button onClick={() => handleToggle(c.id, c.active)}
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.active ? "bg-[#00C48C]/10 text-[#00C48C]" : "bg-[#6B7080]/10 text-[#6B7080]"}`}>
                    {c.active ? "Ativa" : "Inativa"}
                  </button>
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-[#FF3D57] text-xs font-semibold hover:underline">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {creating ? (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#E2E6F0] p-6 flex flex-col gap-4">
          <h2 className="text-sm font-display font-bold text-[#1A1A2E]">Nova categoria</h2>
          <div className="grid grid-cols-3 gap-3">
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nome" required className={inp} />
            <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="slug-url" required className={inp} />
            <input value={form.emoji} onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))} placeholder="Emoji 🧸" required className={inp} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 rounded-full bg-[#0057FF] text-white text-sm font-semibold">Criar</button>
            <button type="button" onClick={() => setCreating(false)} className="px-6 py-2.5 rounded-full border border-[#E2E6F0] text-[#6B7080] text-sm">Cancelar</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setCreating(true)} className="px-6 py-3 rounded-full bg-[#0057FF] text-white text-sm font-semibold hover:bg-[#0046CC] transition-colors">
          + Nova categoria
        </button>
      )}
    </div>
  );
}
