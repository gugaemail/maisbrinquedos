import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase";
import { z } from "zod";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const role = (user.app_metadata?.role as string) ?? "operator";
  if (role !== "admin") return null;
  return user;
}

export async function GET() {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sb = createSupabaseServiceClient();
  const { data, error } = await sb.auth.admin.listUsers({ perPage: 200 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name ?? "",
    role: (u.app_metadata?.role as string) ?? "operator",
    createdAt: u.created_at,
    lastSignIn: u.last_sign_in_at,
  }));

  return NextResponse.json({ users });
}

const createSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter ao menos 8 caracteres"),
  role: z.enum(["admin", "operator"]),
});

export async function POST(request: NextRequest) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { name, email, password, role } = parsed.data;
  const sb = createSupabaseServiceClient();

  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
    app_metadata: { role },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ id: data.user.id }, { status: 201 });
}
