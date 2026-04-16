import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import * as dotenvLocal from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

// Load .env.local manually
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenvLocal.config({ path: envLocalPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log("Conectando ao Supabase:", supabaseUrl);

  // ── Categories ──────────────────────────────────────────────────
  const now = new Date().toISOString();
  const categoriesData = [
    { id: randomUUID(), name: "Brinquedos", slug: "brinquedos", emoji: "🧸", order: 1, active: true, createdAt: now, updatedAt: now },
    { id: randomUUID(), name: "Tech & Celular", slug: "tech", emoji: "📱", order: 2, active: true, createdAt: now, updatedAt: now },
    { id: randomUUID(), name: "Presentes", slug: "presentes", emoji: "🎁", order: 3, active: true, createdAt: now, updatedAt: now },
    { id: randomUUID(), name: "Novidades", slug: "novidades", emoji: "✨", order: 4, active: true, createdAt: now, updatedAt: now },
  ];

  for (const cat of categoriesData) {
    const { error } = await supabase
      .from("Category")
      .upsert(cat, { onConflict: "slug" });
    if (error) {
      console.error("Erro ao inserir categoria", cat.slug, error.message);
    } else {
      console.log("✓ Categoria:", cat.name);
    }
  }

  // Busca IDs das categorias
  const { data: cats, error: catsError } = await supabase
    .from("Category")
    .select("id, slug");
  if (catsError || !cats) {
    console.error("Erro ao buscar categorias:", catsError?.message);
    process.exit(1);
  }

  const catMap: Record<string, string> = {};
  for (const c of cats) catMap[c.slug] = c.id;

  // ── Products ────────────────────────────────────────────────────
  const productsData = [
    // TECH & CELULAR
    {
      slug: "echo-pop-smart-speaker",
      name: "Amazon Echo Pop",
      price: 336.0,
      originalPrice: 399.0,
      categoryId: catMap["tech"],
      tag: "Mais vendido",
      description:
        "O ponto de entrada mais popular para automação residencial da Amazon. Design compacto com integração total à Alexa para controle de música, dispositivos inteligentes e muito mais.",
      features: [
        "Alexa integrada",
        "Design compacto e moderno",
        "Controla dispositivos smart home",
        "Streaming de música (Spotify, Amazon Music)",
        "Wi-Fi e Bluetooth",
      ],
      images: [
        "https://images8.kabum.com.br/produtos/fotos/sync_mirakl/472718/large/Echo-Pop-Amazon-Smart-Speaker-Compacto-Com-Alexa-Preto_1774984125.jpg",
      ],
      stock: 25,
      active: true,
    },
    {
      slug: "echo-show-5-3a-geracao",
      name: "Echo Show 5 (3ª Geração)",
      price: 699.0,
      originalPrice: 799.0,
      categoryId: catMap["tech"],
      tag: "Destaque",
      description:
        "Além do comando de voz, oferece uma tela de 5,5 polegadas para visualização de câmeras de segurança, chamadas de vídeo e streaming como Prime Video. A central de casa inteligente mais completa da Amazon.",
      features: [
        "Tela de 5,5 polegadas",
        "Câmera de 2MP integrada",
        "Alexa com vídeo",
        "Prime Video, Netflix e mais",
        "Controle de câmeras de segurança",
        "Graves 2x mais potentes",
      ],
      images: [
        "https://images4.kabum.com.br/produtos/fotos/sync_mirakl/590984/large/Echo-Show-5-3-Gera-o-2023-Smart-Display-Com-Alexa-Graves-2x-Mais-Potentes-E-Som-Mais-N-tido-Cor-Preta_1774984125.jpg",
      ],
      stock: 12,
      active: true,
    },
    {
      slug: "amazfit-active-smartwatch",
      name: "Smartwatch Amazfit Active",
      price: 499.9,
      originalPrice: 599.9,
      categoryId: catMap["tech"],
      tag: "Mais vendido",
      description:
        "Extremamente popular pela bateria que dura até 14 dias e monitoramento avançado de saúde — sono, estresse e oxigênio no sangue. Alternativa de custo-benefício superior aos modelos premium.",
      features: [
        "Bateria até 14 dias",
        "Monitor SpO2 (oxigênio no sangue)",
        "Monitoramento de sono e estresse",
        "GPS integrado",
        "Mais de 120 modos esportivos",
        "Tela AMOLED 1,75\"",
        "Alexa integrada",
      ],
      images: [
        "https://images0.kabum.com.br/produtos/fotos/sync_mirakl/676910/large/Relogio-Fit-Caixa-Preto-Desenho-Tela-AmoLED-Active-Com-Gps-_1765458528.jpg",
      ],
      stock: 18,
      active: true,
    },
    {
      slug: "carregador-i2go-20w-pd",
      name: "Carregador I2GO 20W USB-C Power Delivery",
      price: 54.9,
      originalPrice: null,
      categoryId: catMap["tech"],
      tag: "Mais vendido",
      description:
        "Um dos acessórios mais vendidos pela compatibilidade e rapidez — carrega 50% da bateria de smartphones modernos em 25-30 minutos. Com 1 saída USB-C 20W PD + 1 saída USB-A 18W.",
      features: [
        "USB-C Power Delivery 20W",
        "USB-A 18W Quick Charge",
        "Carrega iPhone 15 até 50% em ~25min",
        "Proteção contra sobrecarga e superaquecimento",
        "Design compacto",
        "1 ano de garantia i2GO",
      ],
      images: [
        "https://images2.kabum.com.br/produtos/fotos/sync_mirakl/409302/large/Carregador-De-Parede-Turbo-I2go-1-Usb-c-20w-1-Usb-a-18w_1752012883.jpg",
      ],
      stock: 50,
      active: true,
    },
    // NOVIDADES
    {
      slug: "cabo-usb-c-nylon-60w-i2go",
      name: "Cabo USB-C Nylon Trançado 60W i2GO",
      price: 39.9,
      originalPrice: 59.9,
      categoryId: catMap["novidades"],
      tag: "Novidade",
      description:
        "Resolve o problema de durabilidade dos cabos originais com revestimento de nylon premium que suporta até 30.000 dobras. Compatível com iPhone 15/16, Android e notebooks. Suporta carregamento rápido 60W.",
      features: [
        "Nylon trançado — 30.000 dobras",
        "60W Power Delivery",
        "Compatível com iPhone 15/16",
        "Compatível com Android e notebooks",
        "2 metros de comprimento",
        "Conectores alumínio premium",
      ],
      images: [
        "https://images6.kabum.com.br/produtos/fotos/sync_mirakl/628166/large/Cabo-Usb-c-Usb-c-I2go-2m-3a-60w-Nylon-Tran-ado-Preto_1740489638.jpg",
      ],
      stock: 60,
      active: true,
    },
    {
      slug: "projetor-magcubic-hy300",
      name: "Projetor Portátil Magcubic HY300",
      price: 349.9,
      originalPrice: 499.9,
      categoryId: catMap["novidades"],
      tag: "Novidade",
      description:
        "Transforma qualquer parede em um cinema com sistema Android integrado por um preço acessível. Destaque constante nas listas de mais vendidos com 8.000 lúmens e projeção de até 150 polegadas.",
      features: [
        "Android 11 integrado",
        "8.000 lúmens de brilho",
        "Projeção até 150 polegadas",
        "Wi-Fi e Bluetooth",
        "HDMI e USB",
        "Alto-falante embutido",
        "Resolução HD 1280x720",
      ],
      images: [
        "https://images8.kabum.com.br/produtos/fotos/sync_mirakl/503238/Projetor-Port-til-Magcubic-HY300-WIFI-HD-200ANSI-ANDROID-SMART-BIVOLT-8000-Lumens-Branco_1698062319_g.jpg",
      ],
      stock: 10,
      active: true,
    },
    // BRINQUEDOS
    {
      slug: "funko-pop-luffy-gear-5",
      name: "Funko Pop! One Piece — Luffy Gear 5",
      price: 99.9,
      originalPrice: 129.9,
      categoryId: catMap["brinquedos"],
      tag: "Mais vendido",
      description:
        "O item número 1 em colecionáveis. Monkey D. Luffy em sua forma mais épica — Gear 5 — em vinil de alta qualidade. Franquia One Piece vende aos milhares mensalmente entre colecionadores.",
      features: [
        "Vinil de alta qualidade",
        "Altura ~14cm",
        "Personagem exclusivo Gear 5",
        "Caixa colecionável com janela",
        "Ideal para 15+ anos",
      ],
      images: [
        "https://images2.kabum.com.br/produtos/fotos/sync_mirakl/582322/Boneco-Funko-Pop-One-Piece-Luffy-Gear-5_1716324760_g.jpg",
      ],
      stock: 30,
      active: true,
    },
    {
      slug: "lego-star-wars-cantina",
      name: "LEGO Star Wars — Mos Eisley Cantina",
      price: 1299.9,
      originalPrice: null,
      categoryId: catMap["brinquedos"],
      tag: "Colecionável",
      description:
        "Conjuntos de LEGO Star Wars são extremamente visados tanto para presentear quanto para entusiastas que utilizam as peças como decoração. Réplica icônica de Star Wars: A New Hope com 3.187 peças.",
      features: [
        "3.187 peças",
        "21 minifiguras incluídas",
        "Cenário da Cantina de Mos Eisley",
        "Detalhes do Millenium Falcon",
        "Para maiores de 18 anos",
        "Dimensões montadas: 33x57x38cm",
      ],
      images: [
        "https://images8.kabum.com.br/produtos/fotos/sync_mirakl/170018/Lego-Star-Wars-Mos-Eisley-Cantina-_1629120665_g.jpg",
      ],
      stock: 5,
      active: true,
    },
    {
      slug: "lego-technic-motocicleta-42132",
      name: "LEGO Technic Motocicleta 42132",
      price: 139.9,
      originalPrice: 179.9,
      categoryId: catMap["brinquedos"],
      tag: "Oferta",
      description:
        "LEGO Technic abaixo de R$500 são os mais visados para presentear crianças e entusiastas de engenharia. Esta motocicleta de 163 peças apresenta movimentos e mecanismos realistas.",
      features: [
        "163 peças",
        "Mecânica funcional realista",
        "Para crianças a partir de 9 anos",
        "Introdução ao mundo da engenharia",
        "Dimensões montadas: 6x14x4cm",
      ],
      images: [
        "https://images6.kabum.com.br/produtos/fotos/sync_mirakl/396136/large/Lego-Technic-Motocicleta-163-pe-as-42132_1738690941.jpg",
      ],
      stock: 20,
      active: true,
    },
    {
      slug: "pokemon-booster-box-36-pacotes",
      name: "Pokémon TCG — Booster Box 36 Pacotes",
      price: 389.9,
      originalPrice: null,
      categoryId: catMap["brinquedos"],
      tag: "Mais vendido",
      description:
        "Cartas Pokémon mantêm-se como um dos itens de maior giro na internet, impulsionadas por comunidades de colecionadores e jogadores competitivos. Expansão Escarlate e Violeta com 216 cartas.",
      features: [
        "36 pacotes booster",
        "216 cartas no total",
        "Expansão Escarlate e Violeta",
        "Cartas raras e holográficas",
        "Produto oficial Copag / Pokémon",
        "Lacrado de fábrica",
      ],
      images: [
        "https://images3.kabum.com.br/produtos/fotos/sync_mirakl/450533/36-Pacotes-Copag-Caixa-Pok%C3%A9mon-Booster-216-Cartas-Escarlate-E-Violeta_1683299355_g.jpg",
      ],
      stock: 15,
      active: true,
    },
    // PRESENTES
    {
      slug: "exploding-kittens-jogo-cartas",
      name: "Exploding Kittens — Edição Revisada",
      price: 79.9,
      originalPrice: null,
      categoryId: catMap["presentes"],
      tag: "Presente ideal",
      description:
        "Jogo de cartas explosivo que representa a categoria de entretenimento em casa. Para 2-5 jogadores com partidas de 15 minutos — diversão garantida para toda a família.",
      features: [
        "2 a 5 jogadores",
        "Partidas de ~15 minutos",
        "56 cartas ilustradas",
        "Para maiores de 8 anos",
        "Edição em português",
        "Distribuidora Galápagos",
      ],
      images: [
        "https://images.tcdn.com.br/img/img_prod/1152477/90_exploding_kittens_edicao_revisada_3041_1_f3dc54fb4f1dd34dcda9d4ff86a84538.jpg",
      ],
      stock: 22,
      active: true,
    },
    {
      slug: "kit-smart-home-echo-pop-lampada",
      name: "Kit Smart Home — Echo Pop + Lâmpada",
      price: 399.9,
      originalPrice: 469.9,
      categoryId: catMap["presentes"],
      tag: "Kit especial",
      description:
        "Kit perfeito para presentear: Echo Pop com Alexa integrada + Lâmpada Inteligente Positivo 9W colorida. Tudo para começar a automação residencial. Embalagem especial para presente.",
      features: [
        "Echo Pop com Alexa",
        "Lâmpada Positivo 9W RGB",
        "Controle por voz e app",
        "Wi-Fi 2.4GHz",
        "16 milhões de cores",
        "Embalagem premium para presente",
      ],
      images: [
        "https://images8.kabum.com.br/produtos/fotos/sync_mirakl/472718/large/Echo-Pop-Amazon-Smart-Speaker-Compacto-Com-Alexa-Preto_1774984125.jpg",
      ],
      stock: 8,
      active: true,
    },
  ];

  for (const p of productsData) {
    const { error } = await supabase
      .from("Product")
      .upsert({ id: randomUUID(), createdAt: now, updatedAt: now, ...p }, { onConflict: "slug" });
    if (error) {
      console.error("Erro ao inserir produto", p.slug, error.message);
    } else {
      console.log("✓ Produto:", p.name);
    }
  }

  // ── Settings ────────────────────────────────────────────────────
  const settings = [
    { key: "pix_discount_percent", value: "5" },
    { key: "max_installments", value: "12" },
    { key: "payment_methods_disabled", value: "[]" },
    { key: "free_shipping_threshold", value: "150" },
  ];

  for (const s of settings) {
    const { error } = await supabase
      .from("Setting")
      .upsert({ ...s, updatedAt: now }, { onConflict: "key" });
    if (error) {
      console.error("Erro ao inserir setting", s.key, error.message);
    }
  }

  console.log("\n✅ Seed concluído: 4 categorias, 12 produtos reais, configurações padrão.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
