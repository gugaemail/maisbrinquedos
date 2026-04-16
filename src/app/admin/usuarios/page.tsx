import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase";
import Link from "next/link";
import UsuariosList from "./UsuariosList";

export default async function UsuariosPage() {
  const h = await headers();
  const role = h.get("x-user-role") ?? "operator";
  if (role !== "admin") redirect("/admin/dashboard");

  const sb = createSupabaseServiceClient();
  const { data, error } = await sb.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(error.message);

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email ?? "",
    name: (u.user_metadata?.name as string) ?? "",
    role: ((u.app_metadata?.role as string) ?? "operator") as "admin" | "operator",
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at ?? null,
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-[#1A1A2E]">Usuários</h1>
          <p className="text-sm text-[#6B7080] font-body mt-1">Gerencie quem tem acesso ao painel</p>
        </div>
        <Link
          href="/admin/usuarios/novo"
          className="px-5 py-2.5 rounded-full bg-[#0057FF] text-white text-sm font-display font-bold hover:bg-[#0046CC] transition-colors"
        >
          + Novo usuário
        </Link>
      </div>

      <UsuariosList users={users} />
    </div>
  );
}
