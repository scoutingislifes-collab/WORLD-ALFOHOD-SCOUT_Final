import { QueryClient } from "@tanstack/react-query";

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 400;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function throwIfNotOk(res: Response) {
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const data = await res.clone().json();
      if (data?.error) msg = data.error;
    } catch {
      try {
        const txt = await res.text();
        if (txt) msg = txt;
      } catch {}
    }
    const err = new Error(msg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
}

async function waitForOnline(timeoutMs = 30_000): Promise<void> {
  if (typeof navigator === "undefined" || navigator.onLine) return;
  await new Promise<void>((resolve) => {
    const onUp = () => {
      window.removeEventListener("online", onUp);
      resolve();
    };
    window.addEventListener("online", onUp, { once: true });
    setTimeout(() => {
      window.removeEventListener("online", onUp);
      resolve();
    }, timeoutMs);
  });
}

async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit,
  attempts = MAX_ATTEMPTS,
): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      await waitForOnline();
    }
    try {
      const res = await fetch(input, init);
      if (RETRYABLE_STATUS.has(res.status) && i < attempts - 1) {
        await sleep(BASE_DELAY_MS * 2 ** i + Math.random() * 200);
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        await sleep(BASE_DELAY_MS * 2 ** i + Math.random() * 200);
        continue;
      }
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Network unreachable");
}

export async function apiRequest<T = any>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetchWithRetry(url, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  await throwIfNotOk(res);
  if (res.status === 204) return null as T;
  const ct = res.headers.get("content-type") || "";
  return (ct.includes("application/json") ? await res.json() : await res.text()) as T;
}

const defaultQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const url = (queryKey as unknown[]).filter(Boolean).join("/");
  const res = await fetchWithRetry(url, { credentials: "include" });
  await throwIfNotOk(res);
  return res.json();
};

function smartRetry(failureCount: number, error: unknown) {
  const status = (error as any)?.status;
  if (typeof status === "number" && status >= 400 && status < 500 && status !== 408 && status !== 429) {
    return false;
  }
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn as any,
      staleTime: 1000 * 30,
      retry: smartRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: smartRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      networkMode: "offlineFirst",
    },
  },
});
