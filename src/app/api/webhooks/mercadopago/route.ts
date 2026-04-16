import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { db } from "@/lib/db";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

function validateSignature(request: NextRequest, paymentId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook/mercadopago] MP_WEBHOOK_SECRET não configurado");
    return false;
  }

  const xSignature = request.headers.get("x-signature") ?? "";
  const xRequestId = request.headers.get("x-request-id") ?? "";

  // Extrair ts e v1 do header x-signature: "ts=...,v1=..."
  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => p.split("=") as [string, string])
  );
  const ts = parts["ts"] ?? "";
  const v1 = parts["v1"] ?? "";

  if (!ts || !v1) return false;

  const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    (body as Record<string, unknown>).type !== "payment"
  ) {
    return NextResponse.json({ ok: true });
  }

  const paymentId = (body as Record<string, unknown>).data &&
    typeof (body as Record<string, unknown>).data === "object"
    ? ((body as Record<string, { id?: unknown }>).data?.id)
    : null;

  if (!paymentId) return NextResponse.json({ ok: true });

  // Validar assinatura antes de processar
  if (!validateSignature(request, String(paymentId))) {
    console.warn("[webhook/mercadopago] Assinatura inválida para paymentId:", paymentId);
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: String(paymentId) });

    const externalRef = paymentData.external_reference;
    if (!externalRef) return NextResponse.json({ ok: true });

    let newStatus: "PENDING" | "APPROVED" | "REJECTED" = "PENDING";
    if (paymentData.status === "approved") newStatus = "APPROVED";
    else if (paymentData.status === "rejected") newStatus = "REJECTED";

    if (newStatus === "APPROVED") {
      // Atualização atômica: só processa se ainda não estava APPROVED
      const updated = await db.order.updateMany({
        where: { id: externalRef, status: { not: "APPROVED" } },
        data: { status: "APPROVED", mpPaymentId: String(paymentId) },
      });

      if (updated.count > 0) {
        // Decrementa estoque dentro de transação — só executa uma vez
        const items = await db.orderItem.findMany({ where: { orderId: externalRef } });
        await db.$transaction(
          items
            .filter((item) => item.productId)
            .map((item) =>
              db.product.update({
                where: { id: item.productId! },
                data: { stock: { decrement: item.quantity } },
              })
            )
        );
      }
    } else {
      await db.order.updateMany({
        where: { id: externalRef, status: { not: "APPROVED" } },
        data: { status: newStatus, mpPaymentId: String(paymentId) },
      });
    }
  } catch (err) {
    console.error("[webhook/mercadopago] Erro ao processar pagamento:", err);
    // Retorna 200 mesmo em erro para evitar retry infinito do MP,
    // mas loga para observabilidade
  }

  return NextResponse.json({ ok: true });
}
