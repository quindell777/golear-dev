// src/types/api.ts
export interface HealthResponse {
  status: "ok" | string;
  message: string;
  timestamp: string; // ISO date string
  database: string;
}