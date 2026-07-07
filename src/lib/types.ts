export type Item = {
  id: string;
  name: string;
  quantity: number;
  category: string | null;
  depotId: string;
  createdAt: string;
  updatedAt: string;
};

export type Depot = {
  id: string;
  name: string;
  region: string | null;
  lastRefillAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: Item[];
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  createdAt: string;
  updatedAt: string;
};
