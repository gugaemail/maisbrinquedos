import { db } from "@/lib/db";

const KEYS = {
  accessToken: "melhorenvio.access_token",
  refreshToken: "melhorenvio.refresh_token",
  expiresAt: "melhorenvio.expires_at",
} as const;

export function getMelhorEnvioBaseUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://melhorenvio.com.br"
    : "https://sandbox.melhorenvio.com.br";
}

async function getStoredTokens() {
  const rows = await db.setting.findMany({
    where: { key: { in: Object.values(KEYS) } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    accessToken: map[KEYS.accessToken] ?? null,
    refreshToken: map[KEYS.refreshToken] ?? null,
    expiresAt: map[KEYS.expiresAt] ? new Date(map[KEYS.expiresAt]) : null,
  };
}

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  await Promise.all([
    db.setting.upsert({
      where: { key: KEYS.accessToken },
      create: { key: KEYS.accessToken, value: accessToken },
      update: { value: accessToken },
    }),
    db.setting.upsert({
      where: { key: KEYS.refreshToken },
      create: { key: KEYS.refreshToken, value: refreshToken },
      update: { value: refreshToken },
    }),
    db.setting.upsert({
      where: { key: KEYS.expiresAt },
      create: { key: KEYS.expiresAt, value: expiresAt.toISOString() },
      update: { value: expiresAt.toISOString() },
    }),
  ]);
  return expiresAt;
}

export async function deleteTokens() {
  await db.setting.deleteMany({
    where: { key: { in: Object.values(KEYS) } },
  });
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  try {
    const res = await fetch(`${getMelhorEnvioBaseUrl()}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        client_id: Number(clientId),
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    await saveTokens(data.access_token, data.refresh_token, data.expires_in);
    return data.access_token as string;
  } catch {
    return null;
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  const { accessToken, refreshToken, expiresAt } = await getStoredTokens();

  if (!accessToken) return null;

  // Valid for more than 5 minutes — use as-is
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  if (!expiresAt || expiresAt > fiveMinutesFromNow) return accessToken;

  // Token expiring soon — try to refresh
  if (!refreshToken) return null;
  return refreshAccessToken(refreshToken);
}

export async function exchangeCodeForToken(
  code: string,
  callbackUrl: string
): Promise<boolean> {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  if (!clientId || !clientSecret) return false;

  try {
    const res = await fetch(`${getMelhorEnvioBaseUrl()}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: Number(clientId),
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        code,
      }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    await saveTokens(data.access_token, data.refresh_token, data.expires_in);
    return true;
  } catch {
    return false;
  }
}

export async function getConnectionStatus(): Promise<{
  connected: boolean;
  expiresAt: string | null;
}> {
  const { accessToken, expiresAt } = await getStoredTokens();
  return {
    connected: !!accessToken,
    expiresAt: expiresAt?.toISOString() ?? null,
  };
}
