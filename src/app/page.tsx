export const dynamic = "force-dynamic";

import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import HeroSection from "@/components/HeroSection";
import BannerCarousel from "@/components/BannerCarousel";
import CategoriesStrip from "@/components/CategoriesStrip";
import AudienceBanner from "@/components/AudienceBanner";
import BrandStory from "@/components/BrandStory";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";

export default async function Home() {
  const [featuredProducts, newProducts, discountProducts, banners, categories] = await Promise.all([
    db.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.product.findMany({
      where: { active: true, tag: "Novidade" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.product.findMany({
      where: { active: true, originalPrice: { not: null } },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.banner.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    db.category.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      <HeaderServer />
      <main>
        {/* Hero */}
        {banners.length > 0 ? <BannerCarousel banners={banners} /> : <HeroSection />}

        {/* Categories strip */}
        <CategoriesStrip categories={categories} />

        {/* Os queridinhos */}
        <FeaturedStrip
          eyebrow="Mais vendidos"
          title="Os queridinhos"
          href="/produtos"
          color="var(--c-cherry)"
          products={featuredProducts}
        />

        {/* Audience banner */}
        <AudienceBanner />

        {/* Bons descontos */}
        {discountProducts.length > 0 && (
          <FeaturedStrip
            eyebrow="Promoções"
            title="Bons descontos"
            href="/produtos?tag=oferta"
            color="var(--c-kiwi)"
            products={discountProducts}
          />
        )}

        {/* Brand story */}
        <BrandStory />

        {/* Novidades */}
        {newProducts.length > 0 && (
          <FeaturedStrip
            eyebrow="Recém chegados"
            title="Novidades"
            href="/produtos?tag=novidade"
            color="var(--c-sky)"
            products={newProducts}
          />
        )}
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}

interface Product {
  id: string;
  slug: string;
  name: string;
  price: unknown;
  originalPrice?: unknown;
  images: string[];
  tag?: string | null;
  category: { name: string };
}

function FeaturedStrip({
  eyebrow,
  title,
  href,
  color,
  products,
}: {
  eyebrow: string;
  title: string;
  href: string;
  color: string;
  products: Product[];
}) {
  if (!products.length) return null;

  return (
    <section style={{ padding: "var(--gap-9) 0", background: "var(--bg)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <span
              className="t-eyebrow"
              style={{ display: "block", marginBottom: 6, color }}
            >
              {eyebrow}
            </span>
            <h2 className="t-h2" style={{ margin: 0 }}>{title}</h2>
          </div>
          <Link
            href={href}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
            }}
          >
            VER TUDO →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid-products" data-density="comfy">
          {products.map((product) => (
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
            />
          ))}
        </div>
      </div>
    </section>
  );
}
