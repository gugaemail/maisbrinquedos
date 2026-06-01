"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator";
  createdAt: string;
  lastSignIn: string | null;
}

const roleBadge: Record<string, string> = {
  admin: "bg-[#3B8BFF]/10 text-[#3B8BFF]",
  operator: "bg-[#6B7080]/10 text-[#6B7080] dark:text-white/50",
};

const roleLabel: Record<string, string> = {
  admin: "Administrador",
  operator: "Operador",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function UsuariosList({ users }: { users: User[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir o usuário "${name || "sem nome"}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/usuarios/${id}`, { method: "DELETE" });
    setDeleting(null);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Erro ao excluir usuário");
      return;
    }
    toast.success("Usuário excluído");
    router.refresh();
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-[#6B7080] dark:text-white/50 font-body">
        Nenhum usuário cadastrado.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E2E6F0] dark:border-white/10 overflow-hidden">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b border-[#E2E6F0] dark:border-white/10 bg-[#F8F9FC] dark:bg-white/4">
            <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40">Nome</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40">E-mail</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40">Papel</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40">Criado em</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40">Último acesso</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E6F0] dark:divide-white/10">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-[#F8F9FC] dark:hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-semibold text-[#0F0F0F] dark:text-white">{u.name || "—"}</td>
              <td className="px-6 py-4 text-[#6B7080] dark:text-white/50">{u.email}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role]}`}>
                  {roleLabel[u.role]}
                </span>
              </td>
              <td className="px-6 py-4 text-[#6B7080] dark:text-white/50">{formatDate(u.createdAt)}</td>
              <td className="px-6 py-4 text-[#6B7080] dark:text-white/50">{formatDate(u.lastSignIn)}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3 justify-end">
                  <Link
                    href={`/admin/usuarios/${u.id}`}
                    className="text-xs text-[#3B8BFF] font-semibold hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(u.id, u.name)}
                    disabled={deleting === u.id}
                    className="text-xs text-[#FF3D5A] font-semibold hover:underline disabled:opacity-50"
                  >
                    {deleting === u.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
