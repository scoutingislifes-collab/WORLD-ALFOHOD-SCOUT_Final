import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, Award, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GAME_METAS, getLeaderboard, clearLeaderboard, type LeaderboardEntry } from "@/lib/gamesLeaderboard";

const RANKED_GAMES = ["trivia", "memory", "word", "numguess", "color"];

function rankIcon(i: number) {
  if (i === 0) return <Crown className="h-4 w-4 text-yellow-500" />;
  if (i === 1) return <Medal className="h-4 w-4 text-gray-400" />;
  if (i === 2) return <Award className="h-4 w-4 text-amber-700" />;
  return <span className="text-xs font-bold text-muted-foreground w-4 text-center">#{i + 1}</span>;
}

function rowBg(i: number) {
  if (i === 0) return "bg-gradient-to-l from-yellow-50 to-transparent border-yellow-200";
  if (i === 1) return "bg-gradient-to-l from-gray-50 to-transparent border-gray-200";
  if (i === 2) return "bg-gradient-to-l from-amber-50 to-transparent border-amber-200";
  return "bg-white border-border";
}

export function LeaderboardPanel() {
  const [active, setActive] = useState<string>("trivia");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setData(getLeaderboard(active));
  }, [active, refresh]);

  // Re-read whenever the page becomes visible (so a fresh score appears)
  useEffect(() => {
    const onVis = () => setRefresh(r => r + 1);
    window.addEventListener("focus", onVis);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onVis);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const meta = GAME_METAS[active];

  const handleClear = () => {
    if (window.confirm("هل تريد مسح جميع النتائج لهذه اللعبة؟")) {
      clearLeaderboard(active);
      setRefresh(r => r + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-primary/10 shadow-sm p-6" data-testid="leaderboard-panel">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-secondary" />
          <h3 className="text-xl font-black text-primary">لوحة الصدارة</h3>
        </div>
        {data.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 text-xs h-8"
            data-testid="button-clear-leaderboard"
          >
            <Trash2 className="h-3 w-3" /> مسح
          </Button>
        )}
      </div>

      {/* Game selector tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
        {RANKED_GAMES.map(id => {
          const m = GAME_METAS[id];
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                active === id
                  ? "bg-primary text-white shadow-md"
                  : "bg-muted text-primary hover:bg-primary/10"
              }`}
              data-testid={`tab-leaderboard-${id}`}
            >
              <span className="text-base">{m.emoji}</span> {m.title}
            </button>
          );
        })}
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground mb-3 text-center">
        {meta.higherIsBetter ? "الأعلى أفضل" : "الأقل أفضل"} — أفضل {data.length || 0} نتائج
      </p>

      {/* Entries */}
      {data.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <div className="text-5xl mb-2 opacity-50">🏅</div>
          <p className="font-bold">لا توجد نتائج بعد</p>
          <p className="text-xs mt-1">العب وكن أول من يسجّل!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {data.map((entry, i) => (
              <motion.div
                key={`${active}-${i}-${entry.date}`}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${rowBg(i)}`}
                data-testid={`leaderboard-row-${active}-${i}`}
              >
                <div className="shrink-0 w-6 flex items-center justify-center">{rankIcon(i)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-primary truncate" data-testid={`leaderboard-name-${active}-${i}`}>{entry.name}</div>
                  {entry.detail && <div className="text-[11px] text-muted-foreground truncate">{entry.detail}</div>}
                </div>
                <div className="shrink-0 text-left">
                  <div className="font-black text-secondary text-lg leading-none" data-testid={`leaderboard-score-${active}-${i}`}>
                    {entry.score}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{meta.unit}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
