import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export interface CheckoutBody {
  items: CheckoutItem[];
  payer: {
    name: string;
    email: string;
  };
}

export async function POST(req: NextRequest) {
  const body: CheckoutBody = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  if (!body.items?.length) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: body.items.map((item) => ({
        id: String(item.id),
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "BRL",
      })),
      payer: {
        name: body.payer.name,
        email: body.payer.email,
      },
      payment_methods: {
        installments: 12,
      },
      back_urls: {
        success: `${baseUrl}/pedido/sucesso`,
        pending: `${baseUrl}/pedido/pendente`,
        failure: `${baseUrl}/pedido/falha`,
      },
      auto_return: "approved",
      statement_descriptor: "MAIS BRINQUEDOS",
    },
  });

  return NextResponse.json({ checkoutUrl: result.init_point });
}
