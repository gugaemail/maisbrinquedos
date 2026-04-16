"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.")) return;
    const res = await fetch(`/api/admin/produtos/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Erro ao excluir produto"); return; }
    toast.success("Produto excluído");
    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 rounded-full border border-[#FF3D57] text-[#FF3D57] text-sm font-semibold hover:bg-[#FF3D57]/5 transition-colors"
    >
      Excluir produto
    </button>
  );
}
