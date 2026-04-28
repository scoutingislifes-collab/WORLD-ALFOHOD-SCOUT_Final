import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trophy, Check, Crown } from "lucide-react";
import { recordScore, getSavedName, getRank, GAME_METAS } from "@/lib/gamesLeaderboard";

type Props = {
  gameId: string;
  score: number;
  detail?: string;
  onSaved?: () => void;
};

export function ScoreSavePrompt({ gameId, score, detail, onSaved }: Props) {
  const meta = GAME_METAS[gameId];
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    setName(getSavedName());
  }, []);

  if (!meta) return null;

  const save = () => {
    const finalName = name.trim() || "لاعب مجهول";
    recordScore(gameId, finalName, score, detail);
    setRank(getRank(gameId, score));
    setSaved(true);
    onSaved?.();
  };

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-secondary/10 border border-secondary/30 rounded-2xl p-4 text-center"
        data-testid={`score-saved-${gameId}`}
      >
        <div className="flex items-center justify-center gap-2 text-secondary font-black mb-1">
          <Crown className="h-5 w-5" />
          {rank && rank <= 3 ? `🎉 المرتبة #${rank} في القائمة!` : `تم حفظ نتيجتك — المرتبة #${rank}`}
        </div>
        <p className="text-xs text-muted-foreground">يمكنك رؤية نتيجتك في لوحة الصدارة</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-muted/40 border border-border rounded-2xl p-4"
      data-testid={`score-prompt-${gameId}`}
    >
      <div className="flex items-center gap-2 text-primary font-black mb-3">
        <Trophy className="h-4 w-4 text-secondary" /> سجّل نتيجتك في لوحة الصدارة
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && save()}
          placeholder="اسمك..."
          maxLength={20}
          className="flex-1 border-2 border-border rounded-xl px-4 py-2.5 text-right font-bold text-primary focus:border-primary outline-none"
          data-testid={`input-player-name-${gameId}`}
        />
        <Button
          onClick={save}
          className="bg-secondary text-white rounded-xl font-bold gap-1"
          data-testid={`button-save-score-${gameId}`}
        >
          <Check className="h-4 w-4" /> حفظ
        </Button>
      </div>
    </motion.div>
  );
}
