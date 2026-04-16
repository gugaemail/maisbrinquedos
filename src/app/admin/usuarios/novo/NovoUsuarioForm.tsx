"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const input = "w-full px-4 py-3 rounded-xl border border-[#E2E6F0] text-sm font-body text-[#1A1A2E] outline-none focus:border-[#0057FF] transition-colors bg-white";

export default function NovoUsuarioForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "operator" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Nome obrigatório (mín. 2 caracteres)";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "E-mail inválido";
    if (form.password.length < 8) errs.password = "Senha deve ter ao menos 8 caracteres";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    const res = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Erro ao criar usuário");
      return;
    }
    toast.success("Usuário criado com sucesso!");
    router.push("/admin/usuarios");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#1A1A2E] font-body">Nome completo</label>
        <input
          className={input}
          placeholder="Ex: Maria Silva"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        {errors.name && <p className="text-xs text-[#FF3D57]">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#1A1A2E] font-body">E-mail</label>
        <input
          type="email"
          className={input}
          placeholder="maria@maisbrinquedos.com.br"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        {errors.email && <p className="text-xs text-[#FF3D57]">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#1A1A2E] font-body">Senha temporária</label>
        <input
          type="password"
          className={input}
          placeholder="Mínimo 8 caracteres"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />
        {errors.password && <p className="text-xs text-[#FF3D57]">{errors.password}</p>}
        <p className="text-xs text-[#6B7080]">O usuário poderá alterar a senha após o primeiro acesso.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#1A1A2E] font-body">Papel</label>
        <select
          className={input}
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
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
          {saving ? "Criando..." : "Criar usuário"}
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
