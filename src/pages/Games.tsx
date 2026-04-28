import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trophy, RotateCcw, Star, Zap, Brain, Target, Puzzle, Users, ChevronLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { ScoreSavePrompt } from "@/components/games/ScoreSavePrompt";
import { LeaderboardPanel } from "@/components/games/LeaderboardPanel";

// ─── Scout Trivia ───────────────────────────────────────────────────────────
const TRIVIA = [
  { q: "ما شعار الكشافة العالمي؟", choices: ["كن مستعداً", "افعل الخير", "أنا أستطيع", "معاً نبني"], answer: 0 },
  { q: "من هو مؤسس حركة الكشافة العالمية؟", choices: ["نيلسون مانديلا", "روبرت بادن باول", "ونستون تشرشل", "غاندي"], answer: 1 },
  { q: "في أي عام تأسست الكشافة؟", choices: ["1890", "1907", "1920", "1945"], answer: 1 },
  { q: "ما معنى كلمة SCOUT بالإنجليزية؟", choices: ["المغامر", "الرائد", "الشجاع", "الخبير"], answer: 1 },
  { q: "كم يوماً يستمر الجمبوري العالمي عادةً؟", choices: ["5 أيام", "10 أيام", "12 يوم", "3 أسابيع"], answer: 2 },
  { q: "ما رمز الكشافة الشهير؟", choices: ["النسر", "الأسد", "زهرة الزنبق", "النجمة"], answer: 2 },
  { q: "ما أول شيء يتعلمه الكشاف في البرية؟", choices: ["الطبخ", "إشعال النار", "بناء الخيمة", "قراءة الخريطة"], answer: 1 },
  { q: "كم عدد الأركان الأساسية للوعد الكشفي؟", choices: ["2", "3", "5", "7"], answer: 1 },
];

