const API_ROOT = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL?.replace(/\/$/, "") || "http://localhost:9000/itareport";

export const env = {
  API_ROOT,
  API_URL: `${API_ROOT}/v1`,
  STORAGE_URL,
} as const;
