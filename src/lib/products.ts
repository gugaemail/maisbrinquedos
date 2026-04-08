export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  tag?: string | null;
  emoji: string;
  description: string;
  features: string[];
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Controle Joystick Pro",
    price: 189.90,
    originalPrice: 249.90,
    category: "Tech & Celular",
    categorySlug: "tech",
    tag: "Mais vendido",
    emoji: "🎮",
    description: "Controle sem fio de alta precisão compatível com PC, PlayStation e Android. Vibração dupla, bateria de longa duração e design ergonômico.",
    features: ["Conexão Bluetooth 5.0", "Bateria 600mAh (~8h)", "Compatível com PC, PS4, Android", "Vibração dupla", "Cabo USB-C incluso"],
    stock: 15,
  },
  {
    id: 2,
    name: "Kit Lego Criativo 500 peças",
    price: 249.90,
    category: "Brinquedos",
    categorySlug: "brinquedos",
    tag: "Novidade",
    emoji: "🧱",
    description: "Kit de construção com 500 peças coloridas para estimular a criatividade e o raciocínio. Ideal para crianças a partir de 6 anos.",
    features: ["500 peças coloridas", "Manual com 10 modelos", "Peças compatíveis com Lego", "Idade: 6+", "Caixa organizadora inclusa"],
    stock: 8,
  },
  {
    id: 3,
    name: "Caixa de Som Bluetooth",
    price: 159.90,
    originalPrice: 199.90,
    category: "Tech & Celular",
    categorySlug: "tech",
    tag: null,
    emoji: "🔊",
    description: "Caixa de som portátil à prova d'água com som 360° e graves potentes. Perfeita para usar em qualquer ambiente.",
    features: ["Som 360° com 20W RMS", "À prova d'água IPX7", "Bateria 10h de reprodução", "Bluetooth 5.3", "Microfone embutido"],
    stock: 22,
  },
  {
    id: 4,
    name: "Boneca Interativa",
    price: 129.90,
    originalPrice: 159.90,
    category: "Brinquedos",
    categorySlug: "brinquedos",
    tag: "Oferta",
    emoji: "🪆",
    description: "Boneca que fala, canta e reage ao toque. Com mais de 50 frases e músicas em português, é a companheira perfeita para crianças.",
    features: ["50+ frases em português", "Reage ao toque", "Olhos que piscam", "Acessórios inclusos", "Idade: 3+"],
    stock: 5,
  },
  {
    id: 5,
    name: "Kit Presente Gamer",
    price: 299.90,
    category: "Presentes",
    categorySlug: "presentes",
    tag: "Mais vendido",
    emoji: "🎁",
    description: "Kit completo para presentear o gamer da sua vida. Mousepad XL, headset e caneca personalizados em embalagem especial para presente.",
    features: ["Mousepad XL 80x40cm", "Headset estéreo 7.1", "Caneca personalizada", "Embalagem presente inclusa", "Cartão de mensagem"],
    stock: 10,
  },
  {
    id: 6,
    name: "Carrinho de Controle Remoto",
    price: 219.90,
    category: "Brinquedos",
    categorySlug: "brinquedos",
    tag: null,
    emoji: "🚗",
    description: "Carrinho turbo com controle remoto de longo alcance, suspensão independente e luzes LED. Velocidade máxima de 30km/h.",
    features: ["Velocidade até 30km/h", "Alcance 50m", "Suspensão independente", "Luzes LED frontais", "Bateria recarregável"],
    stock: 12,
  },
  {
    id: 7,
    name: "Capinha iPhone 15 Pro",
    price: 59.90,
    category: "Tech & Celular",
    categorySlug: "tech",
    tag: "Novidade",
    emoji: "📱",
    description: "Capinha premium com proteção militar contra quedas, bordas elevadas e acabamento fosco antiarranhões. Compatível com MagSafe.",
    features: ["Proteção militar MIL-STD-810G", "Compatível com MagSafe", "Acabamento fosco antiarranhões", "Bordas elevadas", "Acesso a todos os botões"],
    stock: 30,
  },
  {
    id: 8,
    name: "Quebra-Cabeça 1000 peças",
    price: 89.90,
    originalPrice: 119.90,
    category: "Presentes",
    categorySlug: "presentes",
    tag: null,
    emoji: "🧩",
    description: "Quebra-cabeça de 1000 peças com imagem de paisagem brasileira em alta resolução. Ótima opção de presente para toda a família.",
    features: ["1000 peças encaixáveis", "Imagem 68x48cm montada", "Peças de papelão premium", "Caixa com tampa ilustrada", "Idade: 12+"],
    stock: 18,
  },
];

export function getProduct(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}
