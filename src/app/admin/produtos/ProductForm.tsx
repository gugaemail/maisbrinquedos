"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const schema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2, "Slug obrigatório").regex(/^[a-z0-9-]+$/, "Apenas letras minúsculas, números e hífens"),
  description: z.string().min(10, "Descrição obrigatória"),
  price: z.coerce.number().positive("Preço deve ser positivo"),
  originalPrice: z.coerce.number().positive().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Estoque não pode ser negativo"),
  tag: z.string().optional(),
  ageRange: z.string().optional(),
  productType: z.string().optional(),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  active: z.boolean(),
  features: z.array(z.object({ value: z.string() })),
});

type FormValues = z.infer<typeof schema>;

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  defaultValues?: Partial<FormValues> & { id?: string; images?: string[]; ageRange?: string | null; productType?: string | null };
  mode: "create" | "edit";
}

export default function ProductForm({ categories, defaultValues, mode }: Props) {
  const router = useRouter();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? []);

  const slugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      originalPrice: defaultValues?.originalPrice ?? "",
      stock: defaultValues?.stock ?? 0,
      tag: defaultValues?.tag ?? "",
      ageRange: defaultValues?.ageRange ?? "",
      productType: defaultValues?.productType ?? "",
      categoryId: defaultValues?.categoryId ?? "",
      active: defaultValues?.active ?? true,
      features: defaultValues?.features ?? [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "features" });

  const watchedName = watch("name");
  useEffect(() => {
    if (mode !== "create") return;
    if (slugTimerRef.current) clearTimeout(slugTimerRef.current);
    slugTimerRef.current = setTimeout(() => {
      setValue("slug", toSlug(watchedName ?? ""), { shouldValidate: false });
    }, 300);
    return () => { if (slugTimerRef.current) clearTimeout(slugTimerRef.current); };
  }, [watchedName, mode, setValue]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploadingImage(false);
    if (!res.ok) { toast.error("Erro ao fazer upload da imagem"); return; }
    const { url } = await res.json();
    setImages((prev) => [...prev, url]);
  }

  async function onSubmit(data: FormValues) {
    const payload = {
      ...data,
      originalPrice: data.originalPrice === "" ? null : Number(data.originalPrice),
      ageRange: data.ageRange === "" ? null : data.ageRange,
      productType: data.productType === "" ? null : data.productType,
      features: data.features.map((f) => f.value).filter(Boolean),
      images,
    };

    const url = mode === "create" ? "/api/admin/produtos" : `/api/admin/produtos/${defaultValues?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      toast.error(`Erro ${res.status}: ${JSON.stringify(errBody)}`);
      return;
    }
    toast.success(mode === "create" ? "Produto criado!" : "Produto atualizado!");
    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nome do produto" error={errors.name?.message}>
          <input {...register("name")} className={input} placeholder="Ex: Carrinho de Controle Remoto" />
        </Field>
        <Field
          label={mode === "create" ? "URL amigável (gerada automaticamente)" : "URL amigável (não pode ser alterada)"}
          error={errors.slug?.message}
        >
          <input
            {...register("slug")}
            className={`${input} bg-[#F8F9FC] text-[#6B7080]`}
            readOnly
            tabIndex={-1}
          />
        </Field>
      </div>

      <Field label="Descrição" error={errors.description?.message}>
        <textarea {...register("description")} rows={3} className={input} />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Preço (R$)" error={errors.price?.message}>
          <input {...register("price")} type="number" step="0.01" className={input} />
        </Field>
        <Field label="Preço cheio antes do desconto (opcional)" error={errors.originalPrice?.message}>
          <input {...register("originalPrice")} type="number" step="0.01" className={input} />
        </Field>
        <Field label="Estoque" error={errors.stock?.message}>
          <input {...register("stock")} type="number" className={input} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Categoria" error={errors.categoryId?.message}>
          <select {...register("categoryId")} className={input}>
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Destaque (opcional)">
          <select {...register("tag")} className={input}>
            <option value="">Sem destaque</option>
            <option value="Mais vendido">Mais vendido</option>
            <option value="Novidade">Novidade</option>
            <option value="Oferta">Oferta</option>
          </select>
          <p className="text-xs text-[#6B7080] mt-1">O destaque aparece como etiqueta no card do produto.</p>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Faixa etária">
          <select {...register("ageRange")} className={input}>
            <option value="">Não definida</option>
            <option value="0-2">0–2 anos</option>
            <option value="3-5">3–5 anos</option>
            <option value="6-8">6–8 anos</option>
            <option value="9-12">9–12 anos</option>
          </select>
        </Field>
        <Field label="Tipo de brinquedo">
          <select {...register("productType")} className={input}>
            <option value="">Não definido</option>
            <option value="educativo">📚 Educativo</option>
            <option value="motor">🏃 Motor</option>
            <option value="criativo">🎨 Criativo</option>
            <option value="classico">🎲 Clássico</option>
          </select>
        </Field>
      </div>

      {/* Features */}
      <div>
        <label className="text-xs font-semibold text-[#1A1A2E] font-body block mb-2">Características</label>
        <div className="flex flex-col gap-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2">
              <input {...register(`features.${i}.value`)} className={`${input} flex-1`} placeholder={`Característica ${i + 1}`} />
              <button type="button" onClick={() => remove(i)} className="text-[#FF3D57] text-sm px-2">✕</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => append({ value: "" })} className="mt-2 text-xs text-[#0057FF] font-semibold">
          + Adicionar característica
        </button>
      </div>

      {/* Images */}
      <div>
        <label className="text-xs font-semibold text-[#1A1A2E] font-body block mb-2">Imagens</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E2E6F0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-[#0057FF] text-[#0057FF] text-sm font-semibold hover:bg-[#0057FF]/5 transition-colors">
          {uploadingImage ? "Enviando..." : "+ Upload imagem"}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
        </label>
      </div>

      {/* Active toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input {...register("active")} type="checkbox" className="w-4 h-4 accent-[#0057FF]" />
        <span className="text-sm font-body text-[#1A1A2E]">Produto ativo (visível na loja)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-full bg-[#0057FF] text-white font-display font-bold text-sm hover:bg-[#0046CC] transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : mode === "create" ? "Criar produto" : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produtos")}
          className="px-6 py-3 rounded-full border border-[#E2E6F0] text-[#6B7080] text-sm font-semibold hover:bg-[#F8F9FC] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

const input = "w-full px-4 py-3 rounded-xl border border-[#E2E6F0] text-sm font-body text-[#1A1A2E] outline-none focus:border-[#0057FF] transition-colors bg-white";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#1A1A2E] font-body">{label}</label>
      {children}
      {error && <p className="text-xs text-[#FF3D57]">{error}</p>}
    </div>
  );
}
