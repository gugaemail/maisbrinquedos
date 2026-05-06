import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";
import { z } from "zod";

const zoneSchema = z.object({
  name: z.string().min(1),
  cepStart: z.string().length(8),
  cepEnd: z.string().length(8),
  price: z.number().positive(),
  deliveryDays: z.number().int().positive().default(1),
  active: z.boolean().default(true),
});

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.app_metadata?.role as string) ?? "operator";
  if (role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const zones = await db.shippingZone.findMany({ orderBy: { cepStart: "asc" } });
  return NextResponse.json(zones);
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = zoneSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const zone = await db.shippingZone.create({ data: parsed.data });
  return NextResponse.json(zone, { status: 201 });
}
