import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HeaderServer from "@/components/HeaderServer";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";

const CATEGORY_BG: Record<string, string> = {
  "Tech & Celular": "#3B8BFF",
  "Brinquedos":     "#FFE14D",
  "Presentes":      "#3DDC84",
  "Novidades":      "#FF3D5A",
};

async function getProduct(slug: string) {
  // Try by slug first (canonical)
  const product = await db.product.findUnique({
    where: { slug, active: true },
    include: { category: true },
  });

  if (product) return product;

  // Backward compat: if not found by slug, try by id (UUID) and redirect
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
    brand: {
      "@type": "Brand",
      name: "Mais Brinquedos e Presentes",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: price.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${baseUrl}/produto/${slug}`,
      seller: {
        "@type": "Organization",
        name: "Mais Brinquedos e Presentes",
      },
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

  // Related products
  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, active: true, NOT: { id: product.id } },
    select: { id: true, slug: true, name: true, price: true, originalPrice: true, images: true, tag: true, category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <HeaderServer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] dark:text-white/60 mb-8 font-body">
          <Link href="/" className="hover:text-[#0F0F0F] dark:hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <Link href={`/categoria/${product.category.slug}`} className="hover:text-[#0F0F0F] dark:hover:text-white transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[#0F0F0F] dark:text-white truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div className="flex flex-col gap-3">
            <div
              className="aspect-square rounded-3xl flex items-center justify-center text-9xl relative overflow-hidden"
              style={{ backgroundColor: CATEGORY_BG[product.category.name] ?? "#FFE14D" }}
            >
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <span>{emoji}</span>
              )}
              {product.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#3B8BFF] text-white text-sm font-semibold z-10">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent hover:border-[#3B8BFF] transition-colors cursor-pointer relative"
                    style={{ backgroundColor: CATEGORY_BG[product.category.name] ?? "#FFE14D" }}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-sm text-[#6B7080] dark:text-white/60 font-body">{product.category.name}</span>
              <h1 className="text-3xl font-display font-extrabold text-[#0F0F0F] dark:text-white mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating summary */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5" aria-label="4.9 de 5 estrelas">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="16" height="16" viewBox="0 0 16 16" fill={s <= 4 ? "#FFB800" : "#FFB800"} aria-hidden="true">
                    <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.127L8 10.539l-3.708 2.039L5 8.451 2 5.528l4.146-.772L8 1z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-[#0F0F0F] dark:text-white">4.9</span>
              <span className="text-sm text-[#6B7080] dark:text-white/60 font-body">(127 avaliações)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-display font-extrabold text-[#0F0F0F] dark:text-white">
                R$ {price.toFixed(2).replace(".", ",")}
              </span>
              {originalPrice && discount && (
                <div className="flex flex-col">
                  <span className="text-sm text-[#6B7080] dark:text-white/50 line-through font-body">
                    R$ {originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-xs font-semibold text-[#3DDC84]">{discount}% OFF</span>
                </div>
              )}
            </div>

            <p className="text-sm text-[#6B7080] dark:text-white/60 font-body">
              Em até <strong className="text-[#0F0F0F] dark:text-white">12x</strong> de{" "}
              <strong className="text-[#0F0F0F] dark:text-white">R$ {(price / 12).toFixed(2).replace(".", ",")}</strong> sem juros
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3DDC84]/10 border border-[#3DDC84]/20 text-sm font-semibold text-[#3DDC84] w-fit">
              <span>⚡</span>
              <span>PIX: R$ {(price * 0.95).toFixed(2).replace(".", ",")} (5% OFF)</span>
            </div>

            <p className="text-sm font-body text-[#6B7080] dark:text-white/60">
              {product.stock <= 5 ? (
                <span className="text-[#FF3D5A] font-semibold">⚠ Apenas {product.stock} em estoque</span>
              ) : (
                <span>✓ Em estoque</span>
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <BuyNowButton product={{ id: product.id, name: product.name, price, emoji, imageUrl: primaryImage ?? undefined }} />
              <AddToCartButton product={{ id: product.id, name: product.name, price, emoji, imageUrl: primaryImage ?? undefined }} />
            </div>

            {product.features.length > 0 && (
              <div className="pt-4 border-t border-[#E2E6F0] dark:border-white/10">
                <h2 className="text-sm font-display font-bold text-[#0F0F0F] dark:text-white mb-3">Características</h2>
                <ul className="flex flex-col gap-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-body text-[#6B7080] dark:text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3B8BFF] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-[#E2E6F0] dark:border-white/10">
              <h2 className="text-sm font-display font-bold text-[#0F0F0F] dark:text-white mb-2">Descrição</h2>
              <p className="text-sm font-body text-[#6B7080] dark:text-white/70 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-16 pt-12 border-t border-[#E2E6F0] dark:border-white/10">
          <h2 className="text-xl font-display font-bold text-[#0F0F0F] dark:text-white mb-6">Avaliações dos clientes</h2>
          <div className="flex items-center gap-4 mb-8">
            <div className="text-center">
              <p className="text-5xl font-display font-black text-[#0F0F0F] dark:text-white">4.9</p>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="16" height="16" viewBox="0 0 16 16" fill="#FFB800" aria-hidden="true">
                    <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.127L8 10.539l-3.708 2.039L5 8.451 2 5.528l4.146-.772L8 1z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-[#6B7080] dark:text-white/60 font-body mt-1">127 avaliações</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Mariana S.", text: "Produto incrível, chegou no prazo e meu filho amou! Qualidade excelente.", stars: 5 },
              { name: "Rafael M.", text: "Comprei de presente e foi sucesso total. Embalagem caprichada e produto de primeira.", stars: 5 },
              { name: "Fernanda L.", text: "Atendimento ótimo, entrega rápida. Super recomendo a loja!", stars: 5 },
            ].map((r) => (
              <div key={r.name} className="rounded-2xl bg-white dark:bg-white/5 border border-[#E2E6F0] dark:border-white/8 p-5 flex flex-col gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 16 16" fill={s <= r.stars ? "#FFB800" : "#E2E6F0"} aria-hidden="true">
                      <path d="M8 1l1.854 3.756L14 5.528l-3 2.923.708 4.127L8 10.539l-3.708 2.039L5 8.451 2 5.528l4.146-.772L8 1z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-[#6B7080] dark:text-white/60 font-body leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-2 mt-auto">
                  <p className="text-sm font-semibold text-[#0F0F0F] dark:text-white font-body">{r.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#3DDC84]/10 text-[#3DDC84] border border-[#3DDC84]/20 font-semibold">✓ Verificado</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#E2E6F0] dark:border-white/10">
            <h2 className="text-xl font-display font-bold text-[#0F0F0F] dark:text-white mb-6">Você também pode gostar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => {
                const rPrice = Number(p.price);
                const rOriginal = p.originalPrice ? Number(p.originalPrice) : null;
                const rDiscount = rOriginal ? Math.round(((rOriginal - rPrice) / rOriginal) * 100) : null;
                const rImage = p.images[0] ?? null;
                return (
                  <Link
                    key={p.id}
                    href={`/produto/${p.slug}`}
                    className="group flex flex-col rounded-2xl bg-white dark:bg-white/5 border border-[#E2E6F0] dark:border-white/10 overflow-hidden hover:shadow-lg hover:border-[#3B8BFF]/20 transition-all duration-200"
                  >
                    <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: CATEGORY_BG[p.category.name] ?? "#FFE14D" }}>
                      {rImage ? (
                        <Image src={rImage} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-5xl">{p.category.emoji}</span>
                      )}
                      {p.tag && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#3B8BFF] text-white text-xs font-semibold">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <h3 className="text-sm font-display font-semibold text-[#0F0F0F] dark:text-white leading-tight group-hover:text-[#3B8BFF] transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm font-bold text-[#FF3D5A]">R$ {rPrice.toFixed(2).replace(".", ",")}</p>
                        {rDiscount && <span className="text-xs font-semibold text-[#3DDC84]">{rDiscount}% OFF</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
