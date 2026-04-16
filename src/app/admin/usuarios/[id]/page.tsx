import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase";
import EditarUsuarioForm from "./EditarUsuarioForm";

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const h = await headers();
  const role = h.get("x-user-role") ?? "operator";
  if (role !== "admin") redirect("/admin/dashboard");

  const { id } = await params;
  const sb = createSupabaseServiceClient();
  const { data, error } = await sb.auth.admin.getUserById(id);
  if (error || !data.user) redirect("/admin/usuarios");

  const u = data.user;
  const user = {
    id: u.id,
    email: u.email ?? "",
    name: (u.user_metadata?.name as string) ?? "",
    role: ((u.app_metadata?.role as string) ?? "operator") as "admin" | "operator",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-extrabold text-[#1A1A2E]">Editar usuário</h1>
        <p className="text-sm text-[#6B7080] font-body mt-1">{user.email}</p>
      </div>
      <EditarUsuarioForm user={user} />
    </div>
  );
}
