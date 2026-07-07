import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Reinicia a contagem do refresh do depósito (usar quando o depósito reabastecer)
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const depot = await prisma.depot.update({
    where: { id },
    data: { lastRefillAt: new Date() },
    include: { items: true },
  });
  return NextResponse.json(depot);
}
