import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, quantity, category, isBoxed } = body;

  const item = await prisma.item.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(quantity !== undefined
        ? { quantity: Math.max(0, Math.trunc(Number(quantity)) || 0) }
        : {}),
      ...(category !== undefined ? { category: category || null } : {}),
      ...(isBoxed !== undefined ? { isBoxed: Boolean(isBoxed) } : {}),
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.item.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
