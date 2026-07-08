"use client";

import { useState } from "react";
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

  return (
    <div className="group flex items-center gap-2 py-1.5 border-b border-(--border-soft) last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{item.name}</p>
        {item.category && (
          <p className="text-[10px] uppercase tracking-wide text-(--text-dim)">
            {item.category}
          </p>
        )}
        <p className="text-[10px] uppercase tracking-wide text-(--text-dim)">
          {item.isBoxed ? "Em caixa" : "Item solto"}
        </p>
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
