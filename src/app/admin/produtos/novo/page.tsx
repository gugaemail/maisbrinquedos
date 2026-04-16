import { db } from "@/lib/db";
import ProductForm from "../ProductForm";

export default async function NovoProdutoPage() {
  const categories = await db.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-extrabold text-[#1A1A2E] mb-8">Novo produto</h1>
      <ProductForm categories={categories} mode="create" />
    </div>
  );
}
