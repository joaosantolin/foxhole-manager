"use client";

import { useState } from "react";
import { Boxes, KanbanSquare } from "lucide-react";
import Image from "next/image";
import DepotsPanel from "./depots/DepotsPanel";
import KanbanBoard from "./kanban/KanbanBoard";

type Tab = "depots" | "kanban";

export default function AppShell() {
  const [tab, setTab] = useState<Tab>("depots");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-(--border) bg-(--bg-panel)/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-5 pt-5 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm border border-(--border) bg-(--bg-panel-raised) overflow-hidden shrink-0">
              <Image
                src="/copom_logo_foxhole.png"
                alt="COPOM Foxhole"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="font-display text-2xl uppercase tracking-wider leading-none">
                Estoque de Guerra
              </h1>
              <p className="text-[11px] text-(--text-dim) uppercase tracking-widest mt-0.5">
                Logística de Regimento · Foxhole
              </p>
            </div>
          </div>

          <nav className="flex gap-1 mt-5">
            <TabButton
              active={tab === "depots"}
              onClick={() => setTab("depots")}
              icon={<Boxes size={14} />}
              label="Depósitos"
            />
            <TabButton
              active={tab === "kanban"}
              onClick={() => setTab("kanban")}
              icon={<KanbanSquare size={14} />}
              label="Quadro de Tarefas"
            />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-5 py-6">
        {tab === "depots" ? <DepotsPanel /> : <KanbanBoard />}
      </main>

      <footer className="border-t border-(--border-soft) py-4">
        <p className="text-center text-[10px] text-(--text-dim) uppercase tracking-widest">
          Não afiliado à Siege Camp — ferramenta de comunidade
        </p>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors cursor-pointer ${
        active
          ? "border-(--accent-warn) text-(--text)"
          : "border-transparent text-(--text-dim) hover:text-(--text-muted)"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
