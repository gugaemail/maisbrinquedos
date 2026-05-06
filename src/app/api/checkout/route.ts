import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { db } from "@/lib/db";

// Upstash Redis rate limiter (distributed, works on serverless).
// Falls back to a no-op in dev when UPSTASH_REDIS_REST_URL is not set.
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "rl:checkout",
  });
}

async function checkRateLimit(ip: string): Promise<boolean> {
  if (!ratelimit) return true;
  const { success } = await ratelimit.limit(ip);
  return success;
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
    method?: string;
    cost?: number;
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
  if (!(await checkRateLimit(ip))) {
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

  const itemsSubtotal = resolvedItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  // Revalidate shipping cost server-side
  let shippingCost = 0;
  const clientShippingMethod = body.shipping?.method;
  const clientShippingCost = Number(body.shipping?.cost ?? 0);
  const shippingZip = body.shipping?.zip?.replace(/\D/g, "") ?? "";

  if (clientShippingMethod && shippingZip) {
    const { POST: calculateShipping } = await import("@/app/api/shipping/calculate/route");
    const fakeReq = new Request(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/shipping/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep: shippingZip, items: body.items }),
    });
    const calcRes = await calculateShipping(fakeReq as import("next/server").NextRequest);
    const calcData = await calcRes.json();
    const matchedOption = (calcData.options ?? []).find(
      (o: { method: string; price: number }) => o.method === clientShippingMethod
    );
    if (matchedOption) {
      shippingCost = matchedOption.price;
    } else if (clientShippingCost > 0) {
      // Accept client value only if we couldn't recalculate (e.g., API unavailable)
      shippingCost = clientShippingCost;
    }
  } else if (clientShippingCost > 0) {
    shippingCost = clientShippingCost;
  }

  const total = itemsSubtotal + shippingCost;

  // Create order in DB
  const order = await db.order.create({
    data: {
      payerName,
      payerEmail,
      payerCpf: body.payer?.cpf?.replace(/\D/g, "") ?? null,
      payerPhone: body.payer?.phone?.replace(/\D/g, "") ?? null,
      shippingZip: shippingZip || null,
      shippingStreet: body.shipping?.street ?? null,
      shippingNumber: body.shipping?.number ?? null,
      shippingComplement: body.shipping?.complement ?? null,
      shippingNeighborhood: body.shipping?.neighborhood ?? null,
      shippingCity: body.shipping?.city ?? null,
      shippingState: body.shipping?.state ?? null,
      shippingMethod: clientShippingMethod ?? null,
      shippingCost: shippingCost > 0 ? shippingCost : null,
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
    const mpItems = resolvedItems.map((i) => ({
      id: i.productId,
      title: i.productName,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      currency_id: "BRL",
    }));
    if (shippingCost > 0) {
      mpItems.push({
        id: "frete",
        title: `Frete — ${clientShippingMethod ?? "entrega"}`,
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "BRL",
      });
    }

    result = await preference.create({
      body: {
        external_reference: order.id,
        items: mpItems,
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
    console.error("[checkout] Falha ao criar preferência MP:", process.env.NODE_ENV === "production" ? { code: "MP_PREF_FAILED" } : err);
    return NextResponse.json({ error: "Falha ao iniciar pagamento. Tente novamente." }, { status: 502 });
  }

  // Save preferenceId back to order
  await db.order.update({
    where: { id: order.id },
    data: { mpPreferenceId: result.id },
  });

  return NextResponse.json({ checkoutUrl: result.init_point });
}
