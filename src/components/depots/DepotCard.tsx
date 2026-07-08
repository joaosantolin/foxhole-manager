"use client";

import { useState } from "react";
import { MapPin, RefreshCw, Trash2 } from "lucide-react";
import type { Depot } from "@/lib/types";
import SupplyGauge from "./SupplyGauge";
import ItemRow from "./ItemRow";
import AddItemForm from "./AddItemForm";

export default function DepotCard({
  depot,
  onRefresh,
  onDelete,
  onAddItem,
  onChangeItem,
  onDeleteItem,
}: {
  depot: Depot;
  onRefresh: () => Promise<void>;
  onDelete: () => Promise<void>;
  onAddItem: (data: {
    name: string;
    quantity: number;
    category: string | null;
    isBoxed: boolean;
  }) => Promise<void>;
  onChangeItem: (itemId: string, quantity: number) => void;
  onDeleteItem: (itemId: string) => void;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const totalUnits = depot.items.reduce((sum, i) => sum + i.quantity, 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <div className="panel-texture rounded-md border border-(--border) bg-(--bg-panel) flex flex-col overflow-hidden">
      <div className="px-4 pt-3.5 pb-3 border-b border-(--border-soft)">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display text-xl leading-tight uppercase tracking-wide truncate">
              {depot.name}
            </h3>
            {depot.region && (
              <p className="flex items-center gap-1 text-xs text-(--text-muted) mt-0.5">
                <MapPin size={11} /> {depot.region}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleRefresh}
              title="Marcar como reabastecido agora"
              className="w-7 h-7 flex items-center justify-center rounded-sm border border-(--border) text-(--text-muted) hover:text-(--accent-supply) hover:border-(--accent-supply) transition-colors cursor-pointer"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => (confirmingDelete ? onDelete() : setConfirmingDelete(true))}
              onBlur={() => setConfirmingDelete(false)}
              title={confirmingDelete ? "Confirmar exclusão" : "Excluir depósito"}
              className={`w-7 h-7 flex items-center justify-center rounded-sm border transition-colors cursor-pointer ${
                confirmingDelete
                  ? "border-(--accent-critical) text-(--accent-critical) bg-(--accent-critical)/10"
                  : "border-(--border) text-(--text-muted) hover:text-(--accent-critical) hover:border-(--accent-critical)"
              }`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <SupplyGauge lastRefillAt={depot.lastRefillAt} />
        </div>
      </div>

      <div className="px-4 py-3 flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-widest text-(--text-dim)">
            Estoque
          </span>
          <span className="text-[10px] uppercase tracking-widest text-(--text-dim) tabular-nums">
            {totalUnits} un. · {depot.items.length} itens
          </span>
        </div>

        {depot.items.length === 0 ? (
          <p className="text-xs text-(--text-dim) italic py-3 text-center">
            Nenhum item registrado neste depósito.
          </p>
        ) : (
          <div>
            {depot.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onChange={(q) => onChangeItem(item.id, q)}
                onDelete={() => onDeleteItem(item.id)}
              />
            ))}
          </div>
        )}

        <AddItemForm onAdd={onAddItem} />
      </div>
    </div>
  );
}
