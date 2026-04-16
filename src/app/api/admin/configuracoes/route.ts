import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";
import { z } from "zod";

const schema = z.object({
  pix_discount_percent: z.string(),
  max_installments: z.string(),
  free_shipping_threshold: z.string(),
  payment_methods_disabled: z.string(),
});

async function requireAdmin(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.app_metadata?.role as string) ?? "operator";
  if (role !== "admin") return null;
  return user;
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin(request);
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updates = Object.entries(parsed.data).map(([key, value]) =>
    db.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  );
  await Promise.all(updates);

  return NextResponse.json({ ok: true });
}
