import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import OrderStatusButton from "./OrderStatusButton";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "bg-[#FFB800]/10 text-[#FFB800]" },
  APPROVED: { label: "Aprovado", color: "bg-[#00C48C]/10 text-[#00C48C]" },
  REJECTED: { label: "Rejeitado", color: "bg-[#FF3D57]/10 text-[#FF3D57]" },
  CANCELLED: { label: "Cancelado", color: "bg-[#6B7080]/10 text-[#6B7080]" },
  REFUNDED: { label: "Reembolsado", color: "bg-[#7B3FA0]/10 text-[#7B3FA0]" },
};

export default async function PedidoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const s = STATUS_LABELS[order.status] ?? STATUS_LABELS.PENDING;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-[#1A1A2E]">Pedido</h1>
          <p className="text-xs text-[#6B7080] font-body mt-0.5 font-mono">{order.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${s.color}`}>{s.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-[#E2E6F0] p-6">
          <p className="text-xs text-[#6B7080] font-body mb-1">Cliente</p>
          <p className="font-semibold text-[#1A1A2E]">{order.payerName}</p>
          <p className="text-sm text-[#6B7080]">{order.payerEmail}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E6F0] p-6">
          <p className="text-xs text-[#6B7080] font-body mb-1">Pagamento</p>
          <p className="text-2xl font-display font-extrabold text-[#1A1A2E]">
            R$ {Number(order.total).toFixed(2).replace(".", ",")}
          </p>
          {order.mpPaymentId && (
            <p className="text-xs text-[#6B7080] font-mono mt-1">MP: {order.mpPaymentId}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E2E6F0] overflow-hidden mb-6">
        <table className="w-full text-sm font-body">
          <thead className="border-b border-[#E2E6F0] bg-[#F8F9FC]">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7080] uppercase">Produto</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#6B7080] uppercase">Qtd</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7080] uppercase">Unit.</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-[#6B7080] uppercase">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6F0]">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-semibold text-[#1A1A2E]">{item.productName}</td>
                <td className="px-4 py-4 text-center text-[#6B7080]">{item.quantity}</td>
                <td className="px-4 py-4 text-right text-[#6B7080]">
                  R$ {Number(item.unitPrice).toFixed(2).replace(".", ",")}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#1A1A2E]">
                  R$ {(Number(item.unitPrice) * item.quantity).toFixed(2).replace(".", ",")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderStatusButton orderId={order.id} currentStatus={order.status} />
    </div>
  );
}
