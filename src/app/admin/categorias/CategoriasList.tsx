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

const inp = "px-4 py-2 rounded-xl border border-[#E2E6F0] text-sm font-body text-[#0F0F0F] outline-none focus:border-[#3B8BFF] transition-colors w-full";

export default function CategoriasList({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Category, "id" | "order" | "active">>({ name: "", slug: "", emoji: "" });
  const [createForm, setCreateForm] = useState({ name: "", slug: "", emoji: "" });

  function startEdit(c: Category) {
    setEditingId(c.id);
    setEditForm({ name: c.name, slug: c.slug, emoji: c.emoji });
  }

  async function handleSaveEdit(id: string) {
    const res = await fetch(`/api/admin/categorias/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (!res.ok) { toast.error("Erro ao salvar"); return; }
    const updated: Category = await res.json();
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...updated } : c));
    setEditingId(null);
    toast.success("Categoria atualizada!");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...createForm, order: categories.length }),
    });
    if (!res.ok) { toast.error("Erro ao criar categoria"); return; }
    const created: Category = await res.json();
    setCategories((prev) => [...prev, created]);
    setCreateForm({ name: "", slug: "", emoji: "" });
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

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir "${name}"? Esta ação não pode ser desfeita.`)) return;
    const res = await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Erro ao excluir");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Categoria excluída");
  }

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
            {categories.map((c) =>
              editingId === c.id ? (
                <tr key={c.id} className="bg-[#F0F6FF]">
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <input
                        value={editForm.emoji}
                        onChange={(e) => setEditForm((f) => ({ ...f, emoji: e.target.value }))}
                        placeholder="Emoji"
                        className={`${inp} w-16 text-center`}
                      />
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Nome"
                        className={inp}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={editForm.slug}
                      onChange={(e) => setEditForm((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="slug-url"
                      className={inp}
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-[#6B7080]">—</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleSaveEdit(c.id)}
                        className="text-[#3B8BFF] text-xs font-semibold hover:underline"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-[#6B7080] text-xs hover:underline"
                      >
                        Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="hover:bg-[#F8F9FC] transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#0F0F0F]">{c.emoji} {c.name}</td>
                  <td className="px-4 py-4 text-[#6B7080] font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleToggle(c.id, c.active)}
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.active ? "bg-[#3DDC84]/10 text-[#3DDC84]" : "bg-[#6B7080]/10 text-[#6B7080]"}`}
                    >
                      {c.active ? "Ativa" : "Inativa"}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-[#3B8BFF] text-xs font-semibold hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="text-[#FF3D5A] text-xs font-semibold hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {creating ? (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-[#E2E6F0] p-6 flex flex-col gap-4">
          <h2 className="text-sm font-display font-bold text-[#0F0F0F]">Nova categoria</h2>
          <div className="grid grid-cols-3 gap-3">
            <input
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nome"
              required
              className={inp}
            />
            <input
              value={createForm.slug}
              onChange={(e) => setCreateForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="slug-url"
              required
              className={inp}
            />
            <input
              value={createForm.emoji}
              onChange={(e) => setCreateForm((f) => ({ ...f, emoji: e.target.value }))}
              placeholder="Emoji 🧸"
              required
              className={inp}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 rounded-full bg-[#3B8BFF] text-white text-sm font-semibold">
              Criar
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="px-6 py-2.5 rounded-full border border-[#E2E6F0] text-[#6B7080] text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="px-6 py-3 rounded-full bg-[#3B8BFF] text-white text-sm font-semibold hover:bg-[#0046CC] transition-colors"
        >
          + Nova categoria
        </button>
      )}
    </div>
  );
}
