import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HeaderServer from "@/components/HeaderServer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { db } from "@/lib/db";

const CATEGORY_BG: Record<string, string> = {
  "Tech & Celular": "#3B8BFF",
  "Brinquedos":     "#FFE14D",
  "Presentes":      "#3DDC84",
  "Novidades":      "#FF3D5A",
};

const CAMPAIGN_META: Record<string, { title: string; description: string; color: string; emoji: string }> = {
  "natal":             { title: "Especial de Natal 🎄", description: "Os melhores presentes para o Natal. Entrega garantida!", color: "#FF3D5A", emoji: "🎄" },
  "dia-das-criancas":  { title: "Dia das Crianças 🧸",  description: "Brinquedos incríveis para o Dia das Crianças. Surpreenda!", color: "#3B8BFF", emoji: "🧸" },
  "black-friday":      { title: "Black Friday 🖤",       description: "Descontos imperdíveis. Aproveite antes que acabe!", color: "#0F0F0F", emoji: "🖤" },
  "dia-dos-pais":      { title: "Dia dos Pais 👨‍👧",     description: "Presenteie o seu pai com algo especial.", color: "#3DDC84", emoji: "👨‍👧" },
  "dia-das-maes":      { title: "Dia das Mães 🌸",       description: "Um presente especial para quem merece o melhor.", color: "#FF3D5A", emoji: "🌸" },
  "volta-as-aulas":    { title: "Volta às Aulas 📚",     description: "Brinquedos educativos e kits para voltar com tudo.", color: "#FFE14D", emoji: "📚" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = CAMPAIGN_META[slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function CampanhaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = CAMPAIGN_META[slug];
  if (!meta) notFound();

  // Busca produtos pela tag que corresponde ao slug da campanha, ou todos ativos
  const products = await db.product.findMany({
    where: {
      active: true,
      OR: [
        { tag: { contains: slug.replace(/-/g, " "), mode: "insensitive" } },
        // Fallback: retorna produtos em destaque se não houver tag específica
        { tag: { not: null } },
      ],
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 16,
  });

  return (
    <>
      <HeaderServer />
      <main>
        {/* Hero da campanha */}
        <section
          className="py-20 md:py-28 text-center"
          style={{ backgroundColor: meta.color + "15", borderBottom: `2px solid ${meta.color}20` }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
            <span className="text-6xl md:text-7xl">{meta.emoji}</span>
            <h1 className="text-3xl md:text-5xl font-display font-black text-[#0F0F0F] leading-tight">
              {meta.title}
            </h1>
            <p className="text-lg text-[#6B7080] font-body max-w-lg">{meta.description}</p>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              <span className="px-4 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-wider text-white" style={{ backgroundColor: meta.color }}>
                ⚡ PIX com 5% OFF
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-[#0F0F0F] text-white">
                📦 Entrega Rápida
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-[#3DDC84]/20 text-[#0F0F0F]">
                💳 12x sem juros
              </span>
            </div>
          </div>
        </section>

        {/* Grid de produtos */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav className="flex items-center gap-2 text-sm text-[#6B7080] mb-8 font-body">
            <Link href="/" className="hover:text-[#0F0F0F] transition-colors">Início</Link>
            <span>/</span>
            <span className="text-[#0F0F0F]">Campanha</span>
            <span>/</span>
            <span className="text-[#0F0F0F]">{meta.title}</span>
          </nav>

          {products.length > 0 ? (
            <>
              <p className="text-sm text-[#6B7080] font-body mb-6">
                <span className="font-semibold text-[#0F0F0F]">{products.length}</span> produtos selecionados
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => {
                  const price = Number(product.price);
                  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
                  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
                  const imageUrl = product.images[0] ?? null;
                  const bg = CATEGORY_BG[product.category.name] ?? "#FFE14D";

                  return (
                    <Link
                      key={product.id}
                      href={`/produto/${product.slug}`}
                      className="group flex flex-col rounded-2xl bg-white border border-[#E2E6F0] overflow-hidden hover:shadow-lg hover:border-[#3B8BFF]/20 transition-all duration-200"
                    >
                      <div className="aspect-square relative overflow-hidden" style={{ backgroundColor: bg }}>
                        {imageUrl ? (
                          <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-5xl">{product.category.emoji}</span>
                        )}
                        {product.tag && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#3B8BFF] text-white text-xs font-semibold">
                            {product.tag}
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-1">
                        <span className="text-xs text-[#6B7080] font-body">{product.category.name}</span>
                        <h2 className="text-sm font-display font-semibold text-[#0F0F0F] leading-tight group-hover:text-[#3B8BFF] transition-colors line-clamp-2">
                          {product.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-base font-bold text-[#FF3D5A]">R$ {price.toFixed(2).replace(".", ",")}</p>
                          {discount && <span className="text-xs font-semibold text-[#3DDC84]">{discount}% OFF</span>}
                        </div>
                        {originalPrice && (
                          <p className="text-xs text-[#6B7080] line-through font-body">
                            R$ {originalPrice.toFixed(2).replace(".", ",")}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <span className="text-6xl">📦</span>
              <h2 className="text-xl font-display font-bold text-[#0F0F0F]">Em breve!</h2>
              <p className="text-[#6B7080] font-body">Novidades chegando para esta campanha.</p>
              <Link href="/produtos" className="px-6 py-3 rounded-full bg-[#3B8BFF] text-white font-semibold hover:bg-[#3B8BFF]/90 transition-colors">
                Ver todos os produtos
              </Link>
            </div>
          )}
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
