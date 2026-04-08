import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) return {};
  return {
    title: `${product.name} — Mais Brinquedos e Presentes`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) notFound();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] mb-8 font-body">
          <Link href="/" className="hover:text-[#1A1A2E] transition-colors">Início</Link>
          <span>/</span>
          <Link href={`/categoria/${product.categorySlug}`} className="hover:text-[#1A1A2E] transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#1A1A2E]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product image */}
          <div className="aspect-square rounded-3xl bg-[#F0F4FF] flex items-center justify-center text-9xl relative">
            {product.emoji}
            {product.tag && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0057FF] text-white text-sm font-semibold">
                {product.tag}
              </span>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-sm text-[#6B7080] font-body">{product.category}</span>
              <h1 className="text-3xl font-display font-extrabold text-[#1A1A2E] mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-4xl font-display font-extrabold text-[#1A1A2E]">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice && (
                <div className="flex flex-col">
                  <span className="text-sm text-[#6B7080] line-through font-body">
                    R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-xs font-semibold text-[#00C48C]">{discount}% OFF</span>
                </div>
              )}
            </div>

            <p className="text-sm text-[#6B7080] font-body">
              Em até <strong className="text-[#1A1A2E]">12x</strong> de{" "}
              <strong className="text-[#1A1A2E]">
                R$ {(product.price / 12).toFixed(2).replace(".", ",")}
              </strong>{" "}
              sem juros
            </p>

            {/* PIX badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00C48C]/10 border border-[#00C48C]/20 text-sm font-semibold text-[#00C48C] w-fit">
              <span>⚡</span>
              <span>
                PIX: R$ {(product.price * 0.95).toFixed(2).replace(".", ",")} (5% OFF)
              </span>
            </div>

            {/* Stock */}
            <p className="text-sm font-body text-[#6B7080]">
              {product.stock <= 5 ? (
                <span className="text-[#FF3D57] font-semibold">⚠ Apenas {product.stock} em estoque</span>
              ) : (
                <span>✓ Em estoque</span>
              )}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <AddToCartButton product={{ id: product.id, name: product.name, price: product.price, emoji: product.emoji }} />
              <Link
                href="/carrinho"
                className="flex-1 flex items-center justify-center px-6 py-4 rounded-full bg-[#1A1A2E] text-white font-display font-bold text-base hover:bg-[#1A1A2E]/90 transition-colors"
              >
                Comprar agora
              </Link>
            </div>

            {/* Features */}
            <div className="pt-4 border-t border-[#E2E6F0]">
              <h2 className="text-sm font-display font-bold text-[#1A1A2E] mb-3">Características</h2>
              <ul className="flex flex-col gap-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-body text-[#6B7080]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0057FF] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-[#E2E6F0]">
              <h2 className="text-sm font-display font-bold text-[#1A1A2E] mb-2">Descrição</h2>
              <p className="text-sm font-body text-[#6B7080] leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
