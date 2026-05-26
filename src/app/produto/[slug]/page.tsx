import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HeaderServer from "@/components/HeaderServer";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { db } from "@/lib/db";

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: { slug, active: true },
    include: { category: true },
  });
  if (product) return product;

  const byId = await db.product.findUnique({
    where: { id: slug, active: true },
    include: { category: true },
  });
  if (byId) redirect(`/produto/${byId.slug}`);
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://maisbrinquedos.com.br";
  const imageUrl = product.images[0] ?? null;
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/produto/${slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${baseUrl}/produto/${slug}`,
      type: "website",
      ...(imageUrl ? { images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const images = product.images;
  const primaryImage = images[0] ?? null;
  const emoji = product.category.emoji;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://maisbrinquedos.com.br";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.length > 0 ? images : undefined,
    url: `${baseUrl}/produto/${slug}`,
    brand: { "@type": "Brand", name: "Mais Brinquedos e Presentes" },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: price.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${baseUrl}/produto/${slug}`,
      seller: { "@type": "Organization", name: "Mais Brinquedos e Presentes" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
      { "@type": "ListItem", position: 2, name: product.category.name, item: `${baseUrl}/categoria/${product.category.slug}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${baseUrl}/produto/${slug}` },
    ],
  };

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, active: true, NOT: { id: product.id } },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <HeaderServer />
      <main style={{ background: "var(--bg)" }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 96 }}>

          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-3)", marginBottom: 40 }}>
            <Link href="/" style={{ color: "var(--ink-3)" }}>Início</Link>
            <span>›</span>
            <Link href={`/categoria/${product.category.slug}`} style={{ color: "var(--ink-3)" }}>{product.category.name}</Link>
            <span>›</span>
            <span style={{ color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{product.name}</span>
          </nav>

          {/* Main grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px, 5vw, 80px)", alignItems: "start", marginBottom: 80 }}>

            {/* Gallery */}
            <div style={{ display: "flex", gap: 12 }}>
              {/* Thumbnails vertical */}
              {images.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                  {images.slice(0, 4).map((img, i) => (
                    <div
                      key={i}
                      style={{ width: 80, height: 80, borderRadius: "var(--r-sm)", overflow: "hidden", border: `2px solid ${i === 0 ? "var(--ink)" : "var(--line-hair)"}`, background: "var(--bg-sunken)", flexShrink: 0, cursor: "pointer" }}
                    >
                      <Image src={img} alt={`${product.name} ${i + 1}`} width={80} height={80} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{ aspectRatio: "1/1", borderRadius: "var(--r-xl)", overflow: "hidden", background: "var(--bg-sunken)", border: "1px solid var(--line-hair)", position: "relative" }}>
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 940px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(64px, 10vw, 120px)" }}>
                      {emoji}
                    </div>
                  )}

                  {/* Discount sticker */}
                  {discount && (
                    <div style={{ position: "absolute", top: 16, left: 16, transform: "rotate(-8deg)", animation: "spin-slow 14s linear infinite" }}>
                      <div className="chip chip-cherry" style={{ height: "auto", padding: "8px 14px", fontSize: 13, fontWeight: 700 }}>
                        −{discount}% OFF
                      </div>
                    </div>
                  )}

                  {/* Counter */}
                  {images.length > 1 && (
                    <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(14,14,16,0.6)", color: "#fff", borderRadius: "var(--r-pill)", padding: "4px 10px", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em" }}>
                      01/{String(images.length).padStart(2, "0")}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Chips */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="chip chip-solid">{product.category.name}</span>
                {product.tag === "Novidade" && <span className="chip chip-sun">NOVIDADE</span>}
                {product.tag === "mais-vendido" && <span className="chip chip-cherry">MAIS VENDIDO</span>}
                {product.tag === "edição-limitada" && <span className="chip" style={{ background: "var(--c-grape)", color: "#fff", borderColor: "var(--c-grape)" }}>EDIÇÃO LIMITADA</span>}
              </div>

              {/* Name */}
              <h1 className="t-h2" style={{ margin: 0 }}>{product.name}</h1>

              {/* Rating row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 16 16" fill="var(--c-sun)" aria-hidden="true">
                      <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.127L8 10.539l-3.708 2.039L5 8.451 2 5.528l4.146-.772L8 1z" />
                    </svg>
                  ))}
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>4.9</span>
                <span style={{ fontSize: 13, color: "var(--ink-3)" }}>(127 avaliações)</span>
                {product.stock <= 5 && product.stock > 0 && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-cherry)", fontWeight: 600 }}>
                    ÚLTIMAS {product.stock} UNIDADES
                  </span>
                )}
              </div>

              {/* Price card */}
              <div style={{ background: "var(--bg-sunken)", borderRadius: "var(--r-lg)", padding: 24 }}>
                {originalPrice && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, color: "var(--ink-4)", textDecoration: "line-through" }}>{fmt(originalPrice)}</span>
                    <span className="chip chip-cherry" style={{ height: 22, fontSize: 10 }}>−{discount}%</span>
                  </div>
                )}
                <div className="t-price" style={{ fontSize: 40, color: "var(--ink)", lineHeight: 1 }}>{fmt(price)}</div>
                <p style={{ margin: "8px 0 4px", fontSize: 13, color: "var(--c-kiwi-deep)", fontWeight: 600 }}>
                  ou {fmt(price * 0.9)} no Pix (−10%)
                </p>
                <p style={{ margin: 0, fontSize: 13, color: "var(--ink-3)" }}>
                  em até 12x de {fmt(price / 12)} sem juros
                </p>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12 }}>
                <BuyNowButton product={{ id: product.id, name: product.name, price, emoji, imageUrl: primaryImage ?? undefined }} />
                <AddToCartButton product={{ id: product.id, name: product.name, price, emoji, imageUrl: primaryImage ?? undefined }} />
              </div>

              {/* Trust items */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { icon: "🛡️", title: "Garantia 12 meses", desc: "Em todos os produtos" },
                  { icon: "🔄", title: "Troca em 30 dias", desc: "Sem burocracia" },
                  { icon: "✅", title: "Loja certificada", desc: "Compra segura" },
                ].map((t) => (
                  <div key={t.title} style={{ background: "var(--bg-sunken)", borderRadius: "var(--r-md)", padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: "var(--ink)", lineHeight: 1.3 }}>{t.title}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "var(--ink-4)", marginTop: 2 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ borderTop: "1.5px solid var(--line-soft)", paddingTop: 40, marginBottom: 80 }}>
            {/* Tab nav */}
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--line-hair)", marginBottom: 32 }}>
              {["Descrição", "Especificações", "Avaliações"].map((tab, i) => (
                <button
                  key={tab}
                  style={{
                    padding: "12px 24px",
                    background: "none",
                    border: "none",
                    borderBottom: i === 0 ? "2px solid var(--ink)" : "2px solid transparent",
                    fontFamily: "var(--font-body)",
                    fontWeight: i === 0 ? 700 : 500,
                    fontSize: 14,
                    color: i === 0 ? "var(--ink)" : "var(--ink-3)",
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Descrição (active) */}
            <div style={{ maxWidth: 720 }}>
              <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)", margin: 0 }}>
                {product.description}
              </p>
              {product.features.length > 0 && (
                <ul style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0 }}>
                  {product.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "var(--ink-2)" }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--c-kiwi)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Reviews */}
          <section style={{ marginBottom: 80 }}>
            <h2 className="t-h3" style={{ margin: "0 0 24px" }}>Avaliações</h2>
            <div style={{ display: "flex", gap: 40, alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div className="t-display" style={{ fontSize: 56, color: "var(--ink)" }}>4.9</div>
                <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 4 }}>
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 16 16" fill="var(--c-sun)" aria-hidden="true">
                      <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.127L8 10.539l-3.708 2.039L5 8.451 2 5.528l4.146-.772L8 1z" />
                    </svg>
                  ))}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--ink-4)" }}>127 avaliações</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {[
                { name: "Mariana S.", text: "Produto incrível, chegou no prazo e meu filho amou! Qualidade excelente.", stars: 5 },
                { name: "Rafael M.", text: "Comprei de presente e foi sucesso total. Embalagem caprichada e produto de primeira.", stars: 5 },
                { name: "Fernanda L.", text: "Atendimento ótimo, entrega rápida. Super recomendo a loja!", stars: 5 },
              ].map((r) => (
                <div key={r.name} style={{ background: "var(--bg-elev)", borderRadius: "var(--r-md)", border: "1px solid var(--line-hair)", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} width="12" height="12" viewBox="0 0 16 16" fill={s <= r.stars ? "var(--c-sun)" : "var(--line-soft)"} aria-hidden="true">
                        <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.127L8 10.539l-3.708 2.039L5 8.451 2 5.528l4.146-.772L8 1z" />
                      </svg>
                    ))}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>&ldquo;{r.text}&rdquo;</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-sunken)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "var(--ink-3)" }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{r.name}</p>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--c-kiwi-deep)", letterSpacing: "0.06em", textTransform: "uppercase" }}>✓ Verificado</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related products */}
          {related.length > 0 && (
            <section>
              <h2 className="t-h3" style={{ margin: "0 0 24px" }}>Você também pode gostar</h2>
              <div className="grid-products" data-density="comfy">
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug}
                    name={p.name}
                    price={Number(p.price)}
                    originalPrice={p.originalPrice ? Number(p.originalPrice) : null}
                    category={p.category.name}
                    imageUrl={p.images[0] ?? null}
                    tag={p.tag}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <style>{`
        @media (max-width: 940px) {
          .pdp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
