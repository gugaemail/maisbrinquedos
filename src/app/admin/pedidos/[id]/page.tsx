import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import OrderStatusButton from "./OrderStatusButton";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendente",     color: "bg-[#FFB800]/10 text-[#FFB800]" },
  APPROVED:  { label: "Aprovado",     color: "bg-[#3DDC84]/10 text-[#3DDC84]" },
  REJECTED:  { label: "Rejeitado",    color: "bg-[#FF3D5A]/10 text-[#FF3D5A]" },
  CANCELLED: { label: "Cancelado",    color: "bg-[#6B7080]/10 text-[#6B7080] dark:text-white/50" },
  REFUNDED:  { label: "Reembolsado",  color: "bg-[#7B3FA0]/10 text-[#7B3FA0]" },
};

function fmt(value: number) {
  return value.toFixed(2).replace(".", ",");
}

function formatCPF(cpf: string | null) {
  if (!cpf) return null;
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11) return cpf;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatPhone(phone: string | null) {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
}

function formatZip(zip: string | null) {
  if (!zip) return null;
  const d = zip.replace(/\D/g, "");
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : zip;
}

export default async function PedidoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const s = STATUS_LABELS[order.status] ?? STATUS_LABELS.PENDING;
  const total = Number(order.total);

  const hasShipping = order.shippingStreet || order.shippingZip || order.shippingCity;

  const addressParts = [
    order.shippingStreet && `${order.shippingStreet}${order.shippingNumber ? `, ${order.shippingNumber}` : ""}`,
    order.shippingComplement,
    order.shippingNeighborhood,
    order.shippingCity && order.shippingState
      ? `${order.shippingCity} — ${order.shippingState}`
      : order.shippingCity || order.shippingState,
    formatZip(order.shippingZip),
  ].filter(Boolean);

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-[#0F0F0F] dark:text-white">Pedido</h1>
          <p className="text-xs text-[#6B7080] dark:text-white/50 font-mono mt-0.5">{order.id}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${s.color}`}>{s.label}</span>
          <p className="text-xs text-[#6B7080] dark:text-white/50">
            {new Date(order.createdAt).toLocaleString("pt-BR", {
              day: "2-digit", month: "2-digit", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Cliente + Pagamento */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E2E6F0] dark:border-white/10 p-6 space-y-1">
          <p className="text-xs text-[#6B7080] dark:text-white/40 font-semibold uppercase tracking-wide mb-2">Cliente</p>
          <p className="font-semibold text-[#0F0F0F] dark:text-white">{order.payerName}</p>
          <p className="text-sm text-[#6B7080] dark:text-white/50">{order.payerEmail}</p>
          {formatCPF(order.payerCpf) && (
            <p className="text-sm text-[#6B7080] dark:text-white/50">CPF: {formatCPF(order.payerCpf)}</p>
          )}
          {formatPhone(order.payerPhone) && (
            <p className="text-sm text-[#6B7080] dark:text-white/50">Tel: {formatPhone(order.payerPhone)}</p>
          )}
        </div>

        <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E2E6F0] dark:border-white/10 p-6 space-y-1">
          <p className="text-xs text-[#6B7080] dark:text-white/40 font-semibold uppercase tracking-wide mb-2">Pagamento</p>
          <p className="text-2xl font-display font-extrabold text-[#0F0F0F] dark:text-white">R$ {fmt(total)}</p>
          {order.mpPaymentId && (
            <p className="text-xs text-[#6B7080] dark:text-white/50 font-mono">Pagamento MP: {order.mpPaymentId}</p>
          )}
          {order.mpPreferenceId && (
            <p className="text-xs text-[#6B7080] dark:text-white/50 font-mono">Preferência MP: {order.mpPreferenceId}</p>
          )}
        </div>
      </div>

      {/* Endereço de entrega */}
      {hasShipping && (
        <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E2E6F0] dark:border-white/10 p-6 mb-4">
          <p className="text-xs text-[#6B7080] dark:text-white/40 font-semibold uppercase tracking-wide mb-3">Endereço de entrega</p>
          <div className="space-y-0.5">
            {addressParts.map((line, i) => (
              <p key={i} className="text-sm text-[#0F0F0F] dark:text-white">{line}</p>
            ))}
          </div>
        </div>
      )}

      {/* Itens */}
      <div className="bg-white dark:bg-[#18181B] rounded-2xl border border-[#E2E6F0] dark:border-white/10 overflow-hidden mb-6">
        <table className="w-full text-sm font-body">
          <thead className="border-b border-[#E2E6F0] dark:border-white/10 bg-[#F8F9FC] dark:bg-white/4">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40 uppercase">Produto</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40 uppercase">Qtd</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40 uppercase">Unit.</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-[#6B7080] dark:text-white/40 uppercase">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6F0] dark:divide-white/10">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-semibold text-[#0F0F0F] dark:text-white">{item.productName}</td>
                <td className="px-4 py-4 text-center text-[#6B7080] dark:text-white/50">{item.quantity}</td>
                <td className="px-4 py-4 text-right text-[#6B7080] dark:text-white/50">R$ {fmt(Number(item.unitPrice))}</td>
                <td className="px-6 py-4 text-right font-semibold text-[#0F0F0F] dark:text-white">
                  R$ {fmt(Number(item.unitPrice) * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-[#E2E6F0] dark:border-white/10 bg-[#F8F9FC] dark:bg-white/4">
            <tr>
              <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-[#6B7080] dark:text-white/50">Total</td>
              <td className="px-6 py-4 text-right text-base font-extrabold text-[#0F0F0F] dark:text-white">R$ {fmt(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <OrderStatusButton orderId={order.id} currentStatus={order.status} />
    </div>
  );
}
