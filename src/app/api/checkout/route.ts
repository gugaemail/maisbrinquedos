import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { db } from "@/lib/db";

// ATENÇÃO: rate limiter in-memory — funciona apenas em dev ou instância única.
// Em produção serverless (Vercel), cada instância tem seu próprio Map.
// Para proteção real, substituir por Upstash Redis + @upstash/ratelimit.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface CheckoutRequestItem {
  id: string;
  quantity: number;
}

interface CheckoutBody {
  items: CheckoutRequestItem[];
  payer: {
    name: string;
    email: string;
    cpf?: string;
    phone?: string;
  };
  shipping?: {
    zip?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  consent?: {
    marketingEmail?: boolean;
    marketingWhatsapp?: boolean;
  };
}

const MAX_QUANTITY = 99;
const MAX_ITEMS = 50;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um momento." }, { status: 429 });
  }

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  if (body.items.length > MAX_ITEMS) {
    return NextResponse.json({ error: "Carrinho excede o limite de itens" }, { status: 400 });
  }

  const payerName = body.payer?.name?.trim();
  const payerEmail = body.payer?.email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payerName || !payerEmail || !emailRegex.test(payerEmail)) {
    return NextResponse.json({ error: "Dados do comprador inválidos" }, { status: 400 });
  }

  // Resolve prices from DB — never trust client prices
  const resolvedItems: { productId: string; productName: string; unitPrice: number; quantity: number }[] = [];
  for (const raw of body.items) {
    const quantity = Math.min(Math.max(1, Math.floor(Number(raw.quantity))), MAX_QUANTITY);

    const product = await db.product.findUnique({
      where: { id: String(raw.id), active: true },
      select: { id: true, name: true, price: true, stock: true },
    });

    if (!product) {
      return NextResponse.json({ error: `Produto não encontrado: ${raw.id}` }, { status: 400 });
    }
    if (product.stock < quantity) {
      return NextResponse.json({ error: `Estoque insuficiente para: ${product.name}` }, { status: 400 });
    }

    resolvedItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: Number(product.price),
      quantity,
    });
  }

  const total = resolvedItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  // Create order in DB
  const order = await db.order.create({
    data: {
      payerName,
      payerEmail,
      payerCpf: body.payer?.cpf?.replace(/\D/g, "") ?? null,
      payerPhone: body.payer?.phone?.replace(/\D/g, "") ?? null,
      shippingZip: body.shipping?.zip?.replace(/\D/g, "") ?? null,
      shippingStreet: body.shipping?.street ?? null,
      shippingNumber: body.shipping?.number ?? null,
      shippingComplement: body.shipping?.complement ?? null,
      shippingNeighborhood: body.shipping?.neighborhood ?? null,
      shippingCity: body.shipping?.city ?? null,
      shippingState: body.shipping?.state ?? null,
      consentMarketingEmail: body.consent?.marketingEmail ?? false,
      consentMarketingWhatsapp: body.consent?.marketingWhatsapp ?? false,
      total,
      status: "PENDING",
      items: {
        create: resolvedItems.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      },
    },
  });

  const settings = await db.setting.findMany({
    where: { key: { in: ["max_installments"] } },
  });
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const maxInstallments = Number(settingsMap.max_installments ?? "12");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const isHttps = baseUrl.startsWith("https://");
  const preference = new Preference(client);

  let result;
  try {
    result = await preference.create({
      body: {
        external_reference: order.id,
        items: resolvedItems.map((i) => ({
          id: i.productId,
          title: i.productName,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          currency_id: "BRL",
        })),
        payer: { name: payerName, email: payerEmail },
        payment_methods: { installments: maxInstallments },
        back_urls: {
          success: `${baseUrl}/pedido/sucesso`,
          pending: `${baseUrl}/pedido/pendente`,
          failure: `${baseUrl}/pedido/falha`,
        },
        ...(isHttps ? { auto_return: "approved" } : {}),
        statement_descriptor: "MAIS BRINQUEDOS",
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    });
  } catch (err) {
    // Cancelar pedido órfão se a criação da preferência falhar
    await db.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
    });
    console.error("[checkout] Falha ao criar preferência MP:", err);
    return NextResponse.json({ error: "Falha ao iniciar pagamento. Tente novamente." }, { status: 502 });
  }

  // Save preferenceId back to order
  await db.order.update({
    where: { id: order.id },
    data: { mpPreferenceId: result.id },
  });

  return NextResponse.json({ checkoutUrl: result.init_point });
}
