import axios from "axios";

const API_URL = import.meta.env.VITE_APP_API_URL; // Ajusta la URL de tu backend

export const registerUser = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
}

export const logoutUser = async () => {
  localStorage.removeItem("token");
};
