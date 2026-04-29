import { ReactNode } from "react";
import { Tag, Sparkles, Bell, Video, BookOpen } from "lucide-react";

export type TickerItem = {
  id: string;
  text: string;
  icon?: "tag" | "sparkles" | "bell" | "youtube" | "book";
};

const ICONS: Record<NonNullable<TickerItem["icon"]>, ReactNode> = {
  tag: <Tag className="h-4 w-4" />,
  sparkles: <Sparkles className="h-4 w-4" />,
  bell: <Bell className="h-4 w-4" />,
  youtube: <Video className="h-4 w-4" />,
  book: <BookOpen className="h-4 w-4" />,
};

interface Props {
  items: TickerItem[];
  speedSec?: number;
  variant?: "gold" | "dark";
}

export function OffersTicker({ items, speedSec = 40, variant = "gold" }: Props) {
  if (!items.length) return null;
  // Duplicate for seamless loop
  const loop = [...items, ...items];

  const styles =
    variant === "gold"
      ? "bg-gradient-to-r from-[#1a1408] via-[#3a2810] to-[#1a1408] text-[#F5E199] border-y border-[#D4AF37]/30"
      : "bg-[#0a0a0a] text-white/90 border-y border-white/10";

  return (
    <div
      className={`relative overflow-hidden py-3 ${styles}`}
      data-testid="ticker-offers"
    >
      <div
        className="flex gap-12 whitespace-nowrap will-change-transform animate-[ticker-scroll_var(--dur)_linear_infinite] hover:[animation-play-state:paused]"
        style={{ ["--dur" as any]: `${speedSec}s` }}
      >
        {loop.map((it, i) => (
          <span
            key={`${it.id}-${i}`}
            className="inline-flex items-center gap-3 text-sm md:text-base font-bold"
          >
            <span className="text-[#D4AF37]">{ICONS[it.icon || "sparkles"]}</span>
            <span>{it.text}</span>
            <span className="text-[#D4AF37]/60">•</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
