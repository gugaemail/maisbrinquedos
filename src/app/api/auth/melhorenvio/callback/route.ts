import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForToken } from "@/lib/melhorenvio";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const adminUrl = `${appBaseUrl}/admin/frete`;

  if (error) {
    return NextResponse.redirect(
      `${adminUrl}?melhorenvio=error&reason=${encodeURIComponent(error)}`
    );
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("me_oauth_state")?.value;
  cookieStore.delete("me_oauth_state");

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${adminUrl}?melhorenvio=error&reason=invalid_state`);
  }

  const callbackUrl = `${appBaseUrl}/api/auth/melhorenvio/callback`;
  const success = await exchangeCodeForToken(code, callbackUrl);

  if (!success) {
    return NextResponse.redirect(
      `${adminUrl}?melhorenvio=error&reason=token_exchange_failed`
    );
  }

  return NextResponse.redirect(`${adminUrl}?melhorenvio=success`);
}