function ScoutTrivia() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const pick = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    const correct = i === TRIVIA[idx].answer;
    if (correct) {
      setScore(s => s + 1);
      toast({ title: "✅ إجابة صحيحة!", description: "أحسنت! تابع الأسئلة." });
    } else {
      toast({ title: "❌ إجابة خاطئة", description: `الصواب: ${TRIVIA[idx].choices[TRIVIA[idx].answer]}`, variant: "destructive" });
    }
    setTimeout(() => {
      if (idx + 1 >= TRIVIA.length) { setDone(true); }
      else { setIdx(i => i + 1); setChosen(null); }
    }, 1200);
  };

  const restart = () => { setIdx(0); setScore(0); setChosen(null); setDone(false); };

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
      <div className="text-7xl mb-4">{score >= 6 ? "🏆" : score >= 4 ? "🥈" : "🌱"}</div>
      <h3 className="text-3xl font-black text-primary mb-2">انتهت اللعبة!</h3>
      <p className="text-5xl font-black text-secondary mb-1">{score} / {TRIVIA.length}</p>
      <p className="text-muted-foreground mb-8">{score >= 6 ? "خبير كشفي حقيقي! 🎖️" : score >= 4 ? "أداء جيد، واصل التعلم 📚" : "لا بأس، حاول مرة أخرى 💪"}</p>
      <Button onClick={restart} className="bg-primary text-white gap-2 rounded-full px-8"><RotateCcw className="h-4 w-4" /> العب مجدداً</Button>
      <ScoreSavePrompt gameId="trivia" score={score} detail={`${score} / ${TRIVIA.length}`} />
    </motion.div>
  );

  const q = TRIVIA[idx];
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Badge variant="outline" className="text-sm font-bold">سؤال {idx + 1} / {TRIVIA.length}</Badge>
        <div className="flex items-center gap-2 text-secondary font-black"><Star className="h-4 w-4" /> {score} نقطة</div>
      </div>
      <div className="mb-4 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div className="h-2 bg-primary rounded-full" animate={{ width: `${((idx) / TRIVIA.length) * 100}%` }} />
      </div>
      <h3 className="text-xl font-black text-primary mb-6 leading-relaxed">{q.q}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.choices.map((c, i) => {
          let cls = "border-2 border-border hover:border-primary text-right p-4 rounded-xl font-bold transition-all cursor-pointer text-primary";
          if (chosen !== null) {
            if (i === q.answer) cls = "border-2 border-green-500 bg-green-50 text-green-700 text-right p-4 rounded-xl font-bold";
            else if (i === chosen) cls = "border-2 border-red-400 bg-red-50 text-red-600 text-right p-4 rounded-xl font-bold";
            else cls = "border-2 border-border opacity-40 text-right p-4 rounded-xl font-bold text-muted-foreground";
          }
          return (
            <motion.button key={i} onClick={() => pick(i)} className={`w-full ${cls}`} whileHover={chosen === null ? { scale: 1.01 } : {}} whileTap={chosen === null ? { scale: 0.99 } : {}}>
              <span className="text-sm text-muted-foreground ml-2">{["أ", "ب", "ج", "د"][i]}.</span> {c}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Memory Match ─────────────────────────────────────────────────────────
const CARD_PAIRS = ["🦁", "⛺", "🧭", "🪢", "🔥", "🏕️", "🌿", "🦅"];
function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function MemoryGame() {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [checking, setChecking] = useState(false);

  const init = useCallback(() => {
    const deck = shuffle([...CARD_PAIRS, ...CARD_PAIRS]).map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
    setCards(deck); setSelected([]); setMoves(0); setWon(false); setChecking(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  const flip = (id: number) => {
    if (checking || cards[id].flipped || cards[id].matched || selected.length === 2) return;
    const next = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSelected(next);
    if (next.length === 2) {
      setChecking(true);
      setMoves(m => m + 1);
      const [a, b] = [cards[next[0]], cards[next[1]]];
      if (a.emoji === b.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => next.includes(c.id) ? { ...c, matched: true } : c));
          setSelected([]); setChecking(false);
          setCards(prev => { if (prev.every(c => c.matched)) setWon(true); return prev; });
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => next.includes(c.id) ? { ...c, flipped: false } : c));
          setSelected([]); setChecking(false);
        }, 900);
      }
    }
  };

  const allMatched = cards.length > 0 && cards.every(c => c.matched);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm font-bold text-muted-foreground flex items-center gap-2"><Target className="h-4 w-4 text-secondary" /> المحاولات: <span className="text-primary font-black">{moves}</span></div>
        <Button variant="outline" size="sm" onClick={init} className="gap-1 rounded-full"><RotateCcw className="h-3 w-3" /> إعادة</Button>
      </div>
      {allMatched && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center mb-6">
          <div className="text-4xl mb-2">🏆</div>
          <p className="font-black text-green-700 text-lg">رائع! فزت في {moves} محاولة</p>
          <ScoreSavePrompt gameId="memory" score={moves} detail={`${moves} محاولة`} />
        </motion.div>
      )}
      <div className="grid grid-cols-4 gap-3">
        {cards.map(card => (
          <motion.button
            key={card.id}
            onClick={() => flip(card.id)}
            whileTap={{ scale: 0.92 }}
            className={`aspect-square rounded-2xl text-3xl flex items-center justify-center font-bold transition-all border-2 shadow-sm
              ${card.matched ? "bg-green-100 border-green-300 cursor-default" :
                card.flipped ? "bg-primary/10 border-primary" :
                "bg-muted border-border hover:border-primary hover:bg-primary/5 cursor-pointer"}`}
          >
            <AnimatePresence mode="wait">
              {card.flipped || card.matched ? (
                <motion.span key="front" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0 }}>
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span key="back" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} className="text-primary/30">🔒</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Tic-Tac-Toe ──────────────────────────────────────────────────────────
type Cell = "X" | "O" | null;
const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function calcWinner(b: Cell[]): { winner: Cell; line: number[] } | null {
  for (const [a, c, d] of LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { winner: b[a], line: [a, c, d] };
  }
  return null;
}

function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const result = calcWinner(board);
  const draw = !result && board.every(Boolean);

  const click = (i: number) => {
    if (board[i] || result || draw) return;
    const next = [...board]; next[i] = isX ? "X" : "O";
    setBoard(next);
    const r = calcWinner(next);
    if (r) setScores(s => ({ ...s, [r.winner!]: s[r.winner! as "X" | "O"] + 1 }));
    else setIsX(x => !x);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setIsX(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className={`text-center px-4 py-2 rounded-xl font-black ${isX && !result && !draw ? "bg-primary text-white" : "bg-muted text-primary"}`}>
            <div className="text-lg">🦁 ×</div><div className="text-2xl">{scores.X}</div>
          </div>
          <div className={`text-center px-4 py-2 rounded-xl font-black ${!isX && !result && !draw ? "bg-secondary text-white" : "bg-muted text-secondary"}`}>
            <div className="text-lg">🦊 ○</div><div className="text-2xl">{scores.O}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="gap-1 rounded-full"><RotateCcw className="h-3 w-3" /> جولة جديدة</Button>
      </div>

      {(result || draw) && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-3 text-center mb-4 font-black text-lg ${result ? "bg-green-50 border border-green-200 text-green-700" : "bg-amber-50 border border-amber-200 text-amber-700"}`}>
          {result ? `🎉 فاز ${result.winner === "X" ? "🦁 X" : "🦊 O"}!` : "🤝 تعادل!"}
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
        {board.map((cell, i) => {
          const isWinCell = result?.line.includes(i);
          return (
            <motion.button
              key={i}
              onClick={() => click(i)}
              whileTap={!cell && !result ? { scale: 0.9 } : {}}
              className={`aspect-square rounded-2xl text-4xl flex items-center justify-center font-black transition-all border-2
                ${isWinCell ? "bg-green-100 border-green-400" :
                  cell ? "bg-muted border-border cursor-default" :
                  "border-border hover:border-primary hover:bg-primary/5 cursor-pointer"}`}
            >
              {cell === "X" ? "🦁" : cell === "O" ? "🦊" : ""}
            </motion.button>
          );
        })}
      </div>
      {!result && !draw && (
        <p className="text-center mt-4 text-sm font-bold text-muted-foreground">
          دور {isX ? "🦁 X" : "🦊 O"}
        </p>
      )}
    </div>
  );
}

// ─── Number Guessing ────────────────────────────────────────────────────────
function NumberGuess() {
  const [secret, setSecret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [input, setInput] = useState("");
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<"higher" | "lower" | "win" | null>(null);
  const [history, setHistory] = useState<{ n: number; hint: string }[]>([]);
  const MAX = 7;

  const guess = () => {
    const n = parseInt(input);
    if (!n || n < 1 || n > 100) return;
    const t = tries + 1; setTries(t);
    if (n === secret) { setHint("win"); setHistory(h => [{ n, hint: "✅ صح!" }, ...h]); }
    else if (n < secret) { setHint("higher"); setHistory(h => [{ n, hint: "⬆️ أكبر" }, ...h]); }
    else { setHint("lower"); setHistory(h => [{ n, hint: "⬇️ أصغر" }, ...h]); }
    setInput("");
    if (t >= MAX && n !== secret) setHint("lower");
  };

  const restart = () => { setSecret(Math.floor(Math.random() * 100) + 1); setTries(0); setHint(null); setHistory([]); setInput(""); };
  const lost = tries >= MAX && hint !== "win";

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">🎯</div>
        <h3 className="font-black text-primary text-lg">خمّن الرقم من 1 إلى 100</h3>
        <div className="text-sm text-muted-foreground">لديك {MAX} محاولات — تبقّى {Math.max(0, MAX - tries)}</div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden mx-auto max-w-xs">
          <motion.div className="h-2 bg-secondary rounded-full" animate={{ width: `${(tries / MAX) * 100}%` }} />
        </div>
      </div>

      {hint === "win" ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-4">
          <div className="text-6xl mb-3">🏆</div>
          <p className="font-black text-green-700 text-xl">أحسنت! الرقم {secret} في {tries} محاولة</p>
          <Button onClick={restart} className="mt-4 bg-primary text-white rounded-full px-8 gap-2"><RotateCcw className="h-4 w-4" /> جولة جديدة</Button>
          <ScoreSavePrompt gameId="numguess" score={tries} detail={`فاز بـ ${tries} محاولة`} />
        </motion.div>
      ) : lost ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
          <div className="text-5xl mb-3">😢</div>
          <p className="font-black text-red-600 text-xl">الرقم كان {secret}</p>
          <Button onClick={restart} className="mt-4 bg-primary text-white rounded-full px-8 gap-2"><RotateCcw className="h-4 w-4" /> حاول مجدداً</Button>
        </motion.div>
      ) : (
        <>
          {hint && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className={`text-center p-3 rounded-2xl mb-4 font-black text-lg ${hint === "higher" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>
              {hint === "higher" ? "⬆️ الرقم أكبر!" : "⬇️ الرقم أصغر!"}
            </motion.div>
          )}
          <div className="flex gap-2 mb-4">
            <input
              type="number" min={1} max={100} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && guess()}
              placeholder="أدخل رقماً..."
              className="flex-1 border-2 border-border rounded-xl px-4 py-3 text-center text-2xl font-black text-primary focus:border-primary outline-none"
            />
            <Button onClick={guess} className="h-14 px-6 bg-primary text-white rounded-xl text-lg font-bold">خمّن</Button>
          </div>
          {history.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <span key={i} className="bg-muted px-3 py-1 rounded-full text-sm font-bold text-primary">{h.n} {h.hint}</span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Color Memory ────────────────────────────────────────────────────────────
const COLORS = ["#1B6B35", "#D4A017", "#E74C3C", "#3498DB", "#9B59B6", "#E67E22"];
const COLOR_NAMES: Record<string, string> = {
  "#1B6B35": "أخضر", "#D4A017": "ذهبي", "#E74C3C": "أحمر",
  "#3498DB": "أزرق", "#9B59B6": "بنفسجي", "#E67E22": "برتقالي"
};

function ColorMemory() {
  const [seq, setSeq] = useState<string[]>([]);
  const [showing, setShowing] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [playerSeq, setPlayerSeq] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(false);
  const [waiting, setWaiting] = useState(false);

  const startRound = useCallback(async (newSeq: string[]) => {
    setShowing(true); setPlayerSeq([]); setWaiting(false);
    for (const color of newSeq) {
      await new Promise(r => setTimeout(r, 500));
      setActive(color);
      await new Promise(r => setTimeout(r, 600));
      setActive(null);
    }
    await new Promise(r => setTimeout(r, 300));
    setShowing(false); setWaiting(true);
  }, []);

  const start = () => {
    const first = [COLORS[Math.floor(Math.random() * COLORS.length)]];
    setSeq(first); setRound(1); setScore(0); setFailed(false);
    startRound(first);
  };

  const pick = (c: string) => {
    if (showing || !waiting || failed) return;
    const next = [...playerSeq, c];
    setPlayerSeq(next);
    if (next[next.length - 1] !== seq[next.length - 1]) {
      setFailed(true); setWaiting(false); return;
    }
    if (next.length === seq.length) {
      setScore(s => s + 1);
      setTimeout(() => {
        const newSeq = [...seq, COLORS[Math.floor(Math.random() * COLORS.length)]];
        setSeq(newSeq); setRound(r => r + 1);
        startRound(newSeq);
      }, 600);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="font-bold text-muted-foreground">الجولة <span className="text-primary font-black">{round}</span></div>
        <div className="flex items-center gap-1 text-secondary font-black"><Star className="h-4 w-4" /> {score}</div>
      </div>

      {round === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="font-black text-primary text-xl mb-2">لعبة تسلسل الألوان</h3>
          <p className="text-muted-foreground mb-6">احفظ ترتيب الألوان وأعد ضغطها!</p>
          <Button onClick={start} className="bg-primary text-white rounded-full px-10 h-14 text-lg font-bold gap-2"><Zap className="h-5 w-5" /> ابدأ</Button>
        </div>
      ) : (
        <>
          {failed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
              <div className="text-5xl mb-3">💔</div>
              <p className="font-black text-red-600 text-xl mb-1">خسرت!</p>
              <p className="text-muted-foreground mb-6">وصلت للجولة {round} بـ {score} نقطة</p>
              <Button onClick={start} className="bg-primary text-white rounded-full px-8 gap-2"><RotateCcw className="h-4 w-4" /> مجدداً</Button>
              {score > 0 && <ScoreSavePrompt gameId="color" score={score} detail={`وصل للجولة ${round}`} />}
            </motion.div>
          ) : (
            <>
              <p className="text-center text-sm font-bold text-muted-foreground mb-4">
                {showing ? "🔍 احفظ الترتيب..." : waiting ? "👆 اضغط بنفس الترتيب" : "جاهز..."}
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {COLORS.map(c => (
                  <motion.button
                    key={c}
                    onClick={() => pick(c)}
                    animate={active === c ? { scale: 1.2, boxShadow: `0 0 24px ${c}` } : { scale: 1 }}
                    whileTap={!showing && waiting ? { scale: 0.92 } : {}}
                    className="aspect-square rounded-2xl border-4 border-white shadow-md transition-all"
                    style={{ backgroundColor: c }}
                    disabled={showing || !waiting}
                  />
                ))}
              </div>
              <div className="text-center text-xs text-muted-foreground">
                {playerSeq.length} / {seq.length} ضغطة
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ─── Word Scramble ──────────────────────────────────────────────────────────
const SCOUT_WORDS = [
  { word: "كشافة", hint: "حركة شبابية عالمية" },
  { word: "خيمة", hint: "مسكن الكشاف في المخيم" },
  { word: "بوصلة", hint: "أداة الملاحة والاتجاه" },
  { word: "مخيم", hint: "تجمع كشفي في الطبيعة" },
  { word: "شجاعة", hint: "من قيم الكشافة" },
  { word: "زنبق", hint: "رمز الكشافة المشهور" },
];

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  return result === word ? scramble(word) : result;
}

function WordScramble() {
  const [idx, setIdx] = useState(0);
  const [scrambled, setScrambled] = useState(() => scramble(SCOUT_WORDS[0].word));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  const check = () => {
    const correct = input.trim() === SCOUT_WORDS[idx].word;
    setResult(correct ? "correct" : "wrong");
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= SCOUT_WORDS.length) { setDone(true); return; }
      const next = idx + 1;
      setIdx(next); setScrambled(scramble(SCOUT_WORDS[next].word)); setInput(""); setResult(null);
    }, 1000);
  };

  const restart = () => { setIdx(0); setScrambled(scramble(SCOUT_WORDS[0].word)); setInput(""); setScore(0); setResult(null); setDone(false); };

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
      <div className="text-6xl mb-4">🧩</div>
      <h3 className="text-2xl font-black text-primary mb-2">انتهت اللعبة!</h3>
      <p className="text-4xl font-black text-secondary mb-6">{score} / {SCOUT_WORDS.length}</p>
      <Button onClick={restart} className="bg-primary text-white rounded-full px-8 gap-2"><RotateCcw className="h-4 w-4" /> مجدداً</Button>
      <ScoreSavePrompt gameId="word" score={score} detail={`${score} / ${SCOUT_WORDS.length}`} />
    </motion.div>
  );

  const w = SCOUT_WORDS[idx];
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Badge variant="outline">{idx + 1} / {SCOUT_WORDS.length}</Badge>
        <div className="flex items-center gap-1 text-secondary font-black"><Star className="h-4 w-4" /> {score}</div>
      </div>
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-3">رتّب الحروف لتكوين كلمة:</p>
        <div className="flex justify-center gap-2 flex-wrap mb-3">
          {scrambled.split("").map((ch, i) => (
            <span key={i} className="h-12 w-12 bg-primary text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md">
              {ch}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground italic">💡 تلميح: {w.hint}</p>
      </div>
      {result && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`text-center p-3 rounded-2xl mb-4 font-black ${result === "correct" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {result === "correct" ? "✅ صحيح!" : `❌ الإجابة: ${w.word}`}
        </motion.div>
      )}
      <div className="flex gap-2">
        <input
          value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && check()}
          placeholder="اكتب الكلمة..."
          className="flex-1 border-2 border-border rounded-xl px-4 py-3 text-center text-xl font-black text-primary focus:border-primary outline-none"
        />
        <Button onClick={check} className="h-14 px-6 bg-primary text-white rounded-xl font-bold">تحقق</Button>
      </div>
    </div>
  );
}

// ─── Games Registry ─────────────────────────────────────────────────────────
const GAMES = [
  {
    id: "trivia", title: "ثقافة كشفية", emoji: "🧠", category: "كشفية",
    desc: "اختبر معلوماتك الكشفية في 8 أسئلة متنوعة", color: "#1B6B35",
    forKids: false, component: ScoutTrivia,
  },
  {
    id: "memory", title: "الذاكرة الكشفية", emoji: "🃏", category: "كشفية",
    desc: "اعثر على الأزواج المتطابقة من الرموز الكشفية", color: "#2D8A4E",
    forKids: true, component: MemoryGame,
  },
  {
    id: "word", title: "حروف مبعثرة", emoji: "🧩", category: "كشفية",
    desc: "رتّب الحروف لتكوين مصطلحات كشفية", color: "#4CAF50",
    forKids: true, component: WordScramble,
  },
  {
    id: "ttt", title: "إكس أو", emoji: "🎮", category: "عامة",
    desc: "الكلاسيكي الممتع للاعبين في نفس الوقت", color: "#3498DB",
    forKids: true, component: TicTacToe,
  },
  {
    id: "numguess", title: "خمّن الرقم", emoji: "🎯", category: "عامة",
    desc: "خمّن الرقم السري من 1 إلى 100 في 7 محاولات", color: "#E67E22",
    forKids: false, component: NumberGuess,
  },
  {
    id: "color", title: "تسلسل الألوان", emoji: "🎨", category: "عامة",
    desc: "احفظ وأعد ترتيب الألوان — يصعب مع كل جولة!", color: "#9B59B6",
    forKids: true, component: ColorMemory,
  },
];

const CATS = ["الكل", "كشفية", "عامة"];
const AGES = ["الكل", "للأطفال", "للكبار"];

export default function Games() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [cat, setCat] = useState("الكل");
  const [age, setAge] = useState("الكل");

  const filtered = GAMES.filter(g => {
    if (cat !== "الكل" && g.category !== cat) return false;
    if (age === "للأطفال" && !g.forKids) return false;
    if (age === "للكبار" && g.forKids) return false;
    return true;
  });

  const active = GAMES.find(g => g.id === activeGame);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Hero */}
        <div className="relative bg-primary text-white py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {["🎮","🧠","🃏","🎯","🎨","🧩","🏆","⭐"].map((e, i) => (
              <span key={i} className="absolute text-6xl" style={{ top: `${(i * 37) % 80}%`, left: `${(i * 23) % 90}%`, opacity: 0.5 }}>{e}</span>
            ))}
          </div>
          <div className="container mx-auto px-4 md:px-8 relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 mb-6 text-sm font-bold">
                <Zap className="h-4 w-4 text-secondary" /> ألعاب تفاعلية
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                العب و<span className="text-secondary">تعلّم</span>
              </h1>
              <p className="text-xl text-white/80 max-w-2xl font-medium">
                ألعاب كشفية وترفيهية للأطفال والكبار — تعلّم بينما تلعب وتنافس مع أصدقائك.
              </p>
              <div className="flex flex-wrap gap-4 mt-6 text-sm font-bold text-white/70">
                <span className="flex items-center gap-1"><Trophy className="h-4 w-4 text-secondary" /> {GAMES.length} ألعاب متنوعة</span>
                <span className="flex items-center gap-1"><Users className="h-4 w-4 text-secondary" /> للأطفال والكبار</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-secondary" /> كشفية وعامة</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            <div className="flex gap-2">
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${cat === c ? "bg-primary text-white" : "bg-muted text-primary hover:bg-primary/10"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {AGES.map(a => (
                <button key={a} onClick={() => setAge(a)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${age === a ? "bg-secondary text-white" : "bg-muted text-primary hover:bg-secondary/10"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Game cards grid + leaderboard */}
          {!activeGame && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" layout>
                <AnimatePresence>
                  {filtered.map(game => (
                    <motion.div
                      key={game.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-3xl border border-primary/10 shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
                      onClick={() => setActiveGame(game.id)}
                      whileHover={{ y: -4 }}
                      data-testid={`card-game-${game.id}`}
                    >
                      <div className="h-32 flex items-center justify-center text-7xl relative" style={{ backgroundColor: game.color + "20" }}>
                        <motion.span whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>{game.emoji}</motion.span>
                        <div className="absolute top-3 right-3 flex gap-1">
                          <Badge className="text-xs" style={{ backgroundColor: game.color, color: "white" }}>{game.category}</Badge>
                          {game.forKids && <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">أطفال</Badge>}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-black text-primary mb-2">{game.title}</h3>
                        <p className="text-sm text-muted-foreground">{game.desc}</p>
                        <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                          العب الآن <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Leaderboard sidebar */}
              <div className="lg:sticky lg:top-20">
                <LeaderboardPanel />
              </div>
            </div>
          )}

          {/* Active game view */}
          {active && (
            <motion.div key="game-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" onClick={() => setActiveGame(null)} className="gap-2 rounded-full font-bold">
                  <ChevronLeft className="h-4 w-4 rotate-180" /> العودة للألعاب
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{active.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-black text-primary leading-tight">{active.title}</h2>
                    <p className="text-sm text-muted-foreground">{active.desc}</p>
                  </div>
                </div>
              </div>
              <div className="max-w-xl mx-auto bg-white rounded-3xl border border-primary/10 shadow-lg p-8">
                <active.component />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
