import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createSupabaseServerClient } from "@/lib/supabase";
import { z } from "zod";

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "rl:admin-login",
  });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde 15 minutos." },
        { status: 429 }
      );
    }
  }

  let body: { email: string; password: string };
  try {
    const raw = await req.json();
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
