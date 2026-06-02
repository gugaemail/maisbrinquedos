import { headers } from "next/headers";
import { redirect } from "next/navigation";
import NovoUsuarioForm from "./NovoUsuarioForm";

export default async function NovoUsuarioPage() {
  const h = await headers();
  const role = h.get("x-user-role") ?? "operator";
  if (role !== "admin") redirect("/admin/dashboard");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-extrabold text-[#0F0F0F] dark:text-white">Novo usuário</h1>
        <p className="text-sm text-[#6B7080] dark:text-white/50 font-body mt-1">Crie um acesso ao painel administrativo</p>
      </div>
      <NovoUsuarioForm />
    </div>
  );
}
