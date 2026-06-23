import { useState } from "react";
import type { AuthUser, AuthResult } from "./api";
import { login as apiLogin, register as apiRegister } from "./api";

const TOKEN_KEY = "artwalls_token";
const USER_KEY = "artwalls_user";

function readUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(readUser);

  function save(result: AuthResult) {
    setToken(result.token);
    setUser(result.user);
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
  }

  async function login(email: string, password: string) {
    save(await apiLogin(email, password));
  }

  async function register(name: string, email: string, password: string) {
    save(await apiRegister(name, email, password));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { token, user, login, register, logout };
}