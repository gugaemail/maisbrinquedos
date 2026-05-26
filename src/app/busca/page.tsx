import { Suspense } from "react";
import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";

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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", textAlign: "center", gap: 12 }}>
        <p style={{ color: "var(--ink-3)", fontSize: 15 }}>Digite pelo menos 2 caracteres para buscar.</p>
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 0", textAlign: "center", gap: 16 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h2 className="t-h2" style={{ margin: 0 }}>Nada encontrado.</h2>
        <p style={{ color: "var(--ink-3)", fontSize: 15, margin: 0 }}>
          Tente termos diferentes ou explore nossas categorias.
        </p>
        <Link href="/produtos" className="btn btn-cherry" style={{ marginTop: 8 }}>
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  return (
    <>
      <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 32 }}>
        {products.length} resultado{products.length !== 1 ? "s" : ""}
      </span>
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
    </>
  );
}

export default async function BuscaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <>
      <HeaderServer />
      <main style={{ background: "var(--bg)", minHeight: "60vh" }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 96 }}>

          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 32 }}>
            <Link href="/" style={{ color: "var(--ink-3)" }}>Início</Link>
            <span>›</span>
            <span style={{ color: "var(--ink)" }}>Busca</span>
          </nav>

          {query && (
            <span className="t-eyebrow" style={{ display: "block", marginBottom: 8 }}>VOCÊ BUSCOU POR</span>
          )}
          <h1 className="t-h1" style={{ margin: "0 0 40px" }}>
            {query ? `"${query}"` : "Buscar produtos"}
          </h1>

          <Suspense fallback={
            <div className="grid-products" data-density="comfy">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ aspectRatio: "1/1", borderRadius: "var(--r-md)" }} />
              ))}
            </div>
          }>
            <SearchResults query={query} />
          </Suspense>
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
