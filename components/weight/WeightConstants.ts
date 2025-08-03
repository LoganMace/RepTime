export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  timestamp: number;
}

// Helper functions for weight display
export const getChangeColor = (change: number) => {
  if (change < 0) return "#22c55e"; // Green for weight loss
  if (change > 0) return "#ef4444"; // Red for weight gain
  return "#6b7280"; // Gray for no change
};

export const getChangeIcon = (change: number) => {
  if (change < 0) return "↓";
  if (change > 0) return "↑";
  return "→";
};

export const getTrendIcon = (current: number, previous: number) => {
  if (current < previous) return "🟢";
  if (current > previous) return "🔴";
  return "🟡";
};
