import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getMelhorEnvioBaseUrl } from "@/lib/melhorenvio";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || (user.app_metadata?.role as string) !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (!clientId) {
    return NextResponse.json(
      { error: "MELHOR_ENVIO_CLIENT_ID não configurado" },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(16).toString("hex");
  const callbackUrl = `${appBaseUrl}/api/auth/melhorenvio/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "shipping-calculate",
    state,
  });

  const cookieStore = await cookies();
  cookieStore.set("me_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.redirect(
    `${getMelhorEnvioBaseUrl()}/oauth/authorize?${params}`
  );
}
