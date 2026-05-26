import { notFound } from "next/navigation";
import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: `${category.name} — Mais Brinquedos e Presentes`,
    description: `Produtos de ${category.name} para todas as idades.`,
    alternates: { canonical: `/categoria/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await db.product.findMany({
    where: { category: { slug }, active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <HeaderServer />
      <main style={{ background: "var(--bg)", minHeight: "60vh" }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 96 }}>

          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 32 }}>
            <Link href="/" style={{ color: "var(--ink-3)", transition: "color var(--t-fast)" }}>Início</Link>
            <span>›</span>
            <Link href="/produtos" style={{ color: "var(--ink-3)", transition: "color var(--t-fast)" }}>Categorias</Link>
            <span>›</span>
            <span style={{ color: "var(--ink)" }}>{category.name}</span>
          </nav>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
            <div>
              <span className="t-eyebrow" style={{ display: "block", marginBottom: 8 }}>{category.name}</span>
              <h1 className="t-h1" style={{ margin: 0 }}>{category.name}.</h1>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.06em" }}>
              {products.length} PRODUTO{products.length !== 1 ? "S" : ""}
            </span>
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 20, borderBottom: "1.5px solid var(--line-soft)", marginBottom: 32, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)" }}>
              {products.length} resultado{products.length !== 1 ? "s" : ""}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Ordenar:</span>
              <select
                style={{ height: 36, padding: "0 12px", border: "1.5px solid var(--line-soft)", borderRadius: "var(--r-pill)", background: "var(--bg-elev)", color: "var(--ink)", fontSize: 13, fontFamily: "var(--font-body)", cursor: "pointer", outline: "none" }}
              >
                <option value="relevancia">Relevância</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
                <option value="avaliacao">Avaliação</option>
                <option value="novidades">Novidades</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {products.length > 0 ? (
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
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 0", textAlign: "center", gap: 16 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <h2 className="t-h2" style={{ margin: 0 }}>Nenhum brinquedo encontrado.</h2>
              <p style={{ color: "var(--ink-3)", fontSize: 15, margin: 0 }}>Em breve teremos novidades nesta categoria.</p>
              <Link href="/" className="btn btn-cherry" style={{ marginTop: 8 }}>
                Explorar loja
              </Link>
            </div>
          )}
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
