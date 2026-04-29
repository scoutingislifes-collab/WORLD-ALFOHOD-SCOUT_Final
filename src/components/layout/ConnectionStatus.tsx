import { useEffect, useRef, useState } from "react";
import { Wifi, WifiOff, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type Status = "online" | "offline" | "degraded";

const HEALTH_URL = "/api/health";
const POLL_OK_MS = 60_000;
const POLL_FAIL_MS = 5_000;

async function ping(): Promise<boolean> {
  try {
    const res = await fetch(HEALTH_URL, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function ConnectionStatus() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [status, setStatus] = useState<Status>(
    typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline"
  );
  const lastStatusRef = useRef<Status>(status);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function tick() {
      if (cancelled) return;
      const onLine = typeof navigator === "undefined" ? true : navigator.onLine;
      if (!onLine) {
        applyStatus("offline");
        timer = setTimeout(tick, POLL_FAIL_MS);
        return;
      }
      const ok = await ping();
      applyStatus(ok ? "online" : "degraded");
      timer = setTimeout(tick, ok ? POLL_OK_MS : POLL_FAIL_MS);
    }

    function applyStatus(next: Status) {
      const prev = lastStatusRef.current;
      if (prev === next) return;
      lastStatusRef.current = next;
      setStatus(next);

      if (next === "offline") {
        toast({
          title: "أنت غير متصل بالإنترنت",
          description: "سيُعاد المزامنة تلقائياً عند عودة الاتصال.",
          variant: "destructive",
        });
      } else if (next === "degraded") {
        toast({
          title: "الخادم غير مستجيب",
          description: "نحاول إعادة الاتصال…",
          variant: "destructive",
        });
      } else if (prev !== "online") {
        toast({
          title: "تم استعادة الاتصال",
          description: "جارٍ إعادة المزامنة…",
        });
        qc.invalidateQueries();
        qc.resumePausedMutations().catch(() => undefined);
      }
    }

    function onOnline() { tick(); }
    function onOffline() { applyStatus("offline"); }

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    tick();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [toast, qc]);

  if (status === "online") {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-2 left-2 z-30 hidden md:flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400"
        data-testid="status-connection-online"
      >
        <Wifi className="h-3 w-3" />
        <span>متصل</span>
      </div>
    );
  }

  const Icon = status === "offline" ? WifiOff : AlertTriangle;
  const label = status === "offline" ? "غير متصل" : "إعادة الاتصال…";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-3 left-3 z-50 flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5 text-xs font-bold text-white shadow-lg"
      data-testid={`status-connection-${status}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}
