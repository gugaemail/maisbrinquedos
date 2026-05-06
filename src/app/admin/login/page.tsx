"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Credenciais inválidas");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="bg-white/6 border border-white/10 rounded-2xl p-10 w-full max-w-sm backdrop-blur-sm">
        <div className="mb-8">
          <p className="text-xl font-display font-bold text-white tracking-tight">Mais Brinquedos</p>
          <p className="text-xs text-white/35 font-body mt-1 uppercase tracking-widest">Painel Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/50 font-body">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-body text-white outline-none focus:border-[#3B8BFF] transition-colors placeholder:text-white/20"
              placeholder="admin@exemplo.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white/50 font-body">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-body text-white outline-none focus:border-[#3B8BFF] transition-colors placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3.5 rounded-full bg-[#3B8BFF] text-white font-display font-bold text-sm hover:bg-[#0046CC] hover:shadow-[0_4px_14px_rgba(0,87,255,0.4)] transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
