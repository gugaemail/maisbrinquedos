import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import { db } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) return {};
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://maisbrinquedos.com.br";
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/produto/${id}` },
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${baseUrl}/produto/${id}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id, active: true },
    include: { category: true },
  });
  if (!product) notFound();

  const price = Number(product.price);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const imageUrl = product.images[0];
  const emoji = product.category.emoji;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://maisbrinquedos.com.br";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `${baseUrl}/produto/${id}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: price.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${baseUrl}/produto/${id}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] dark:text-white/60 mb-8 font-body">
          <Link href="/" className="hover:text-[#1A1A2E] dark:hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <Link href={`/categoria/${product.category.slug}`} className="hover:text-[#1A1A2E] dark:hover:text-white transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[#1A1A2E] dark:text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl bg-[#F0F4FF] dark:bg-white/5 flex items-center justify-center text-9xl relative overflow-hidden">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span>{emoji}</span>
            )}
            {product.tag && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0057FF] text-white text-sm font-semibold">
                {product.tag}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="text-sm text-[#6B7080] dark:text-white/60 font-body">{product.category.name}</span>
              <h1 className="text-3xl font-display font-extrabold text-[#1A1A2E] dark:text-white mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-4xl font-display font-extrabold text-[#1A1A2E] dark:text-white">
                R$ {price.toFixed(2).replace(".", ",")}
              </span>
              {originalPrice && (
                <div className="flex flex-col">
                  <span className="text-sm text-[#6B7080] dark:text-white/50 line-through font-body">
                    R$ {originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-xs font-semibold text-[#00C48C]">{discount}% OFF</span>
                </div>
              )}
            </div>

            <p className="text-sm text-[#6B7080] dark:text-white/60 font-body">
              Em até <strong className="text-[#1A1A2E] dark:text-white">12x</strong> de{" "}
              <strong className="text-[#1A1A2E] dark:text-white">R$ {(price / 12).toFixed(2).replace(".", ",")}</strong> sem juros
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00C48C]/10 border border-[#00C48C]/20 text-sm font-semibold text-[#00C48C] w-fit">
              <span>⚡</span>
              <span>PIX: R$ {(price * 0.95).toFixed(2).replace(".", ",")} (5% OFF)</span>
            </div>

            <p className="text-sm font-body text-[#6B7080] dark:text-white/60">
              {product.stock <= 5 ? (
                <span className="text-[#FF3D57] font-semibold">⚠ Apenas {product.stock} em estoque</span>
              ) : (
                <span>✓ Em estoque</span>
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <AddToCartButton product={{ id: product.id, name: product.name, price, emoji, imageUrl: imageUrl ?? undefined }} />
              <Link href="/carrinho"
                className="flex-1 flex items-center justify-center px-6 py-4 rounded-full bg-[#1A1A2E] text-white font-display font-bold text-base hover:bg-[#1A1A2E]/90 transition-colors">
                Comprar agora
              </Link>
            </div>

            {product.features.length > 0 && (
              <div className="pt-4 border-t border-[#E2E6F0] dark:border-white/10">
                <h2 className="text-sm font-display font-bold text-[#1A1A2E] dark:text-white mb-3">Características</h2>
                <ul className="flex flex-col gap-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-body text-[#6B7080] dark:text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0057FF] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-[#E2E6F0] dark:border-white/10">
              <h2 className="text-sm font-display font-bold text-[#1A1A2E] dark:text-white mb-2">Descrição</h2>
              <p className="text-sm font-body text-[#6B7080] dark:text-white/70 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
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
