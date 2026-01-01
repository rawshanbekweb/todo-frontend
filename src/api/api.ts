import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let accessToken: string | null = localStorage.getItem("accessToken");
let refreshToken: string | null = localStorage.getItem("refreshToken");

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;

  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshToken) return Promise.reject(error);

      try {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );

  accessToken = res.data.accessToken;

  localStorage.setItem("accessToken", accessToken!);

  originalRequest.headers.Authorization = `Bearer ${accessToken}`;

  return api(originalRequest);

} catch (e) {
  localStorage.removeItem("accessToken");
  return Promise.reject(e);
}
    }

    return Promise.reject(error);
  }
);

export default api;