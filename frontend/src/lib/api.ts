import axios from "axios";

// Create the instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  withCredentials: true, // <--- CRITICAL: Sends cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor (The "Bouncer")
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If backend says "You are not authenticated" (401)
    if (error.response?.status === 401) {
      // Redirect to login
      // Note: cannot use Next.js 'useRouter' here because this is a plain TS file, not a Component.
      // We use window.location as a fallback to force the redirect.
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
