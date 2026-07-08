"use client";

import { useEffect, useState } from "react";
import type { Depot } from "@/lib/types";
import DepotCard from "./DepotCard";
import NewDepotForm from "./NewDepotForm";

export default function DepotsPanel() {
  const [depots, setDepots] = useState<Depot[] | null>(null);

  const load = async () => {
    const res = await fetch("/api/depots");
    const data = await res.json();
    setDepots(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial dos depósitos ao montar
    load();
  }, []);

  const createDepot = async (data: { name: string; region: string | null }) => {
    const res = await fetch("/api/depots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const depot = await res.json();
    setDepots((prev) => (prev ? [...prev, depot] : [depot]));
  };

  const deleteDepot = async (id: string) => {
    setDepots((prev) => prev?.filter((d) => d.id !== id) ?? prev);
    await fetch(`/api/depots/${id}`, { method: "DELETE" });
  };

  const refreshDepot = async (id: string) => {
    const res = await fetch(`/api/depots/${id}/refresh`, { method: "POST" });
    const updated = await res.json();
    setDepots((prev) => prev?.map((d) => (d.id === id ? updated : d)) ?? prev);
  };

  const addItem = async (
    depotId: string,
    data: { name: string; quantity: number; category: string | null; isBoxed: boolean }
  ) => {
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, depotId }),
    });
    const item = await res.json();
    setDepots(
      (prev) =>
        prev?.map((d) =>
          d.id === depotId ? { ...d, items: [...d.items, item] } : d
        ) ?? prev
    );
  };

  const changeItemQuantity = (depotId: string, itemId: string, quantity: number) => {
    setDepots(
      (prev) =>
        prev?.map((d) =>
          d.id === depotId
            ? {
                ...d,
                items: d.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
              }
            : d
        ) ?? prev
    );
    fetch(`/api/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
  };

  const deleteItem = (depotId: string, itemId: string) => {
    setDepots(
      (prev) =>
        prev?.map((d) =>
          d.id === depotId ? { ...d, items: d.items.filter((i) => i.id !== itemId) } : d
        ) ?? prev
    );
    fetch(`/api/items/${itemId}`, { method: "DELETE" });
  };

  if (depots === null) {
    return (
      <div className="text-sm text-(--text-dim) uppercase tracking-widest py-16 text-center">
        Carregando depósitos…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {depots.map((depot) => (
        <DepotCard
          key={depot.id}
          depot={depot}
          onRefresh={() => refreshDepot(depot.id)}
          onDelete={() => deleteDepot(depot.id)}
          onAddItem={(data) => addItem(depot.id, data)}
          onChangeItem={(itemId, q) => changeItemQuantity(depot.id, itemId, q)}
          onDeleteItem={(itemId) => deleteItem(depot.id, itemId)}
        />
      ))}
      <NewDepotForm onCreate={createDepot} />
    </div>
  );
}
