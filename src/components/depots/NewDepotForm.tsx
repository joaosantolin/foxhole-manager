"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function NewDepotForm({
  onCreate,
}: {
  onCreate: (data: { name: string; region: string | null }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setRegion("");
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await onCreate({ name: name.trim(), region: region.trim() || null });
    setSubmitting(false);
    reset();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="min-h-[220px] rounded-md border border-dashed border-(--border) flex flex-col items-center justify-center gap-2 text-(--text-muted) hover:text-(--text) hover:border-(--text-muted) transition-colors cursor-pointer"
      >
        <Plus size={20} />
        <span className="text-sm uppercase tracking-wide">Novo depósito</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="min-h-[220px] rounded-md border border-(--border) bg-(--bg-panel) p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-(--text-dim)">
          Novo depósito
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-(--text-dim) hover:text-(--text) cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do local (ex: The Moors - Bunker Base)"
        className="bg-transparent border border-(--border) rounded-sm px-2.5 py-2 text-sm outline-none focus:border-(--accent-info)"
      />
      <input
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        placeholder="Região / hex (opcional)"
        className="bg-transparent border border-(--border) rounded-sm px-2.5 py-2 text-sm outline-none focus:border-(--accent-info)"
      />
      <div className="flex-1" />
      <button
        type="submit"
        disabled={submitting || !name.trim()}
        className="text-sm px-3 py-2 rounded-sm bg-(--accent-supply) text-(--bg) font-semibold hover:brightness-110 disabled:opacity-50 cursor-pointer"
      >
        Criar depósito
      </button>
    </form>
  );
}
