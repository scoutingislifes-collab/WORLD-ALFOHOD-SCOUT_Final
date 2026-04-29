import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, X, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "alfohod_pwa_dismissed_at";
const DISMISS_TTL_DAYS = 7;

function recentlyDismissed(): boolean {
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  const ageMs = Date.now() - Number(ts);
  return ageMs < DISMISS_TTL_DAYS * 24 * 60 * 60 * 1000;
}

export function PWAInstallPrompt() {
  const { t } = useTranslation();
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (recentlyDismissed()) return;

    const onBefore = (e: Event) => {
      e.preventDefault();
      setEvt(e as BeforeInstallPromptEvent);
      // Defer showing the prompt 8s so it doesn't interrupt first paint
      setTimeout(() => setShow(true), 8000);
    };
    const onInstalled = () => {
      setShow(false);
      setEvt(null);
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    };

    window.addEventListener("beforeinstallprompt", onBefore);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const choice = await evt.userChoice;
    if (choice.outcome === "dismissed") {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
    setShow(false);
    setEvt(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setShow(false);
  };

  if (!show || !evt) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[92vw] max-w-md rounded-2xl border border-secondary/30 bg-card shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in"
      role="dialog"
      aria-label={t("pwa.installTitle", "Install app")}
      data-testid="banner-pwa-install"
    >
      <div className="h-12 w-12 rounded-xl bg-primary text-secondary grid place-items-center shrink-0">
        <PawPrint className="h-6 w-6" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-primary leading-tight">
          {t("pwa.installTitle", "Install WORLD ALFOHOD SCOUT")}
        </div>
        <div className="text-xs text-muted-foreground leading-tight mt-0.5">
          {t("pwa.installBody", "Add to your home screen for the full experience.")}
        </div>
      </div>
      <Button
        size="sm"
        onClick={install}
        className="bg-secondary text-white hover:bg-secondary/90 h-9 rounded-full font-bold shrink-0"
        data-testid="button-pwa-install"
      >
        <Download className="h-4 w-4 me-1.5" />
        {t("pwa.install", "Install")}
      </Button>
      <button
        type="button"
        onClick={dismiss}
        className="h-7 w-7 rounded-full grid place-items-center text-muted-foreground hover:text-primary hover:bg-muted shrink-0"
        aria-label={t("pwa.dismiss", "Dismiss")}
        data-testid="button-pwa-dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
