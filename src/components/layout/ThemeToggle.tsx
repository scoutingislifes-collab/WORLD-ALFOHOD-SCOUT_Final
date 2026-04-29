import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  className?: string;
  size?: "icon" | "sm";
}

export function ThemeToggle({ className = "", size = "icon" }: Props) {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size={size === "icon" ? "icon" : "sm"}
      onClick={toggle}
      className={`text-primary hover:text-secondary ${className}`}
      aria-label={t("nav.toggleTheme", isDark ? "Switch to light mode" : "Switch to dark mode")}
      title={isDark ? t("nav.lightMode", "Light mode") : t("nav.darkMode", "Dark mode")}
      data-testid="button-theme-toggle"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
