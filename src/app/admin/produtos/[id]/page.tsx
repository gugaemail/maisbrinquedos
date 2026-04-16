import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";
import DeleteProductButton from "./DeleteProductButton";

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-extrabold text-[#1A1A2E]">Editar produto</h1>
        <DeleteProductButton id={product.id} />
      </div>
      <ProductForm
        categories={categories}
        mode="edit"
        defaultValues={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
          stock: product.stock,
          tag: product.tag ?? "",
          ageRange: product.ageRange ?? "",
          productType: product.productType ?? "",
          categoryId: product.categoryId,
          active: product.active,
          features: product.features.map((f) => ({ value: f })),
          images: product.images,
        }}
      />
    </div>
  );
}
