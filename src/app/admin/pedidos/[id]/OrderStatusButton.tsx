"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STATUSES: { value: string; label: string }[] = [
  { value: "PENDING",   label: "Pendente" },
  { value: "APPROVED",  label: "Aprovado" },
  { value: "REJECTED",  label: "Rejeitado" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "REFUNDED",  label: "Reembolsado" },
];

export default function OrderStatusButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();

  async function handleChange(status: string) {
    const res = await fetch(`/api/admin/pedidos/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) { toast.error("Erro ao atualizar status"); return; }
    toast.success("Status atualizado!");
    router.refresh();
  }

  return (
    <div>
      <p className="text-xs font-semibold text-[#6B7080] font-body mb-3">Alterar status manualmente</p>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            disabled={value === currentStatus}
            onClick={() => handleChange(value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              value === currentStatus
                ? "bg-[#3B8BFF] text-white cursor-default"
                : "border border-[#E2E6F0] text-[#6B7080] hover:bg-[#F8F9FC]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
