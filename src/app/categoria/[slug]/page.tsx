import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getProductsByCategory, products } from "@/lib/products";

const categoryMeta: Record<string, { label: string; emoji: string; description: string }> = {
  brinquedos: {
    label: "Brinquedos",
    emoji: "🧸",
    description: "Brinquedos para todas as idades. Do clássico ao mais moderno.",
  },
  tech: {
    label: "Tech & Celular",
    emoji: "📱",
    description: "Gadgets, acessórios e tudo que você precisa para o seu celular.",
  },
  presentes: {
    label: "Presentes",
    emoji: "🎁",
    description: "Presentes incríveis para toda ocasião. Surpreenda quem você ama.",
  },
  novidades: {
    label: "Novidades",
    emoji: "✨",
    description: "Os lançamentos mais recentes chegaram. Confira em primeira mão.",
  },
};

export function generateStaticParams() {
  return Object.keys(categoryMeta).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = categoryMeta[slug];
  if (!meta) return {};
  return {
    title: `${meta.label} — Mais Brinquedos e Presentes`,
    description: meta.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = categoryMeta[slug];
  if (!meta) notFound();

  // "novidades" shows all products tagged as Novidade, rest filter by slug
  const categoryProducts =
    slug === "novidades"
      ? products.filter((p) => p.tag === "Novidade")
      : getProductsByCategory(slug);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] mb-8 font-body">
          <Link href="/" className="hover:text-[#1A1A2E] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#1A1A2E]">{meta.label}</span>
        </nav>

        {/* Category header */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-5xl">{meta.emoji}</span>
          <div>
            <h1 className="text-3xl font-display font-extrabold text-[#1A1A2E]">{meta.label}</h1>
            <p className="text-[#6B7080] font-body mt-1">{meta.description}</p>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-[#6B7080] font-body mb-6">
          {categoryProducts.length} produto{categoryProducts.length !== 1 ? "s" : ""} encontrado{categoryProducts.length !== 1 ? "s" : ""}
        </p>

        {/* Products grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <Link
                key={product.id}
                href={`/produto/${product.id}`}
                className="group flex flex-col rounded-2xl bg-white border border-[#E2E6F0] overflow-hidden hover:shadow-lg hover:border-[#0057FF]/20 transition-all"
              >
                <div className="aspect-square bg-[#F0F4FF] flex items-center justify-center text-5xl relative">
                  {product.emoji}
                  {product.tag && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0057FF] text-white text-xs font-semibold">
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <span className="text-xs text-[#6B7080] font-body">{product.category}</span>
                  <h2 className="text-sm font-display font-semibold text-[#1A1A2E] leading-tight group-hover:text-[#0057FF] transition-colors">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-base font-bold text-[#1A1A2E]">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-[#6B7080] line-through font-body">
                        R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                      </p>
                    )}
                  </div>
                  {product.originalPrice && (
                    <p className="text-xs font-semibold text-[#00C48C]">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">📦</span>
            <h2 className="text-xl font-display font-bold text-[#1A1A2E] mb-2">Nenhum produto encontrado</h2>
            <p className="text-[#6B7080] font-body mb-6">Em breve teremos novidades nesta categoria.</p>
            <Link href="/" className="px-6 py-3 rounded-full bg-[#0057FF] text-white font-semibold hover:bg-[#0057FF]/90 transition-colors">
              Voltar para a loja
            </Link>
          </div>
        )}
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
