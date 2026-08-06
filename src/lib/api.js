import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./tokens";

export const API_ORIGIN = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const BASE_URL = `${API_ORIGIN}/api`;

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
}

export class ApiError extends Error {
  constructor(status, body = {}) {
    super(typeof body?.message === "string" ? body.message : `API Error ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function refreshTokenFlow() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    throw new Error("No refresh token");
  }

  isRefreshing = true;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error("Refresh failed");
    const json = await res.json();
    const { accessToken, refreshToken: newRefreshToken } = json.data;
    setTokens(accessToken, newRefreshToken);
    processQueue(null, accessToken);
    return accessToken;
  } catch (err) {
    processQueue(err, null);
    clearTokens();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw err;
  } finally {
    isRefreshing = false;
  }
}

async function request(method, path, body) {
  const url = `${BASE_URL}${path}`;
  const token = getAccessToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, { message: "Network error. Please check your connection." });
  }

  const isPublicAuthRoute = [
    "/auth/send-otp",
    "/auth/verify-otp",
    "/auth/social",
    "/auth/refresh",
  ].some((p) => path.includes(p));

  if (response.status === 401 && !isPublicAuthRoute) {
    const newToken = await refreshTokenFlow();
    headers.Authorization = `Bearer ${newToken}`;
    const retryRes = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const retryJson = await retryRes.json().catch(() => ({}));
    if (!retryRes.ok) throw new ApiError(retryRes.status, retryJson);
    return retryJson;
  }

  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, json);
  return json;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};
