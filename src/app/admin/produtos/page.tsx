import { db } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";
import ProductSearch from "./ProductSearch";

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const products = await db.product.findMany({
    where: q
      ? { name: { contains: q, mode: "insensitive" } }
      : undefined,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-display font-bold text-white tracking-tight">Produtos</h1>
            <p className="text-xs text-white/35 font-body mt-0.5">{products.length} cadastrados</p>
          </div>
          <Suspense>
            <ProductSearch />
          </Suspense>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="px-5 py-2.5 rounded-full bg-[#0057FF] text-white text-sm font-semibold hover:bg-[#0046CC] hover:shadow-[0_4px_14px_rgba(0,87,255,0.4)] transition-all duration-200"
        >
          + Novo produto
        </Link>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/8 overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="border-b border-white/8">
            <tr>
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Produto</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Categoria</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Preço</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Estoque</th>
              <th className="text-center px-4 py-3 text-[10px] font-semibold text-white/35 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/4 transition-colors duration-100">
                <td className="px-6 py-4 font-semibold text-white/90">{p.name}</td>
                <td className="px-4 py-4 text-white/40">{p.category.name}</td>
                <td className="px-4 py-4 text-right text-white/70 tabular-nums">
                  R$ {Number(p.price).toFixed(2).replace(".", ",")}
                </td>
                <td className="px-4 py-4 text-right tabular-nums">
                  <span className={p.stock <= 5 ? "text-[#FF3D57] font-semibold" : "text-white/50"}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      p.active
                        ? "bg-[#00C48C]/12 text-[#00C48C]"
                        : "bg-white/8 text-white/30"
                    }`}
                  >
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/admin/produtos/${p.id}`}
                    className="text-[#0057FF] text-xs font-semibold hover:text-blue-400 transition-colors"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-white/25 text-sm">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
