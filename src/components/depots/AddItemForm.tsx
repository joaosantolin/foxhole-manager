"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ITEM_CATEGORIES } from "@/lib/constants";

export default function AddItemForm({
  onAdd,
}: {
  onAdd: (data: { name: string; quantity: number; category: string | null }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setQuantity(1);
    setCategory("");
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await onAdd({ name: name.trim(), quantity, category: category || null });
    setSubmitting(false);
    reset();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide py-2 rounded-sm border border-dashed border-(--border) text-(--text-muted) hover:text-(--text) hover:border-(--text-muted) transition-colors cursor-pointer"
      >
        <Plus size={13} /> Adicionar item
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-2 flex flex-col gap-2 p-2.5 rounded-sm bg-(--bg-input) border border-(--border)">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do item"
        className="bg-transparent border border-(--border) rounded-sm px-2 py-1.5 text-sm outline-none focus:border-(--accent-info)"
      />
      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
          className="w-20 bg-transparent border border-(--border) rounded-sm px-2 py-1.5 text-sm outline-none focus:border-(--accent-info)"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 bg-transparent border border-(--border) rounded-sm px-2 py-1.5 text-sm outline-none focus:border-(--accent-info)"
        >
          <option value="">Sem categoria</option>
          {ITEM_CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-(--bg-panel)">
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={reset}
          className="text-xs px-3 py-1.5 rounded-sm text-(--text-muted) hover:text-(--text) cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="text-xs px-3 py-1.5 rounded-sm bg-(--accent-supply) text-(--bg) font-semibold hover:brightness-110 disabled:opacity-50 cursor-pointer"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}
