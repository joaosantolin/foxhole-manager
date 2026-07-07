"use client";

import { useEffect, useState } from "react";
import { REFILL_INTERVAL_MS } from "@/lib/constants";

function formatRemaining(ms: number) {
  if (ms <= 0) return "REABASTECIDO";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  if (days > 0) return `${days}d ${pad(hours)}h ${pad(minutes)}m`;
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export default function SupplyGauge({ lastRefillAt }: { lastRefillAt: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza o relógio ao montar, depois só o timer atualiza
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(lastRefillAt).getTime();
  const elapsed = now !== null ? now - start : 0;
  const remaining = REFILL_INTERVAL_MS - elapsed;
  const pctRemaining = Math.min(100, Math.max(0, (remaining / REFILL_INTERVAL_MS) * 100));

  let state: "supply" | "warn" | "critical" = "supply";
  if (remaining <= 0) state = "critical";
  else if (pctRemaining <= 20) state = "critical";
  else if (pctRemaining <= 50) state = "warn";

  const colorVar =
    state === "supply"
      ? "var(--accent-supply)"
      : state === "warn"
      ? "var(--accent-warn)"
      : "var(--accent-critical)";

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[10px] tracking-widest uppercase text-(--text-dim)">
          Ciclo de reabastecimento
        </span>
        <span
          className={`text-xs font-semibold tabular-nums ${
            state === "critical" && remaining > 0 ? "pulse-critical" : ""
          }`}
          style={{ color: colorVar }}
        >
          {now === null ? "—" : formatRemaining(remaining)}
        </span>
      </div>
      <div
        className="h-2.5 w-full rounded-sm overflow-hidden border"
        style={{ background: "var(--bg-input)", borderColor: "var(--border)" }}
      >
        <div
          className="h-full transition-[width] duration-1000 ease-linear"
          style={{
            width: `${now === null ? 100 : pctRemaining}%`,
            background: colorVar,
            boxShadow: state !== "supply" ? `0 0 8px ${colorVar}` : "none",
          }}
        />
      </div>
    </div>
  );
}
