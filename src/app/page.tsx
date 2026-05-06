export const dynamic = "force-dynamic";

import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import HeroSection from "@/components/HeroSection";
import BannerCarousel from "@/components/BannerCarousel";
import ScrollRevealGrid from "@/components/ScrollRevealGrid";
import CategoryCarousel from "@/components/CategoryCarousel";
import ProductCard from "@/components/ProductCard";
import { SocialProofSection } from "@/components/SocialProofSection";
import TrustBadges from "@/components/TrustBadges";
import NewsletterStrip from "@/components/NewsletterStrip";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";

export default async function Home() {
  const [products, banners, categories, promoSetting] = await Promise.all([
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
    db.category.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    db.setting.findUnique({ where: { key: "promo_banner" } }),
  ]);

  const promo = promoSetting
    ? JSON.parse(promoSetting.value)
    : { active: true, label: "Oferta especial", title: "Frete grátis em pedidos acima de R$ 150", description: "Entrega rápida para todo o Brasil. Aproveite!", ctaText: "Aproveitar agora →", ctaLink: "/produtos" };

  return (
    <>
      <HeaderServer />
      <main>
        {banners.length > 0 ? <BannerCarousel banners={banners} /> : <HeroSection />}

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-[#0F0F0F] dark:text-white">Categorias</h2>
          </div>
          <CategoryCarousel categories={categories} />
        </section>

        {/* Promo banner */}
        {promo.active && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="rounded-2xl bg-[#FFE14D] px-8 py-10 md:py-14 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <span className="inline-block px-3 py-1 rounded-[100px] bg-[#0F0F0F] text-white text-xs font-display font-bold uppercase tracking-wider">
                  {promo.label}
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-black text-[#0F0F0F] leading-tight">
                  {promo.title}
                </h2>
                {promo.description && (
                  <p className="text-[#0F0F0F]/70 text-sm font-body max-w-sm">
                    {promo.description}
                  </p>
                )}
              </div>
              <Link
                href={promo.ctaLink || "/produtos"}
                className="shrink-0 px-8 py-3.5 rounded-[100px] bg-[#FF3D5A] text-white font-display font-bold text-sm hover:bg-[#e62e4a] transition-colors duration-200"
              >
                {promo.ctaText}
              </Link>
            </div>
          </section>
        )}

        {/* Featured products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-[#0F0F0F] dark:text-white">Produtos em destaque</h2>
            <Link href="/produtos" className="text-sm font-semibold text-[#3B8BFF] hover:underline">
              Ver todos →
            </Link>
          </div>
          <ScrollRevealGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" staggerDelay={60}>
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={Number(product.price)}
                originalPrice={product.originalPrice ? Number(product.originalPrice) : null}
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

        {/* Por que a Mais Brinquedos + Trust badges */}
        <TrustBadges />

        {/* Newsletter / WhatsApp strip */}
        <NewsletterStrip />
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
