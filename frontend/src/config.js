/**
 * API Configuration
 * This file centralizes all API endpoint configurations
 */

// Automatically detect environment and use appropriate backend URL
// For local development: http://localhost:8000
// For production: https://medilens-backend-e3x0.onrender.com
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isDevelopment ? 'http://localhost:8000' : 'https://medilens-backend-e3x0.onrender.com')

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
