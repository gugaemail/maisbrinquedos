import Link from "next/link";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BannerCarousel from "@/components/BannerCarousel";
import ScrollRevealGrid from "@/components/ScrollRevealGrid";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { SocialProofSection } from "@/components/SocialProofSection";
import { db } from "@/lib/db";

const categories = [
  { label: "Brinquedos", href: "/categoria/brinquedos", emoji: "🧸" },
  { label: "Tech & Celular", href: "/categoria/tech", emoji: "📱" },
  { label: "Presentes", href: "/categoria/presentes", emoji: "🎁" },
  { label: "Novidades", href: "/categoria/novidades", emoji: "✨" },
];

export default async function Home() {
  const [products, banners] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      <Header />
      <main>
        {banners.length > 0 ? <BannerCarousel banners={banners} /> : <HeroSection />}

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-[#1A1A2E] dark:text-white">Categorias</h2>
          </div>
          <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.href} {...cat} />
            ))}
          </ScrollRevealGrid>
        </section>

        {/* Promo banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-[#0D0D1F] text-white px-8 py-10 md:py-14 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Background blobs */}
            <div className="absolute top-[-40px] left-[-40px] w-64 h-64 rounded-full bg-[#0057FF] opacity-25 blur-[70px] pointer-events-none" />
            <div className="absolute bottom-[-40px] right-[-30px] w-56 h-56 rounded-full bg-[#FF3D57] opacity-20 blur-[60px] pointer-events-none" />
            <div className="absolute top-[30%] right-[30%] w-40 h-40 rounded-full bg-[#FFB800] opacity-15 blur-[50px] pointer-events-none" />

            <div className="relative space-y-3 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-[#FF3D57]/20 border border-[#FF3D57]/30 text-[#FF3D57] text-xs font-semibold uppercase tracking-wider">
                Oferta especial
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold leading-tight">
                Frete grátis em pedidos{" "}
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#FFB800,#FF3D57)" }}>
                  acima de R$ 150
                </span>
              </h2>
              <p className="text-white/75 text-sm max-w-sm">
                Aproveite nossa seleção de produtos com entrega rápida para todo o Brasil.
              </p>
            </div>

            <Link
              href="/produtos"
              className="relative shrink-0 px-8 py-3.5 rounded-full bg-white text-[#1A1A2E] font-semibold text-sm hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-200"
            >
              Aproveitar agora →
            </Link>
          </div>
        </section>

        {/* Featured products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-[#1A1A2E] dark:text-white">Produtos em destaque</h2>
            <Link href="/produtos" className="text-sm font-semibold text-[#0057FF] hover:underline">
              Ver todos →
            </Link>
          </div>
          <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" staggerDelay={60}>
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={Number(product.price)}
                category={product.category.name}
                imageUrl={product.images[0] ?? null}
                tag={product.tag}
                index={i}
              />
            ))}
          </ScrollRevealGrid>
        </section>

        {/* Social Proof */}
        <SocialProofSection />
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-[#0D0D1F] text-white/65">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#0057FF] opacity-10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#7B3FA0] opacity-10 blur-[60px] pointer-events-none" />

        {/* Top divider line with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <p className="font-display font-bold text-white text-lg mb-2">Mais Brinquedos e Presentes</p>
            <p className="text-sm leading-relaxed">Variedade, novidades e tecnologia em um só lugar.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Categorias</p>
            <Link href="/categoria/brinquedos" className="hover:text-white transition-colors">Brinquedos</Link>
            <Link href="/categoria/tech" className="hover:text-white transition-colors">Tech & Celular</Link>
            <Link href="/categoria/presentes" className="hover:text-white transition-colors">Presentes</Link>
            <Link href="/categoria/novidades" className="hover:text-white transition-colors">Novidades</Link>
          </div>
          <div className="text-sm flex flex-col gap-1">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Info</p>
            <p className="text-white/60">© 2026 Mais Brinquedos e Presentes</p>
            <p className="text-white/60">maisbrinquedos.com.br</p>
          </div>
        </div>
      </footer>
    </>
  );
}
