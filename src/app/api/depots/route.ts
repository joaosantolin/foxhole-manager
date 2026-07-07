import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const depots = await prisma.depot.findMany({
    include: { items: { orderBy: { name: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(depots);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, region, notes } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Nome do depósito é obrigatório." },
      { status: 400 }
    );
  }

  const depot = await prisma.depot.create({
    data: {
      name: name.trim(),
      region: region?.trim() || null,
      notes: notes?.trim() || null,
    },
    include: { items: true },
  });

  return NextResponse.json(depot, { status: 201 });
}
