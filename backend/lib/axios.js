// src/lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5500/api",
  withCredentials: true, // if you use cookies/auth
});

export default api;
