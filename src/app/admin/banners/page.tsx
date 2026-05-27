import { db } from "@/lib/db";
import BannersList from "./BannersList";
import PromoBannerForm from "./PromoBannerForm";

const DEFAULT_PROMO = {
  active: true,
  label: "Oferta especial",
  title: "Frete grátis em pedidos acima de R$ 150",
  description: "Entrega rápida para todo o Brasil. Aproveite!",
  ctaText: "Aproveitar agora →",
  ctaLink: "/produtos",
};

export default async function BannersPage() {
  const [banners, promoSetting] = await Promise.all([
    db.banner.findMany({ orderBy: { order: "asc" } }),
    db.setting.findUnique({ where: { key: "promo_banner" } }),
  ]);

  const promo = promoSetting ? JSON.parse(promoSetting.value) : DEFAULT_PROMO;

  return (
    <div className="p-8 space-y-12">
      {/* Hero banners */}
      <section>
        <h1 className="text-2xl font-display font-extrabold text-[#0F0F0F] dark:text-white mb-2">Banners principais</h1>
        <p className="text-sm text-[#6B7080] dark:text-white/50 font-body mb-6">Carrossel exibido no topo da loja quando há banners ativos.</p>
        <BannersList initialBanners={banners} />
      </section>

      {/* Promo banner */}
      <section>
        <h2 className="text-xl font-display font-extrabold text-[#0F0F0F] dark:text-white mb-2">Banner de promoção</h2>
        <p className="text-sm text-[#6B7080] dark:text-white/50 font-body mb-6">Faixa amarela exibida entre as categorias e os produtos em destaque.</p>
        <PromoBannerForm initial={promo} />
      </section>
    </div>
  );
}
