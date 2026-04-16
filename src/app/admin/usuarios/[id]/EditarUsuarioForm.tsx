"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const input = "w-full px-4 py-3 rounded-xl border border-[#E2E6F0] text-sm font-body text-[#1A1A2E] outline-none focus:border-[#0057FF] transition-colors bg-white";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator";
}

export default function EditarUsuarioForm({ user }: { user: User }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) { toast.error("Nome obrigatório"); return; }
    setSaving(true);
    const res = await fetch(`/api/admin/usuarios/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Erro ao salvar");
      return;
    }
    toast.success("Usuário atualizado!");
    router.push("/admin/usuarios");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#1A1A2E] font-body">E-mail</label>
        <input className={`${input} bg-[#F8F9FC] text-[#6B7080]`} value={user.email} disabled />
        <p className="text-xs text-[#6B7080]">O e-mail não pode ser alterado por aqui.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#1A1A2E] font-body">Nome completo</label>
        <input
          className={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#1A1A2E] font-body">Papel</label>
        <select
          className={input}
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "operator")}
        >
          <option value="operator">Operador — gerencia produtos, pedidos e banners</option>
          <option value="admin">Administrador — acesso total, incluindo usuários e configurações</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-full bg-[#0057FF] text-white font-display font-bold text-sm hover:bg-[#0046CC] transition-colors disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/usuarios")}
          className="px-6 py-3 rounded-full border border-[#E2E6F0] text-[#6B7080] text-sm font-semibold hover:bg-[#F8F9FC] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
