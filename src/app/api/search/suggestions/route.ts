import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 3600;

export async function GET() {
  const [categories, tagRows] = await Promise.all([
    db.category.findMany({
      where: { active: true },
      select: { name: true },
      orderBy: { order: "asc" },
    }),
    db.product.findMany({
      where: { active: true, tag: { not: null } },
      select: { tag: true },
      distinct: ["tag"],
    }),
  ]);

  const seen = new Set<string>();
  const suggestions: string[] = [];

  for (const c of categories) {
    if (!seen.has(c.name)) { seen.add(c.name); suggestions.push(c.name); }
  }
  for (const p of tagRows) {
    if (p.tag && !seen.has(p.tag)) { seen.add(p.tag); suggestions.push(p.tag); }
  }

  return NextResponse.json({ suggestions: suggestions.slice(0, 8) });
}
