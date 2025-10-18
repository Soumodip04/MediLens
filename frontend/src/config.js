/**
 * API Configuration
 * This file centralizes all API endpoint configurations
 */

// Get API URL from environment variable or use production default
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://medilens-backend-e3x0.onrender.com'

// API Endpoints
export const API_ENDPOINTS = {
  search: `${API_BASE_URL}/search`,
  ocr: `${API_BASE_URL}/ocr`,
  drugs: `${API_BASE_URL}/drugs`,
  info: `${API_BASE_URL}/info`,
  price: `${API_BASE_URL}/price`,
  health: `${API_BASE_URL}/`
}

export default {
  API_BASE_URL,
  API_ENDPOINTS
}
