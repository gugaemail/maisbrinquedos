import { db } from "@/lib/db";
import Header from "./Header";

export default async function HeaderServer() {
  const categories = await db.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: { name: true, slug: true },
  });
  return <Header categories={categories} />;
}
