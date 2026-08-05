import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

export async function registerUser(userData) {
  const response = await axios.post(`${BASE_URL}/register`, userData);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  return response.data;
}

export async function getProfile(token) {
  const response = await axios.get(`${BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
