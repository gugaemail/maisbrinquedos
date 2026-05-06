import { db } from "@/lib/db";
import CategoriasList from "./CategoriasList";

export default async function CategoriasPage() {
  const categories = await db.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-display font-extrabold text-[#0F0F0F] mb-8">Categorias</h1>
      <CategoriasList initialCategories={categories} />
    </div>
  );
}
