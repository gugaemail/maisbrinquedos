import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categoria = await prisma.category.findUnique({ where: { slug: "capinhas" } });
  if (!categoria) throw new Error("Categoria 'capinhas' não encontrada. Crie ela no admin primeiro.");

  const produtos = [
    {
      slug: "capinha-magsafe-iphone-15-pro-silicone",
      name: "Capinha MagSafe iPhone 15 Pro — Silicone Líquido",
      price: 89.9,
      originalPrice: 129.9,
      tag: "Mais vendido",
      description:
        "Proteção premium para o iPhone 15 Pro com compatibilidade MagSafe total. O silicone líquido envolve o aparelho com toque aveludado, absorvendo impactos sem aumentar o volume do celular. Recortes precisos para todos os botões e câmeras.",
      features: [
        "Compatível com MagSafe",
        "Silicone líquido aveludado",
        "Proteção contra quedas até 1,5m",
        "Recortes precisos para câmera e botões",
        "Disponível em 8 cores",
        "Bordas elevadas para proteger a tela",
      ],
      images: [
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80",
        "https://images.unsplash.com/photo-1586495777744-4e6232bf2177?w=600&q=80",
      ],
      stock: 45,
      ageRange: "9-12" as const,
      productType: "classico" as const,
    },
    {
      slug: "capinha-carteira-samsung-galaxy-s24",
      name: "Capinha Carteira Samsung Galaxy S24 — Couro Vegano",
      price: 74.9,
      originalPrice: 99.9,
      tag: "Destaque",
      description:
        "2 em 1: proteção completa e porta-cartões integrado para Samsung Galaxy S24. O couro vegano premium envelopa o aparelho com elegância enquanto os 3 compartimentos guardam cartões, CNH e notas. Fechamento magnético seguro.",
      features: [
        "Couro vegano premium",
        "3 compartimentos para cartões",
        "Suporte para assistir vídeos (stand)",
        "Fechamento magnético",
        "Compatível com Galaxy S24",
        "Proteção 360° traseira e frontal",
      ],
      images: [
        "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      ],
      stock: 30,
      ageRange: "9-12" as const,
      productType: "classico" as const,
    },
    {
      slug: "capinha-transparente-anti-amarelamento-iphone-14",
      name: "Capinha Transparente Anti-Amarelamento iPhone 14",
      price: 39.9,
      originalPrice: null,
      tag: "Oferta",
      description:
        "Mostra a beleza original do seu iPhone 14 sem esconder o design. Fabricada em TPU de alta claridade com tratamento anti-amarelamento UV — permanece transparente por muito mais tempo que as capinhas comuns. Ultra fina, apenas 0,8mm.",
      features: [
        "TPU anti-amarelamento UV",
        "Ultra fina: 0,8mm",
        "Transparência cristalina",
        "Proteção contra riscos e quedas leves",
        "Compatível com carregamento wireless",
        "Toque silicoso, não escorrega",
      ],
      images: [
        "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=600&q=80",
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80",
      ],
      stock: 80,
      ageRange: "9-12" as const,
      productType: "classico" as const,
    },
    {
      slug: "capinha-gamer-iphone-15-com-rgb",
      name: "Capinha Gamer RGB iPhone 15 — Com Suporte e Iluminação",
      price: 119.9,
      originalPrice: 159.9,
      tag: "Novidade",
      description:
        "Para quem leva o mobile gaming a sério. A iluminação RGB traseira ativa com notificações e jogos, o suporte retrátil posiciona o celular no ângulo ideal para jogar e assistir. Carcaça reforçada resiste a quedas de até 2 metros.",
      features: [
        "Iluminação RGB traseira reativa",
        "Suporte retrátil integrado (kickstand)",
        "Proteção militar MIL-STD-810G",
        "Resistente a quedas até 2m",
        "Compatível com iPhone 15",
        "Carregamento MagSafe compatível",
        "USB-C pass-through",
      ],
      images: [
        "https://images.unsplash.com/photo-1609252925146-b891fe785ab3?w=600&q=80",
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80",
      ],
      stock: 20,
      ageRange: "9-12" as const,
      productType: "motor" as const,
    },
    {
      slug: "capinha-biodegradavel-iphone-motorola-g84",
      name: "Capinha Biodegradável Motorola G84 — Eco Case",
      price: 59.9,
      originalPrice: 79.9,
      tag: "Eco",
      description:
        "Proteção consciente para o planeta. Fabricada com materiais 100% biodegradáveis — trigo, bambu e biopolímero — que se decompõem em 2 anos no aterro sanitário. Mesma resistência das capinhas convencionais, impacto ambiental zero.",
      features: [
        "100% biodegradável em ~2 anos",
        "Material: trigo + bambu + biopolímero",
        "Certificado cruelty-free e vegano",
        "Proteção contra quedas até 1,2m",
        "Compatível com Motorola G84",
        "Embalagem reciclável",
        "Toque natural e antiderrapante",
      ],
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
        "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80",
      ],
      stock: 35,
      ageRange: "9-12" as const,
      productType: "classico" as const,
    },
  ];

  for (const p of produtos) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...p, categoryId: categoria.id },
      create: { ...p, categoryId: categoria.id, active: true },
    });
    console.log(`✓ ${p.name}`);
  }

  console.log(`\nSeed concluído: 5 produtos na categoria "${categoria.name}".`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
