"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";

interface Props {
  revenueByDay: { day: string; revenue: number }[];
  byStatus: { name: string; value: number; fill: string }[];
  topProducts: { name: string; qty: number }[];
}

const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function buildChartStyle(isDark: boolean) {
  return {
    tick: { fill: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", fontSize: 11 },
    tooltip: {
      contentStyle: {
        background: isDark ? "#0F0F0F" : "#ffffff",
        border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
        borderRadius: 12,
        fontSize: 12,
        color: isDark ? "#fff" : "#0F0F0F",
      },
      itemStyle: { color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" },
      cursor: { fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
    },
    legend: { fontSize: 12, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" },
  };
}

export default function DashboardCharts({ revenueByDay, byStatus, topProducts }: Props) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("mb_admin_theme");
    setIsDark(saved !== "light");
  }, []);

  const CHART_STYLE = buildChartStyle(isDark);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Revenue line chart */}
      <div className="lg:col-span-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/8 dark:border-white/8 p-6">
        <h2 className="text-xs font-display font-semibold text-[#0F0F0F]/40 dark:text-white/40 uppercase tracking-wider mb-5">Receita diária</h2>
        {revenueByDay.length === 0 ? (
          <p className="text-sm text-[#0F0F0F]/25 dark:text-white/25 font-body">Sem dados no período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueByDay}>
              <XAxis dataKey="day" tick={CHART_STYLE.tick} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `R$${v}`} tick={CHART_STYLE.tick} width={60} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_STYLE.tooltip} formatter={(v) => fmt(Number(v))} />
              <Line type="monotone" dataKey="revenue" stroke="#3B8BFF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Status pie */}
      <div className="bg-black/5 dark:bg-white/5 rounded-2xl border border-black/8 dark:border-white/8 p-6">
        <h2 className="text-xs font-display font-semibold text-[#0F0F0F]/40 dark:text-white/40 uppercase tracking-wider mb-5">Por status</h2>
        {byStatus.length === 0 ? (
          <p className="text-sm text-[#0F0F0F]/25 dark:text-white/25 font-body">Sem pedidos no período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} strokeWidth={0}>
                {byStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Legend iconSize={8} wrapperStyle={CHART_STYLE.legend} />
              <Tooltip {...CHART_STYLE.tooltip} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top products bar chart */}
      <div className="lg:col-span-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/8 dark:border-white/8 p-6">
        <h2 className="text-xs font-display font-semibold text-[#0F0F0F]/40 dark:text-white/40 uppercase tracking-wider mb-5">Mais vendidos</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-[#0F0F0F]/25 dark:text-white/25 font-body">Sem vendas no período.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topProducts} layout="vertical">
              <XAxis type="number" tick={CHART_STYLE.tick} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={180} tick={CHART_STYLE.tick} axisLine={false} tickLine={false} />
              <Tooltip {...CHART_STYLE.tooltip} />
              <Bar dataKey="qty" fill="#3B8BFF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
