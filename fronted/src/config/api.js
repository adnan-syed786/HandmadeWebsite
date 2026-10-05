// Central API base configuration
// In development we call backend directly on port 5000.
// Can be overridden by VITE_API_BASE env var.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
export const apiUrl = (path) => `${API_BASE}${path}`;
