import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import type { FoxholeItem } from "@/lib/foxhole-items";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get("q")?.trim().toLowerCase() ?? "";

    // Caminho para o JSON dentro da pasta public
    const filePath = path.join(process.cwd(), "public", "foxhole_items", "items.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "JSON não encontrado" }, { status: 500 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const localItems = JSON.parse(fileContent) as Array<{
      title: string;
      image_local_path: string;
    }>;

    const filtered = localItems
      .filter((item) => (searchTerm ? item.title.toLowerCase().includes(searchTerm) : true))
      .sort((left, right) => left.title.localeCompare(right.title));

    const mappedItems: FoxholeItem[] = filtered.map((item, index) => {
      // 1. Pega o path: "foxhole_items\\images\\00MS_Stinger.png"
      // 2. Remove o "foxhole_items\\" ou "foxhole_items/"
      // 3. Resultado final esperado: "images/00MS_Stinger.png"
      
      const rawPath = item.image_local_path || "";
      // Substitui barras invertidas por barras normais para garantir compatibilidade
      const normalizedPath = rawPath.replace(/\\/g, "/");
      
      // Extrai apenas a parte que começa em "images/..."
      const imagePart = normalizedPath.split("images/").pop();
      
      return {
        _id: `local_${index}`,
        itemName: item.title,
        itemCategory: "General",
        // O caminho final para o navegador: /foxhole_items/images/nome_da_imagem.png
        imageName: imagePart ? `/foxhole_items/images/${imagePart}` : "/file.svg",
        faction: ["warden", "colonial"],
        isMpfCraftable: false,
      };
    });

    return NextResponse.json(mappedItems.slice(0, 20));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}