import Link from "next/link";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ScrollRevealGrid from "@/components/ScrollRevealGrid";

const categories = [
  { label: "Brinquedos", href: "/categoria/brinquedos", emoji: "🧸" },
  { label: "Tech & Celular", href: "/categoria/tech", emoji: "📱" },
  { label: "Presentes", href: "/categoria/presentes", emoji: "🎁" },
  { label: "Novidades", href: "/categoria/novidades", emoji: "✨" },
];

const featuredProducts = [
  { id: 1, name: "Controle Joystick Pro", price: 189.90, category: "Tech & Celular", tag: "Mais vendido" },
  { id: 2, name: "Kit Lego Criativo 500 peças", price: 249.90, category: "Brinquedos", tag: "Novidade" },
  { id: 3, name: "Caixa de Som Bluetooth", price: 159.90, category: "Tech & Celular", tag: null },
  { id: 4, name: "Boneca Interativa", price: 129.90, category: "Brinquedos", tag: "Oferta" },
  { id: 5, name: "Kit Presente Gamer", price: 299.90, category: "Presentes", tag: "Mais vendido" },
  { id: 6, name: "Carrinho de Controle Remoto", price: 219.90, category: "Brinquedos", tag: null },
  { id: 7, name: "Capinha iPhone 15 Pro", price: 59.90, category: "Tech & Celular", tag: "Novidade" },
  { id: 8, name: "Quebra-Cabeça 1000 peças", price: 89.90, category: "Presentes", tag: null },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-display font-bold text-[#1A1A2E] mb-8">Categorias</h2>
          <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white border border-[#E2E6F0] hover:border-[#0057FF]/30 hover:shadow-lg transition-all"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <span className="font-display font-semibold text-sm text-[#1A1A2E] group-hover:text-[#0057FF] transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </ScrollRevealGrid>
        </section>

        {/* Featured products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-[#1A1A2E]">Produtos em destaque</h2>
            <Link href="/produtos" className="text-sm font-semibold text-[#0057FF] hover:underline">
              Ver todos →
            </Link>
          </div>
          <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" staggerDelay={60}>
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/produto/${product.id}`}
                className="group flex flex-col rounded-2xl bg-white border border-[#E2E6F0] overflow-hidden hover:shadow-lg hover:border-[#0057FF]/20 transition-all"
              >
                <div className="aspect-square bg-[#F0F4FF] flex items-center justify-center text-5xl relative">
                  🛍️
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
                  <p className="text-base font-bold text-[#1A1A2E] mt-1">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </Link>
            ))}
          </ScrollRevealGrid>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-white/60 py-10">
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
