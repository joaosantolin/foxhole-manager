"use client";

import { useState } from "react";
import Image from "next/image"; // 1. Importe o componente Image
import { Minus, Plus, Trash2 } from "lucide-react";
import type { Item } from "@/lib/types";

export default function ItemRow({
  item,
  onChange,
  onDelete,
}: {
  item: Item;
  onChange: (quantity: number) => void;
  onDelete: () => void;
}) {
  const [pending, setPending] = useState(false);

  const bump = async (delta: number) => {
    const next = Math.max(0, item.quantity + delta);
    setPending(true);
    await onChangeAsync(next);
    setPending(false);
  };

  const onChangeAsync = async (next: number) => {
    onChange(next);
  };

  const getItemImagePath = (itemName: string) => {
    const formattedName = itemName
      .replace(/\s+/g, '_')
      .replace(/[.()]/g, '_')
      .replace(/_+/g, '_');
    
    return `/foxhole_items/images/${formattedName}.png`;
  };

  return (
    <div className="group flex items-center gap-3 py-1.5 border-b border-(--border-soft) last:border-b-0">
      {/* 2. Adicione a imagem aqui */}
      <div className="relative w-8 h-8 shrink-0">
        <Image
          src={getItemImagePath(item.name)}
          alt={item.name}
          width={32}
          height={32}
          className="object-contain"
          onError={(e) => {
            // Fallback: se a imagem não existir, exibe um ícone genérico ou esconde
            e.currentTarget.src = "/foxhole_items/images/Items.png";
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm truncate font-medium">{item.name}</p>
        <div className="flex gap-2">
          {item.category && (
            <p className="text-[10px] uppercase tracking-wide text-(--text-dim)">
              {item.category}
            </p>
          )}
          <p className="text-[10px] uppercase tracking-wide text-(--text-dim)">
            {item.isBoxed ? "• Em caixa" : "• Item solto"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => bump(-1)}
          disabled={pending || item.quantity <= 0}
          className="w-6 h-6 flex items-center justify-center rounded-sm border border-(--border) text-(--text-muted) hover:text-(--text) hover:border-(--text-muted) disabled:opacity-30 transition-colors cursor-pointer"
          aria-label="Diminuir quantidade"
        >
          <Minus size={12} />
        </button>
        <span className="w-10 text-center text-sm font-semibold tabular-nums">
          {item.quantity}
        </span>
        <button
          onClick={() => bump(1)}
          disabled={pending}
          className="w-6 h-6 flex items-center justify-center rounded-sm border border-(--border) text-(--text-muted) hover:text-(--text) hover:border-(--text-muted) transition-colors cursor-pointer"
          aria-label="Aumentar quantidade"
        >
          <Plus size={12} />
        </button>
        <button
          onClick={onDelete}
          className="w-6 h-6 flex items-center justify-center rounded-sm text-(--text-dim) hover:text-(--accent-critical) opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Remover item"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}