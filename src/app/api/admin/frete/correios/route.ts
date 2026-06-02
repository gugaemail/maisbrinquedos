import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";
import { z } from "zod";

const KEYS = {
  fromCep: "melhorenvio.fromCep",
  services: "melhorenvio.services",
  active: "melhorenvio.active",
} as const;

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.app_metadata?.role as string) ?? "operator";
  if (role !== "admin") return null;
  return user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await db.setting.findMany({
    where: { key: { in: Object.values(KEYS) } },
  });

  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return NextResponse.json({
    fromCep: map[KEYS.fromCep] ?? "",
    services: map[KEYS.services] ?? "1,2",
    active: (map[KEYS.active] ?? "false") === "true",
    tokenConfigured: !!process.env.MELHOR_ENVIO_TOKEN,
  });
}

const configSchema = z.object({
  fromCep: z.string().regex(/^\d{8}$/, "CEP deve ter 8 dígitos"),
  services: z.string().regex(/^[1-9](,[1-9])*$/, "Serviços inválidos"),
  active: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = configSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { fromCep, services, active } = parsed.data;

  await Promise.all([
    db.setting.upsert({
      where: { key: KEYS.fromCep },
      create: { key: KEYS.fromCep, value: fromCep },
      update: { value: fromCep },
    }),
    db.setting.upsert({
      where: { key: KEYS.services },
      create: { key: KEYS.services, value: services },
      update: { value: services },
    }),
    db.setting.upsert({
      where: { key: KEYS.active },
      create: { key: KEYS.active, value: String(active) },
      update: { value: String(active) },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
