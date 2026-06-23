import type { Artwork, NewArtwork } from "./types";

const API_BASE = "http://localhost:5000";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  wallet: number;
}
export interface AuthResult {
  token: string;
  user: AuthUser;
}

function headers(token?: string): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

export async function register(name: string, email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST", headers: headers(), body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not register");
  return data;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST", headers: headers(), body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Could not log in");
  return data;
}

export async function getArtworks(): Promise<Artwork[]> {
  const res = await fetch(`${API_BASE}/api/artworks`);
  if (!res.ok) throw new Error("Could not load artworks");
  return res.json();
}

export async function createArtwork(input: NewArtwork, token: string): Promise<Artwork> {
  const res = await fetch(`${API_BASE}/api/artworks`, {
    method: "POST", headers: headers(token), body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Could not save artwork");
  return res.json();
}

export async function deleteArtwork(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/artworks/${id}`, {
    method: "DELETE", headers: headers(token),
  });
  if (!res.ok) throw new Error("Could not delete artwork");
}


export async function subscribeArtwork(id: string, token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/artworks/${id}/subscribe`, {
    method: "POST", headers: headers(token),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Could not subscribe");
  }
}
export async function updateArtwork(
  id: string,
  input: Partial<NewArtwork>,
  token: string
): Promise<Artwork> {
  const res = await fetch(`${API_BASE}/api/artworks/${id}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Could not update artwork");
  }

  return data;
}