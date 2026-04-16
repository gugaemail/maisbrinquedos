import { db } from "@/lib/db";
import BannersList from "./BannersList";

export default async function BannersPage() {
  const banners = await db.banner.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-extrabold text-[#1A1A2E] mb-8">Banners</h1>
      <BannersList initialBanners={banners} />
    </div>
  );
}
