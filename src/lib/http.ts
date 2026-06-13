// ─────────────────────────────────────────────────────────────────────────────
// HTTP CLIENT
// Thin fetch wrapper around the Laravel API. When NEXT_PUBLIC_API_URL is unset,
// `useApi` is false and the data layer (lib/api.ts) serves mock data instead —
// so the storefront runs standalone during development and switches to the live
// API the moment the env var is configured. No component changes required.
// ─────────────────────────────────────────────────────────────────────────────

export const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
export const useApi = API_URL.length > 0;

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, params?: Query): string {
  const url = new URL(API_URL + (path.startsWith("/") ? path : `/${path}`));
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(
      json?.message ?? `Request failed (${res.status})`,
      res.status,
      json?.errors,
    );
  }
  return json as T;
}

/** GET. `revalidate` (seconds) enables Next ISR caching for Server Components. */
export async function apiGet<T>(
  path: string,
  opts: { params?: Query; revalidate?: number; token?: string } = {},
): Promise<T> {
  const res = await fetch(buildUrl(path, opts.params), {
    headers: {
      Accept: "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    ...(opts.revalidate !== undefined
      ? { next: { revalidate: opts.revalidate } }
      : { cache: "no-store" }),
  });
  return parse<T>(res);
}

/** POST/PUT/PATCH/DELETE with JSON body. */
export async function apiSend<T>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  opts: { token?: string; sessionId?: string } = {},
): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      ...(opts.sessionId ? { "X-Cart-Session": opts.sessionId } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  return parse<T>(res);
}
