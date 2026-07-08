import { NextRequest, NextResponse } from "next/server";
import type { FoxholeItem } from "@/lib/foxhole-items";

const FOXHOLE_API_BASE_URL = process.env.FOXHOLE_ITEM_API_BASE_URL;
const FOXHOLE_CATALOG_URL = "https://foxholelogi.com/assets/foxhole.json";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchTerm = url.searchParams.get("q")?.trim().toLowerCase() ?? "";

  const upstream = FOXHOLE_API_BASE_URL
    ? new URL("/api/v1/items/warden", FOXHOLE_API_BASE_URL).toString()
    : FOXHOLE_CATALOG_URL;

  const response = await fetch(upstream, { cache: "no-store" });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Falha ao consultar a API de itens do Foxhole." },
      { status: 502 }
    );
  }

  const items = (await response.json()) as FoxholeItem[];
  const filtered = items
    .filter((item) => item.faction?.includes("warden"))
    .filter((item) => (searchTerm ? item.itemName.toLowerCase().includes(searchTerm) : true))
    .sort((left, right) => left.itemName.localeCompare(right.itemName));

  return NextResponse.json(filtered.slice(0, 20));
}