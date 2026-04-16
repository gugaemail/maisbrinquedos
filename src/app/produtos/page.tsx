import Link from "next/link";
import Header from "@/components/Header";
import { ProductsWithFilter } from "@/components/ProductsWithFilter";
import { db } from "@/lib/db";

export const metadata = {
  title: "Todos os produtos — Mais Brinquedos e Presentes",
  description: "Explore toda a nossa linha de brinquedos, tech e presentes.",
};

export default async function ProdutosPage() {
  const products = await db.product.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] dark:text-white/60 mb-8 font-body">
          <Link href="/" className="hover:text-[#1A1A2E] dark:hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#1A1A2E] dark:text-white">Todos os produtos</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-extrabold text-[#1A1A2E] dark:text-white">
            Todos os produtos
            <span className="text-[#6B7080] dark:text-white/50 text-lg font-medium ml-3">({products.length})</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {["Brinquedos", "Tech & Celular", "Presentes", "Novidades"].map((cat) => {
            const slug = { "Tech & Celular": "tech", Brinquedos: "brinquedos", Presentes: "presentes", Novidades: "novidades" }[cat] ?? cat.toLowerCase();
            return (
              <Link key={cat} href={`/categoria/${slug}`}
                className="px-4 py-1.5 rounded-full border border-[#E2E6F0] dark:border-white/15 text-sm font-semibold text-[#6B7080] dark:text-white/70 hover:border-[#0057FF]/40 hover:text-[#0057FF] transition-colors font-body">
                {cat}
              </Link>
            );
          })}
        </div>

        <ProductsWithFilter
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
            category: {
              name: product.category.name,
              slug: product.category.slug,
              emoji: product.category.emoji,
            },
            imageUrl: product.images[0] ?? null,
            tag: product.tag,
            ageRange: (product.ageRange as import("@/components/AgeFilter").AgeRange) ?? undefined,
            productType: (product.productType as import("@/components/AgeFilter").ProductType) ?? undefined,
          }))}
        />
      </main>

      <footer className="bg-[#1A1A2E] text-white/60 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-display font-bold text-white text-lg mb-1">Mais Brinquedos e Presentes</p>
            <p className="text-sm">Variedade, novidades e tecnologia em um só lugar.</p>
          </div>
          <div className="text-sm">
            <p>© 2026 Mais Brinquedos e Presentes</p>
            <p>maisbrinquedos.com.br</p>
          </div>
        </div>
      </footer>
    </>
  );
}
