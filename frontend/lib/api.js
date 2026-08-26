const API_URL = "http://localhost:5000/api";

/** @param {string} endpoint @param {RequestInit} [options] @param {string|null} [token] */
export const apiRequest = async (endpoint, options = {}, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};
