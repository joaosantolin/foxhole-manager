import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, quantity, category, depotId, isBoxed } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Nome do item é obrigatório." },
      { status: 400 }
    );
  }
  if (!depotId) {
    return NextResponse.json(
      { error: "depotId é obrigatório." },
      { status: 400 }
    );
  }

  const item = await prisma.item.create({
    data: {
      name: name.trim(),
      quantity: Number.isFinite(quantity) ? Math.max(0, Math.trunc(quantity)) : 0,
      category: category || null,
      isBoxed: Boolean(isBoxed),
      depotId,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
