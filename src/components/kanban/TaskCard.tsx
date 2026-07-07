"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import type { Task } from "@/lib/types";
import { TASK_PRIORITY_LABELS } from "@/lib/constants";

const PRIORITY_COLOR: Record<Task["priority"], string> = {
  LOW: "var(--text-muted)",
  MEDIUM: "var(--accent-warn)",
  HIGH: "var(--accent-critical)",
};

export default function TaskCard({
  task,
  onDelete,
  dragOverlay = false,
}: {
  task: Task;
  onDelete?: () => void;
  dragOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { type: "task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !dragOverlay ? 0.35 : 1,
  };

  return (
    <div
      ref={dragOverlay ? undefined : setNodeRef}
      style={dragOverlay ? undefined : style}
      {...(dragOverlay ? {} : attributes)}
      {...(dragOverlay ? {} : listeners)}
      className={`group panel-texture rounded-sm border border-(--border) bg-(--bg-panel-raised) p-3 cursor-grab active:cursor-grabbing ${
        dragOverlay ? "shadow-xl rotate-1" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-snug flex-1">{task.title}</p>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-(--text-dim) hover:text-(--accent-critical) opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
            aria-label="Excluir tarefa"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      {task.description && (
        <p className="text-xs text-(--text-muted) mt-1.5 leading-snug">{task.description}</p>
      )}
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: PRIORITY_COLOR[task.priority] }}
        />
        <span
          className="text-[10px] uppercase tracking-widest"
          style={{ color: PRIORITY_COLOR[task.priority] }}
        >
          {TASK_PRIORITY_LABELS[task.priority]}
        </span>
      </div>
    </div>
  );
}
