import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export interface SearchResult {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  tag: string | null;
  category: string;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json([] as SearchResult[]);
  }

  try {
    const products = await db.product.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        tag: true,
        category: { select: { name: true } },
      },
      take: 6,
      orderBy: { name: "asc" },
    });

    const results: SearchResult[] = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      imageUrl: p.images[0] ?? null,
      tag: p.tag ?? null,
      category: p.category.name,
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([] as SearchResult[], { status: 500 });
  }
}
