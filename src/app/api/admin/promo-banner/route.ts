import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";

const KEY = "promo_banner";

const promoBannerSchema = z.object({
  active: z.boolean(),
  label: z.string().max(100),
  title: z.string().max(200),
  description: z.string().max(500),
  ctaText: z.string().max(50),
  ctaLink: z.string().max(500),
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
  const setting = await db.setting.findUnique({ where: { key: KEY } });
  if (!setting) {
    return NextResponse.json({
      active: true,
      label: "Oferta especial",
      title: "Frete grátis em pedidos acima de R$ 150",
      description: "Entrega rápida para todo o Brasil. Aproveite!",
      ctaText: "Aproveitar agora →",
      ctaLink: "/produtos",
    });
  }
  const parsed = promoBannerSchema.safeParse(JSON.parse(setting.value));
  if (!parsed.success) {
    return NextResponse.json({ error: "Configuração inválida" }, { status: 500 });
  }
  return NextResponse.json(parsed.data);
}

export async function PUT(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await req.json();
  const parsed = promoBannerSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;
  const value = JSON.stringify(body);
  await db.setting.upsert({
    where: { key: KEY },
    update: { value },
    create: { key: KEY, value },
  });
  return NextResponse.json(parsed.data);
}
