export const env = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/v1",
} as const;
