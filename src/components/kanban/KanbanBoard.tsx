"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Task, TaskStatus, TaskPriority } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";
import TaskCard from "./TaskCard";

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  const columns = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
    (tasks ?? []).forEach((t) => grouped[t.status].push(t));
    STATUSES.forEach((s) => grouped[s].sort((a, b) => a.order - b.order));
    return grouped;
  }, [tasks]);

  const addTask = async (
    status: TaskStatus,
    data: { title: string; description: string | null; priority: TaskPriority }
  ) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status }),
    });
    const task = await res.json();
    setTasks((prev) => (prev ? [...prev, task] : [task]));
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev?.filter((t) => t.id !== taskId) ?? prev);
    fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks?.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || !tasks) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    // Destino pode ser uma coluna vazia (id = status) ou outra tarefa
    const overIsColumn = STATUSES.includes(over.id as TaskStatus);
    const overTask = tasks.find((t) => t.id === over.id);
    const newStatus: TaskStatus = overIsColumn ? (over.id as TaskStatus) : overTask!.status;

    if (draggedTask.status === newStatus && active.id === over.id) return;

    setTasks((prev) => {
      if (!prev) return prev;
      const withoutActive = prev.filter((t) => t.id !== draggedTask.id);
      const destTasks = withoutActive
        .filter((t) => t.status === newStatus)
        .sort((a, b) => a.order - b.order);

      let insertIndex = destTasks.length;
      if (!overIsColumn && overTask) {
        insertIndex = destTasks.findIndex((t) => t.id === overTask.id);
        if (insertIndex === -1) insertIndex = destTasks.length;
      }

      destTasks.splice(insertIndex, 0, { ...draggedTask, status: newStatus });
      const reordered = destTasks.map((t, idx) => ({ ...t, order: idx }));

      const others = withoutActive.filter((t) => t.status !== newStatus);
      const next = [...others, ...reordered];

      // Persiste no backend (fire and forget)
      fetch(`/api/tasks/${draggedTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          order: reordered.find((t) => t.id === draggedTask.id)?.order ?? 0,
        }),
      });

      return next;
    });
  };

  if (tasks === null) {
    return (
      <div className="text-sm text-(--text-dim) uppercase tracking-widest py-16 text-center">
        Carregando quadro…
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columns[status]}
            onAdd={(data) => addTask(status, data)}
            onDelete={deleteTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} dragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
