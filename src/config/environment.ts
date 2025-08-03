// Environment configuration
export const config = {
  // Backend URL - will use environment variable or fallback to localhost for development
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5001",

  // Check if we're in production
  IS_PRODUCTION: import.meta.env.PROD,

  // Check if we're in development
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

export default config;
