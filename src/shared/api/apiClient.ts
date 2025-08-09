import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
