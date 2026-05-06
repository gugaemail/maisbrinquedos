import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { db } from "@/lib/db";

const CATEGORY_BG: Record<string, string> = {
  "Tech & Celular": "#3B8BFF",
  "Brinquedos":     "#FFE14D",
  "Presentes":      "#3DDC84",
  "Novidades":      "#FF3D5A",
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  return {
    title: query ? `Resultados para "${query}"` : "Busca",
    robots: { index: false },
  };
}

async function SearchResults({ query }: { query: string }) {
  if (query.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <span className="text-5xl">🔍</span>
        <p className="font-display font-bold text-[#0F0F0F] dark:text-white text-lg">
          Digite pelo menos 2 caracteres para buscar
        </p>
      </div>
    );
  }

  const products = await db.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tag: { contains: query, mode: "insensitive" } },
      ],
    },
    include: { category: true },
    orderBy: { name: "asc" },
    take: 48,
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <span className="text-5xl">😕</span>
        <p className="font-display font-bold text-[#0F0F0F] dark:text-white text-lg">
          Nenhum resultado para &ldquo;{query}&rdquo;
        </p>
        <p className="text-[#6B7080] dark:text-white/60 text-sm font-body">
          Tente termos diferentes ou explore nossas categorias.
        </p>
        <Link href="/produtos" className="mt-2 px-6 py-3 rounded-full bg-[#3B8BFF] text-white font-semibold hover:bg-[#3B8BFF]/90 transition-colors">
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-[#6B7080] dark:text-white/60 font-body mb-6">
        <span className="font-semibold text-[#0F0F0F] dark:text-white">{products.length}</span>{" "}
        resultado{products.length !== 1 ? "s" : ""} para &ldquo;{query}&rdquo;
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const price = Number(product.price);
          const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
          const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
          const imageUrl = product.images[0] ?? null;
          const bg = CATEGORY_BG[product.category.name] ?? "#FFE14D";

          return (
            <Link
              key={product.id}
              href={`/produto/${product.slug}`}
              className="group flex flex-col rounded-2xl bg-white dark:bg-white/5 border border-[#E2E6F0] dark:border-white/10 overflow-hidden hover:shadow-lg hover:border-[#3B8BFF]/20 transition-all duration-200"
            >
              <div className="aspect-square relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: bg }}>
                {imageUrl ? (
                  <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                ) : (
                  <span className="text-5xl">{product.category.emoji}</span>
                )}
                {product.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#3B8BFF] text-white text-xs font-semibold">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1">
                <span className="text-xs text-[#6B7080] dark:text-white/60 font-body">{product.category.name}</span>
                <h2 className="text-sm font-display font-semibold text-[#0F0F0F] dark:text-white leading-tight group-hover:text-[#3B8BFF] transition-colors">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-base font-bold text-[#FF3D5A]">R$ {price.toFixed(2).replace(".", ",")}</p>
                  {discount && <span className="text-xs font-semibold text-[#3DDC84]">{discount}% OFF</span>}
                </div>
                {originalPrice && (
                  <p className="text-xs text-[#6B7080] line-through font-body">
                    R$ {originalPrice.toFixed(2).replace(".", ",")}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default async function BuscaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <>
      <HeaderServer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] dark:text-white/60 mb-8 font-body">
          <Link href="/" className="hover:text-[#0F0F0F] dark:hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#0F0F0F] dark:text-white">Busca</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-display font-extrabold text-[#0F0F0F] dark:text-white">
            {query ? `Resultados para "${query}"` : "Buscar produtos"}
          </h1>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#F5F5F2] animate-pulse aspect-square" />
            ))}
          </div>
        }>
          <SearchResults query={query} />
        </Suspense>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
