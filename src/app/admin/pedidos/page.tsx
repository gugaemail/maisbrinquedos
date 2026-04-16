import { db } from "@/lib/db";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pendente",    color: "bg-[#FFB800]/12 text-[#FFB800]" },
  APPROVED:  { label: "Aprovado",   color: "bg-[#00C48C]/12 text-[#00C48C]" },
  REJECTED:  { label: "Rejeitado",  color: "bg-[#FF3D57]/12 text-[#FF3D57]" },
  CANCELLED: { label: "Cancelado",  color: "bg-white/8 text-white/35" },
  REFUNDED:  { label: "Reembolsado",color: "bg-[#7B3FA0]/12 text-[#7B3FA0]" },
};

export default async function PedidosPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      payerName: true,
      payerEmail: true,
      total: true,
      status: true,
      createdAt: true,
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-display font-bold text-white tracking-tight">Pedidos</h1>
        <p className="text-xs text-white/35 font-body mt-0.5">{orders.length} recentes</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="border-b border-white/8">
            <tr>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Cliente</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Itens</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Total</th>
              <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Data</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {orders.map((o) => {
              const s = STATUS_LABELS[o.status] ?? STATUS_LABELS.PENDING;
              return (
                <tr key={o.id} className="hover:bg-white/4 transition-colors duration-100">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white/90">{o.payerName}</p>
                    <p className="text-xs text-white/35">{o.payerEmail}</p>
                  </td>
                  <td className="px-4 py-4 text-white/40 tabular-nums">{o._count.items}</td>
                  <td className="px-4 py-4 text-right font-semibold text-white/70 tabular-nums">
                    R$ {Number(o.total).toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.color}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/35 text-xs tabular-nums">
                    {o.createdAt.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/admin/pedidos/${o.id}`} className="text-[#0057FF] text-xs font-semibold hover:text-blue-400 transition-colors">
                      Ver
                    </Link>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-white/25 text-sm">Nenhum pedido ainda.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
