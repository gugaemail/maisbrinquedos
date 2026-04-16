import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  price: z.number().positive(),
  originalPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  tag: z.string().optional().nullable(),
  ageRange: z.string().optional().nullable(),
  productType: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  active: z.boolean(),
  features: z.array(z.string()),
  images: z.array(z.string()),
});

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.app_metadata?.role as string) ?? "operator";
  if (role !== "admin") return null;
  return user;
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const product = await db.product.create({ data: parsed.data });
  return NextResponse.json(product, { status: 201 });
}
