export const dynamic = "force-dynamic";

import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ProductsWithFilter } from "@/components/ProductsWithFilter";
import { db } from "@/lib/db";

export const metadata = {
  title: "Todos os produtos — Mais Brinquedos e Presentes",
  description: "Explore toda a nossa linha de brinquedos, tech e presentes.",
};

export default async function ProdutosPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      <HeaderServer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] dark:text-white/60 mb-8 font-body">
          <Link href="/" className="hover:text-[#0F0F0F] dark:hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#0F0F0F] dark:text-white">Todos os produtos</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-extrabold text-[#0F0F0F] dark:text-white">
            Todos os produtos
            <span className="text-[#6B7080] dark:text-white/50 text-lg font-medium ml-3">({products.length})</span>
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              className="px-4 py-1.5 rounded-full border border-[#E2E6F0] dark:border-white/15 text-sm font-semibold text-[#6B7080] dark:text-white/70 hover:border-[#3B8BFF]/40 hover:text-[#3B8BFF] transition-colors font-body"
            >
              {cat.emoji} {cat.name}
            </Link>
          ))}
        </div>

        <ProductsWithFilter
          products={products.map((product) => ({
            id: product.id,
            slug: product.slug,
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

      <WhatsAppButton />
      <Footer />
    </>
  );
}
