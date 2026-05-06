import { notFound } from "next/navigation";
import Link from "next/link";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { db } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: `${category.name} — Mais Brinquedos e Presentes`,
    description: `Produtos de ${category.name} para todas as idades.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await db.product.findMany({
    where: { category: { slug }, active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <HeaderServer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-[#6B7080] dark:text-white/60 mb-8 font-body">
          <Link href="/" className="hover:text-[#0F0F0F] dark:hover:text-white transition-colors">Início</Link>
          <span>/</span>
          <span className="text-[#0F0F0F] dark:text-white">{category.name}</span>
        </nav>

        <div className="flex items-center gap-4 mb-10">
          <span className="text-5xl">{category.emoji}</span>
          <div>
            <h1 className="text-3xl font-display font-extrabold text-[#0F0F0F] dark:text-white">{category.name}</h1>
            <p className="text-[#6B7080] dark:text-white/60 font-body mt-1">
              {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const price = Number(product.price);
              const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
              const imageUrl = product.images[0];
              return (
                <Link key={product.id} href={`/produto/${product.slug}`}
                  className="group flex flex-col rounded-2xl bg-white dark:bg-white/5 border border-[#E2E6F0] dark:border-white/10 overflow-hidden hover:shadow-lg hover:border-[#3B8BFF]/20 transition-all">
                  <div className="aspect-square bg-[#F5F5F2] dark:bg-white/5 flex items-center justify-center text-5xl relative overflow-hidden">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{category.emoji}</span>
                    )}
                    {product.tag && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#3B8BFF] text-white text-xs font-semibold">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <h2 className="text-sm font-display font-semibold text-[#0F0F0F] dark:text-white leading-tight group-hover:text-[#3B8BFF] transition-colors">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-base font-bold text-[#0F0F0F] dark:text-white">R$ {price.toFixed(2).replace(".", ",")}</p>
                      {originalPrice && (
                        <p className="text-xs text-[#6B7080] dark:text-white/50 line-through font-body">
                          R$ {originalPrice.toFixed(2).replace(".", ",")}
                        </p>
                      )}
                    </div>
                    {originalPrice && (
                      <p className="text-xs font-semibold text-[#3DDC84]">
                        {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">📦</span>
            <h2 className="text-xl font-display font-bold text-[#0F0F0F] dark:text-white mb-2">Nenhum produto encontrado</h2>
            <p className="text-[#6B7080] dark:text-white/60 font-body mb-6">Em breve teremos novidades nesta categoria.</p>
            <Link href="/" className="px-6 py-3 rounded-full bg-[#3B8BFF] text-white font-semibold hover:bg-[#3B8BFF]/90 transition-colors">
              Voltar para a loja
            </Link>
          </div>
        )}
      </main>

      <WhatsAppButton />
      <Footer />
    </>
  );
}
