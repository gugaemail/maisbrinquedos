import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  originalPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  tag: z.string().nullable().optional(),
  ageRange: z.string().nullable().optional(),
  productType: z.string().nullable().optional(),
  weightGrams: z.number().int().min(0).nullable().optional(),
  heightCm: z.number().int().min(0).nullable().optional(),
  widthCm: z.number().int().min(0).nullable().optional(),
  depthCm: z.number().int().min(0).nullable().optional(),
  categoryId: z.string().min(1).optional(),
  active: z.boolean().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.app_metadata?.role as string) ?? "operator";
  if (role !== "admin") return null;
  return user;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  try {
    const product = await db.product.update({ where: { id }, data: parsed.data });
    return NextResponse.json(product);
  } catch (err) {
    console.error("[PATCH /api/admin/produtos/:id]", process.env.NODE_ENV === "production" ? { code: "DB_UPDATE_FAILED" } : err);
    return NextResponse.json({ error: "Erro interno ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
