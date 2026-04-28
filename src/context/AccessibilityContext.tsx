import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AccessibilityMode = "normal" | "sign-language";

interface AccessibilityContextType {
  mode: AccessibilityMode;
  setMode: (m: AccessibilityMode) => void;
  isSignLanguage: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AccessibilityMode>(() => {
    try {
      return (localStorage.getItem("accessibility_mode") as AccessibilityMode) || "normal";
    } catch {
      return "normal";
    }
  });

  const setMode = (m: AccessibilityMode) => {
    setModeState(m);
    try { localStorage.setItem("accessibility_mode", m); } catch {}
  };

  return (
    <AccessibilityContext.Provider value={{ mode, setMode, isSignLanguage: mode === "sign-language" }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be inside AccessibilityProvider");
  return ctx;
}
