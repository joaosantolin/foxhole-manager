// Duração do ciclo de refresh de um depósito em Foxhole: 3 dias
export const REFILL_INTERVAL_MS = 49 * 60 * 60 * 1000;

export const ITEM_CATEGORIES = [
  "Armas",
  "Munição",
  "Suprimentos Médicos",
  "Materiais de Construção",
  "Combustível",
  "Veículos",
  "Uniformes",
  "Outros",
] as const;

export const ITEM_PACKAGING_OPTIONS = [
  { value: false, label: "Item solto" },
  { value: true, label: "Em caixa" },
] as const;

export const TASK_STATUS_LABELS: Record<string, string> = {
  TODO: "A Fazer",
  IN_PROGRESS: "Em Andamento",
  DONE: "Concluído",
};

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};
