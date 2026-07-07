"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task, TaskStatus, TaskPriority } from "@/lib/types";
import { TASK_STATUS_LABELS } from "@/lib/constants";
import TaskCard from "./TaskCard";
import NewTaskForm from "./NewTaskForm";

const STATUS_ACCENT: Record<TaskStatus, string> = {
  TODO: "var(--text-muted)",
  IN_PROGRESS: "var(--accent-info)",
  DONE: "var(--accent-supply)",
};

export default function KanbanColumn({
  status,
  tasks,
  onAdd,
  onDelete,
}: {
  status: TaskStatus;
  tasks: Task[];
  onAdd: (data: { title: string; description: string | null; priority: TaskPriority }) => Promise<void>;
  onDelete: (taskId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { type: "column", status } });

  return (
    <div className="flex flex-col min-w-[280px] w-full">
      <div className="flex items-center gap-2 mb-2.5 px-0.5">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: STATUS_ACCENT[status] }}
        />
        <h3 className="font-display text-lg uppercase tracking-wide">
          {TASK_STATUS_LABELS[status]}
        </h3>
        <span className="text-xs text-(--text-dim) tabular-nums ml-auto">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-2 p-2 rounded-md border transition-colors min-h-[120px] ${
          isOver ? "border-(--accent-info) bg-(--accent-info)/5" : "border-(--border-soft) bg-(--bg-panel)/40"
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={() => onDelete(task.id)} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="text-xs text-(--text-dim) italic text-center py-4">Vazio</p>
        )}
        <NewTaskForm onAdd={(data) => onAdd({ ...data })} />
      </div>
    </div>
  );
}
