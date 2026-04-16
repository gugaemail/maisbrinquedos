import { db } from "@/lib/db";
import DashboardCharts from "./DashboardCharts";

async function getKpis(since: Date) {
  const [orders, topProducts, lowStock, revenueByDay] = await Promise.all([
    db.order.findMany({
      where: { createdAt: { gte: since } },
      select: { status: true, total: true },
    }),
    db.orderItem.groupBy({
      by: ["productName"],
      where: { order: { status: "APPROVED", createdAt: { gte: since } } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    db.product.findMany({
      where: { stock: { lte: 5 }, active: true },
      select: { id: true, name: true, stock: true },
      orderBy: { stock: "asc" },
    }),
    db.$queryRaw<{ day: string; revenue: number }[]>`
      SELECT DATE("createdAt") as day, SUM(total)::float as revenue
      FROM "Order"
      WHERE status = 'APPROVED' AND "createdAt" >= ${since}
      GROUP BY DATE("createdAt")
      ORDER BY day ASC
    `,
  ]);

  const approved = orders.filter((o) => o.status === "APPROVED");
  const rejected = orders.filter((o) => o.status === "REJECTED");
  const revenue = approved.reduce((acc, o) => acc + Number(o.total), 0);
  const avgTicket = approved.length > 0 ? revenue / approved.length : 0;
  const approvalRate =
    approved.length + rejected.length > 0
      ? (approved.length / (approved.length + rejected.length)) * 100
      : 0;

  const byStatus = [
    { name: "Aprovados", value: approved.length, fill: "#00C48C" },
    { name: "Pendentes", value: orders.filter((o) => o.status === "PENDING").length, fill: "#FFB800" },
    { name: "Rejeitados", value: rejected.length, fill: "#FF3D57" },
    { name: "Cancelados", value: orders.filter((o) => o.status === "CANCELLED").length, fill: "#6B7080" },
  ].filter((s) => s.value > 0);

  return {
    revenue,
    totalOrders: orders.length,
    avgTicket,
    approvalRate,
    topProducts,
    lowStock,
    byStatus,
    revenueByDay: revenueByDay.map((r) => ({
      day: String(r.day).slice(5, 10), // MM-DD
      revenue: Number(r.revenue),
    })),
  };
}

export default async function DashboardPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const kpis = await getKpis(since);

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-display font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-xs text-white/35 font-body mt-0.5">Últimos 30 dias</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <KpiCard label="Receita" value={fmt(kpis.revenue)} sub="pedidos aprovados" accent="#00C48C" />
        <KpiCard label="Pedidos" value={String(kpis.totalOrders)} sub="todos os status" accent="#0057FF" />
        <KpiCard label="Ticket médio" value={fmt(kpis.avgTicket)} sub="pedidos aprovados" accent="#FFB800" />
        <KpiCard
          label="Taxa aprovação"
          value={`${kpis.approvalRate.toFixed(1)}%`}
          sub="aprovados vs rejeitados"
          accent="#7B3FA0"
        />
      </div>

      <DashboardCharts
        revenueByDay={kpis.revenueByDay}
        byStatus={kpis.byStatus}
        topProducts={kpis.topProducts.map((p) => ({
          name: p.productName,
          qty: p._sum.quantity ?? 0,
        }))}
      />

      {/* Low stock */}
      {kpis.lowStock.length > 0 && (
        <div className="mt-8 bg-[#FF3D57]/8 border border-[#FF3D57]/15 rounded-2xl p-6">
          <h2 className="text-xs font-display font-bold text-[#FF3D57] uppercase tracking-wider mb-4">
            Estoque crítico — {kpis.lowStock.length} {kpis.lowStock.length === 1 ? "produto" : "produtos"}
          </h2>
          <div className="flex flex-col gap-2">
            {kpis.lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm font-body">
                <span className="text-white/70">{p.name}</span>
                <span className="font-semibold tabular-nums text-[#FF3D57]">{p.stock} un.</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/8 relative overflow-hidden group hover:bg-white/8 transition-colors duration-200">
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{ background: accent }}
      />
      <p className="text-[11px] text-white/40 font-body uppercase tracking-wider mb-2">{label}</p>
      <p
        className="text-2xl font-display font-bold leading-none tabular-nums tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="text-[11px] text-white/30 font-body mt-2">{sub}</p>
    </div>
  );
}
