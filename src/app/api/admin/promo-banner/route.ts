import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase";

const KEY = "promo_banner";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const setting = await db.setting.findUnique({ where: { key: "admin_role_" + user.id } });
  if (!setting || !["admin", "operator"].includes(setting.value)) return null;
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
  return NextResponse.json(JSON.parse(setting.value));
}

export async function PUT(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const value = JSON.stringify(body);
  await db.setting.upsert({
    where: { key: KEY },
    update: { value },
    create: { key: KEY, value },
  });
  return NextResponse.json(body);
}
