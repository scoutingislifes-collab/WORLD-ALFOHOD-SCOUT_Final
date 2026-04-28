import { QueryClient } from "@tanstack/react-query";

async function throwIfNotOk(res: Response) {
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const data = await res.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
}

export async function apiRequest(method: string, url: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  await throwIfNotOk(res);
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

const defaultQueryFn = async ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const url = (queryKey as unknown[]).filter(Boolean).join("/");
  const res = await fetch(url, { credentials: "include" });
  await throwIfNotOk(res);
  return res.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn as any,
      staleTime: 1000 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
