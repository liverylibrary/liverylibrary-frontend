import api from "./api";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: string;
  username: string;
  role: string;
  exp: number;
}

export async function registerUser(username: string, email: string, password: string) {
  const res = await api.post("/auth/register", { username, email, password });
  return res.data;
}

export async function loginUser(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser(): TokenPayload | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: TokenPayload = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      logoutUser();
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
