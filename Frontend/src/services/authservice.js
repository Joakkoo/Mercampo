import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000"; // Ajusta la URL de tu backend

export const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  return res.data;
}

export const logoutUser = async () => {
  try {
    sessionStorage.removeItem("token");
  } finally {
    // Limpieza de respaldo por si aún quedara en localStorage de sesiones previas
    localStorage.removeItem("token");
  }
};
