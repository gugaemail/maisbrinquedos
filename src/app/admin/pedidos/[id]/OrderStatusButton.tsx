"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STATUSES = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "REFUNDED"] as const;

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
        {STATUSES.map((s) => (
          <button
            key={s}
            disabled={s === currentStatus}
            onClick={() => handleChange(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              s === currentStatus
                ? "bg-[#0057FF] text-white cursor-default"
                : "border border-[#E2E6F0] text-[#6B7080] hover:bg-[#F8F9FC]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
