import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getValidAccessToken, getMelhorEnvioBaseUrl } from "@/lib/melhorenvio";

export interface ShippingOption {
  method: string;
  label: string;
  price: number;
  days: number;
}

function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, "");
}

async function getMotoboyOption(
  cep: string
): Promise<ShippingOption | null> {
  const zones = await db.shippingZone.findMany({ where: { active: true } });
  const normalized = normalizeCep(cep);
  for (const zone of zones) {
    if (normalized >= zone.cepStart && normalized <= zone.cepEnd) {
      return {
        method: "motoboy",
        label: `Motoboy — ${zone.name}`,
        price: Number(zone.price),
        days: zone.deliveryDays,
      };
    }
  }
  return null;
}

async function getMelhorEnvioOptions(
  cep: string,
  items: { id: string; quantity: number }[]
): Promise<ShippingOption[]> {
  const [token, fromCepSetting, servicesSetting, activeSetting] = await Promise.all([
    getValidAccessToken(),
    db.setting.findUnique({ where: { key: "melhorenvio.fromCep" } }),
    db.setting.findUnique({ where: { key: "melhorenvio.services" } }),
    db.setting.findUnique({ where: { key: "melhorenvio.active" } }),
  ]);

  if (!token) return [];
  if (activeSetting?.value === "false") return [];

  const fromCep = fromCepSetting?.value || process.env.MELHOR_ENVIO_FROM_CEP;
  const services = servicesSetting?.value || "1,2";

  if (!fromCep) return [];

  const productIds = items.map((i) => i.id);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, weightGrams: true, heightCm: true, widthCm: true, depthCm: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Calculate total weight and max dimensions
  let totalWeight = 0;
  let maxHeight = 10;
  let maxWidth = 10;
  let maxDepth = 10;

  for (const item of items) {
    const p = productMap.get(item.id);
    const weight = (p?.weightGrams ?? 300) * item.quantity;
    totalWeight += weight;
    if (p?.heightCm) maxHeight = Math.max(maxHeight, p.heightCm);
    if (p?.widthCm) maxWidth = Math.max(maxWidth, p.widthCm);
    if (p?.depthCm) maxDepth = Math.max(maxDepth, p.depthCm);
  }

  // Minimum 1kg for calculation
  const weightKg = Math.max(totalWeight / 1000, 0.3);

  const baseUrl = getMelhorEnvioBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "maisbrinquedos/1.0 (contato@maisbrinquedos.com.br)",
      },
      body: JSON.stringify({
        from: { postal_code: normalizeCep(fromCep) },
        to: { postal_code: normalizeCep(cep) },
        package: {
          height: maxHeight,
          width: maxWidth,
          length: maxDepth,
          weight: weightKg,
        },
        options: { insurance_value: 0, receipt: false, own_hand: false },
        services,
      }),
    });

    if (!res.ok) return [];

    const data = await res.json();

    const options: ShippingOption[] = [];
    for (const service of data) {
      if (service.error) continue;
      const price = Number(service.price);
      if (!price) continue;
      options.push({
        method: service.name.toLowerCase().replace(/\s+/g, "_"),
        label: `${service.company?.name ?? ""} ${service.name}`.trim(),
        price,
        days: service.delivery_time ?? 10,
      });
    }
    return options;
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cep, items } = body as {
      cep: string;
      items: { id: string; quantity: number }[];
    };

    if (!cep || !items?.length) {
      return NextResponse.json({ error: "CEP e itens são obrigatórios" }, { status: 400 });
    }

    const [motoboy, carrierOptions] = await Promise.all([
      getMotoboyOption(cep),
      getMelhorEnvioOptions(cep, items),
    ]);

    const options: ShippingOption[] = [];
    if (motoboy) options.push(motoboy);
    options.push(...carrierOptions);

    if (options.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma opção de frete disponível para este CEP." },
        { status: 422 }
      );
    }

    return NextResponse.json({ options });
  } catch {
    return NextResponse.json({ error: "Erro ao calcular frete" }, { status: 500 });
  }
}
