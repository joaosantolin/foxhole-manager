"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Search, X } from "lucide-react";
import { ITEM_CATEGORIES, ITEM_PACKAGING_OPTIONS } from "@/lib/constants";
import type { FoxholeItem } from "@/lib/foxhole-items";

function getItemIconSrc(item: FoxholeItem) {
  const fileName = item.imgName || item.imageName;
  
  if (!fileName) return null;
    return fileName;
}

export default function AddItemForm({
  onAdd,
}: {
  onAdd: (data: {
    name: string;
    quantity: number;
    category: string | null;
    isBoxed: boolean;
  }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<FoxholeItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoxholeItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<string>("");
  const [isBoxed, setIsBoxed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const term = search.trim();
    if (term.length < 2) return;

    let active = true;
    const timeout = window.setTimeout(async () => {
      setSearching(true);
      setSearchError(null);

      try {
        const res = await fetch(`/api/foxhole-items?q=${encodeURIComponent(term)}`);
        const data = (await res.json()) as FoxholeItem[] | { error?: string };

        if (!res.ok) {
          throw new Error("error" in data && data.error ? data.error : "Falha ao buscar itens.");
        }

        if (!active) return;
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!active) return;
        setSuggestions([]);
        setSearchError(error instanceof Error ? error.message : "Falha ao buscar itens.");
      } finally {
        if (active) setSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [open, search]);

  const reset = () => {
    setSearch("");
    setSearchError(null);
    setSuggestions([]);
    setSelectedItem(null);
    setQuantity(1);
    setCategory("");
    setIsBoxed(false);
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemName = selectedItem?.itemName ?? search.trim();
    if (!itemName) return;
    setSubmitting(true);
    await onAdd({ name: itemName, quantity, category: category || null, isBoxed });
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
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-widest text-(--text-dim)">
          Buscar item do jogo
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-(--text-dim) hover:text-(--text) cursor-pointer"
          aria-label="Fechar formulário"
        >
          <X size={14} />
        </button>
      </div>

      <div className="relative">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-dim)"
        />
        <input
          autoFocus
          value={search}
          onChange={(e) => {
            const next = e.target.value;
            setSearch(next);
            if (selectedItem && next.trim() !== selectedItem.itemName) {
              setSelectedItem(null);
            }
            if (next.trim().length < 2) {
              setSuggestions([]);
              setSearchError(null);
              setSearching(false);
            }
          }}
          placeholder="Buscar item do Warden na API"
          className="w-full bg-transparent border border-(--border) rounded-sm pl-8 pr-8 py-1.5 text-sm outline-none focus:border-(--accent-info)"
        />
        {searching && (
          <Loader2
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-(--text-dim)"
          />
        )}
      </div>

      {searchError && (
        <p className="text-[10px] uppercase tracking-widest text-(--accent-critical)">
          {searchError}
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="max-h-44 overflow-auto rounded-sm border border-(--border-soft) bg-(--bg-panel)">
          {suggestions.map((item, index) => (
            <button
              key={`${item._id || item.itemName}-${item.itemCategory}-${index}`}
              type="button"
              onClick={() => {
                setSelectedItem(item);
                setSearch(item.itemName);
                setSuggestions([]);
                setSearchError(null);
              }}
              className="w-full text-left px-3 py-2 border-b border-(--border-soft) last:border-b-0 hover:bg-(--bg-panel-raised) transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-(--border-soft) bg-(--bg-input)">
                  {getItemIconSrc(item) ? (
                    <img
                      src={getItemIconSrc(item) ?? ""}
                      alt={item.itemName}
                      className="h-6 w-6 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[9px] uppercase tracking-widest text-(--text-dim)">
                      FX
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-(--text)">{item.itemName}</span>
                  <span className="block text-[10px] uppercase tracking-widest text-(--text-dim)">
                    {item.itemCategory}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedItem && (
        <p className="text-[10px] uppercase tracking-widest text-(--text-dim)">
          Selecionado: {selectedItem.itemName} · {selectedItem.itemCategory}
        </p>
      )}

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

      <select
        value={String(isBoxed)}
        onChange={(e) => setIsBoxed(e.target.value === "true")}
        className="bg-transparent border border-(--border) rounded-sm px-2 py-1.5 text-sm outline-none focus:border-(--accent-info)"
      >
        {ITEM_PACKAGING_OPTIONS.map((option) => (
          <option key={option.label} value={String(option.value)} className="bg-(--bg-panel)">
            {option.label}
          </option>
        ))}
      </select>

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
          disabled={submitting || !search.trim()}
          className="text-xs px-3 py-1.5 rounded-sm bg-(--accent-supply) text-(--bg) font-semibold hover:brightness-110 disabled:opacity-50 cursor-pointer"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}
