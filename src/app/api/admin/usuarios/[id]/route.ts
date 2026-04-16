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

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["admin", "operator"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const sb = createSupabaseServiceClient();
  const updates: Record<string, unknown> = {};
  if (parsed.data.name) updates.user_metadata = { name: parsed.data.name };
  if (parsed.data.role) updates.app_metadata = { role: parsed.data.role };

  const { error } = await sb.auth.admin.updateUserById(id, updates);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  // Prevent self-deletion
  if (caller.id === id) {
    return NextResponse.json({ error: "Não é possível excluir o próprio usuário" }, { status: 400 });
  }

  const sb = createSupabaseServiceClient();
  const { error } = await sb.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
