import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Point to your Express Backend
  withCredentials: true, // IMPORTANT: Allows cookies (JWT) to be sent/received
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add an interceptor to log errors globally (Production pattern)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), could force a logout here later
    return Promise.reject(error);
  }
);

export default api;
