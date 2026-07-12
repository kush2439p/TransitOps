import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;
const API = `${BASE}/api`;
const TOKEN_KEY = "transitops.jwt";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const http = axios.create({ baseURL: API, timeout: 15000 });

http.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      // token invalid/expired
      clearToken();
    }
    return Promise.reject(err);
  },
);

export const authApi = {
  signup: (payload) => http.post("/auth/signup", payload).then((r) => r.data),
  login: (email, password) => http.post("/auth/login", { email, password }).then((r) => r.data),
  me: () => http.get("/auth/me").then((r) => r.data),
  health: () => http.get("/health").then((r) => r.data),
};

export default http;
