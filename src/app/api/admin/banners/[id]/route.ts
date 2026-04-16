import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().nullable().optional(),
  ctaText: z.string().nullable().optional(),
  ctaLink: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
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

  const banner = await db.banner.update({ where: { id }, data: parsed.data });
  return NextResponse.json(banner);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.banner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
