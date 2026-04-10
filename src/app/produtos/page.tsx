import Link from "next/link";
import Header from "@/components/Header";
import ScrollRevealGrid from "@/components/ScrollRevealGrid";
import { products } from "@/lib/products";

export const metadata = {
  title: "Todos os produtos — Mais Brinquedos e Presentes",
  description: "Explore toda a nossa linha de brinquedos, tech e presentes.",
};

export default function ProdutosPage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] mb-8 font-body">
          <Link href="/" className="hover:text-[#1A1A2E] transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#1A1A2E]">Todos os produtos</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-extrabold text-[#1A1A2E]">
            Todos os produtos
            <span className="text-[#6B7080] text-lg font-medium ml-3">({products.length})</span>
          </h1>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["Brinquedos", "Tech & Celular", "Presentes"].map((cat) => {
            const slug = cat === "Tech & Celular" ? "tech" : cat === "Brinquedos" ? "brinquedos" : "presentes";
            return (
              <Link
                key={cat}
                href={`/categoria/${slug}`}
                className="px-4 py-1.5 rounded-full border border-[#E2E6F0] text-sm font-semibold text-[#6B7080] hover:border-[#0057FF]/40 hover:text-[#0057FF] transition-colors font-body"
              >
                {cat}
              </Link>
            );
          })}
        </div>

        <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" staggerDelay={50}>
          {products.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

            return (
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
                  <h3 className="text-sm font-display font-semibold text-[#1A1A2E] leading-tight group-hover:text-[#0057FF] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-base font-bold text-[#1A1A2E]">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </p>
                    {discount && (
                      <span className="text-xs font-semibold text-[#00C48C]">{discount}% OFF</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </ScrollRevealGrid>
      </main>

      <footer className="bg-[#1A1A2E] text-white/60 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-display font-bold text-white text-lg mb-1">Mais Brinquedos e Presentes</p>
            <p className="text-sm">Variedade, novidades e tecnologia em um só lugar.</p>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <Link href="/categoria/brinquedos" className="hover:text-white transition-colors">Brinquedos</Link>
            <Link href="/categoria/tech" className="hover:text-white transition-colors">Tech & Celular</Link>
            <Link href="/categoria/presentes" className="hover:text-white transition-colors">Presentes</Link>
            <Link href="/categoria/novidades" className="hover:text-white transition-colors">Novidades</Link>
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
