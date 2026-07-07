"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { TaskPriority } from "@/lib/types";
import { TASK_PRIORITY_LABELS } from "@/lib/constants";

export default function NewTaskForm({
  onAdd,
}: {
  onAdd: (data: { title: string; description: string | null; priority: TaskPriority }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await onAdd({ title: title.trim(), description: description.trim() || null, priority });
    setSubmitting(false);
    reset();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 text-xs uppercase tracking-wide py-2.5 rounded-sm border border-dashed border-(--border) text-(--text-muted) hover:text-(--text) hover:border-(--text-muted) transition-colors cursor-pointer"
      >
        <Plus size={13} /> Nova tarefa
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 p-2.5 rounded-sm bg-(--bg-input) border border-(--border)">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da tarefa"
        className="bg-transparent border border-(--border) rounded-sm px-2 py-1.5 text-sm outline-none focus:border-(--accent-info)"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
        rows={2}
        className="bg-transparent border border-(--border) rounded-sm px-2 py-1.5 text-sm outline-none focus:border-(--accent-info) resize-none"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        className="bg-transparent border border-(--border) rounded-sm px-2 py-1.5 text-sm outline-none focus:border-(--accent-info)"
      >
        {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
          <option key={value} value={value} className="bg-(--bg-panel)">
            Prioridade {label}
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
          disabled={submitting || !title.trim()}
          className="text-xs px-3 py-1.5 rounded-sm bg-(--accent-supply) text-(--bg) font-semibold hover:brightness-110 disabled:opacity-50 cursor-pointer"
        >
          Adicionar
        </button>
      </div>
    </form>
  );
}
