"use client";

// Auth API — live Laravel endpoints when configured, mock otherwise.
// On the mock path, any credentials "work" and produce a local demo session so
// the account area is fully explorable without a backend.

import { apiSend, apiGet, useApi } from "./http";
import type { AuthUser } from "./types";

export interface AuthResult {
  user: AuthUser;
  token: string;
}

function mockUser(
  name: string,
  email: string | null,
  phone: string | null = null,
): AuthUser {
  // On the mock path, derive a staff role from the email so the admin panel is
  // explorable standalone (mirrors the backend AdminSeeder's admin@ account).
  const lower = (email ?? "").toLowerCase();
  const role: AuthUser["role"] = lower.startsWith("admin")
    ? "admin"
    : lower.startsWith("mod")
      ? "moderator"
      : "customer";
  return { id: role === "admin" ? 1 : 2, name, email, phone, avatar: null, role };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  if (!useApi) {
    return { user: mockUser(email.split("@")[0] || "Customer", email), token: "mock-token" };
  }
  const res = await apiSend<{ user: AuthUser; token: string }>("POST", "/auth/login", {
    email,
    password,
  });
  return { user: res.user, token: res.token };
}

export async function register(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResult> {
  if (!useApi) {
    return { user: mockUser(input.name, input.email, input.phone ?? null), token: "mock-token" };
  }
  const res = await apiSend<{ user: AuthUser; token: string }>("POST", "/auth/register", input);
  return { user: res.user, token: res.token };
}

export async function forgotPassword(email: string): Promise<string> {
  if (!useApi) return "If that email exists, a reset link has been sent.";
  const res = await apiSend<{ message: string }>("POST", "/auth/forgot-password", { email });
  return res.message;
}

export async function logout(token: string | null): Promise<void> {
  if (!useApi || !token) return;
  try {
    await apiSend("POST", "/auth/logout", undefined, { token });
  } catch {
    /* ignore — clearing local state is enough */
  }
}

export async function fetchProfile(token: string): Promise<AuthUser | null> {
  if (!useApi) return null;
  try {
    const res = await apiGet<{ user: AuthUser }>("/user/profile", { token });
    return res.user;
  } catch {
    return null;
  }
}

export async function updateProfile(
  token: string,
  data: { name?: string; phone?: string },
): Promise<AuthUser> {
  if (!useApi) return mockUser(data.name ?? "Customer", null, data.phone ?? null);
  const res = await apiSend<{ user: AuthUser }>("PUT", "/user/profile", data, { token });
  return res.user;
}

export async function changePassword(
  token: string,
  current_password: string,
  password: string,
  password_confirmation: string,
): Promise<string> {
  if (!useApi) return "Password updated.";
  const res = await apiSend<{ message: string }>(
    "PUT",
    "/user/password",
    { current_password, password, password_confirmation },
    { token },
  );
  return res.message;
}
