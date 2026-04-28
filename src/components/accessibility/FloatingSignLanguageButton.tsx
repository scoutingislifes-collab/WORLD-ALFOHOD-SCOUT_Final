import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility } from "@/context/AccessibilityContext";
import { X, Volume2, HandMetal } from "lucide-react";

const SIGN_WORDS = [
  { word: "مرحباً",    signs: ["👋", "🤚", "✋"] },
  { word: "شكراً",    signs: ["🙏", "👐", "🤲"] },
  { word: "أحبك",     signs: ["🤟", "❤️", "🤟"] },
  { word: "كشافة",    signs: ["✌️", "🖐️", "✌️"] },
  { word: "نعم",      signs: ["👍", "✊", "👍"] },
  { word: "لا",       signs: ["👎", "🚫", "👎"] },
  { word: "مساعدة",  signs: ["🤝", "👐", "🤝"] },
  { word: "ماء",      signs: ["💧", "🌊", "💧"] },
  { word: "طعام",    signs: ["🍽️", "👌", "🍽️"] },
  { word: "خطر",     signs: ["⚠️", "🛑", "⚠️"] },
];

function AnimatedSign({ signs }: { signs: string[] }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f + 1) % signs.length), 600);
    return () => clearInterval(t);
  }, [signs]);
  return (
    <span className="text-3xl transition-all duration-300 inline-block" style={{ minWidth: 40, textAlign: "center" }}>
      {signs[frame]}
    </span>
  );
}

export function FloatingSignLanguageButton() {
  const { mode, setMode, isSignLanguage } = useAccessibility();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const btnRef = useRef<HTMLDivElement>(null);
  const hasDragged = useRef(false);

  // Default position: bottom-left
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sl_btn_pos");
      if (saved) {
        setPos(JSON.parse(saved));
      } else {
        setPos({ x: 24, y: window.innerHeight - 100 });
      }
    } catch {
      setPos({ x: 24, y: window.innerHeight - 100 });
    }
  }, []);

  const savePos = useCallback((p: { x: number; y: number }) => {
    try { localStorage.setItem("sl_btn_pos", JSON.stringify(p)); } catch {}
  }, []);

  // Pointer events for drag (mouse + touch)
  const onPointerDown = (e: React.PointerEvent) => {
    if (!btnRef.current) return;
    e.preventDefault();
    hasDragged.current = false;
    setDragging(true);
    const rect = btnRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    btnRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    hasDragged.current = true;
    const newX = Math.max(0, Math.min(window.innerWidth - 64, e.clientX - dragOffset.current.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 64, e.clientY - dragOffset.current.y));
    const p = { x: newX, y: newY };
    setPos(p);
    savePos(p);
  };

  const onPointerUp = () => {
    setDragging(false);
    if (!hasDragged.current) {
      setOpen(o => !o);
    }
  };

  if (!pos) return null;

  return (
    <>
      {/* Floating button */}
      <div
        ref={btnRef}
        style={{ position: "fixed", left: pos.x, top: pos.y, zIndex: 9999, userSelect: "none", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="cursor-grab active:cursor-grabbing"
      >
        <motion.div
          animate={isSignLanguage ? { scale: [1, 1.08, 1], boxShadow: ["0 0 0 0 rgba(59,130,246,0)", "0 0 0 10px rgba(59,130,246,0.25)", "0 0 0 0 rgba(59,130,246,0)"] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`h-14 w-14 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl border-4 transition-colors
            ${isSignLanguage ? "bg-blue-600 border-blue-300" : "bg-primary border-white"}`}
          title={isSignLanguage ? "وضع الصم مفعّل" : "زر لغة الإشارة"}
        >
          {isSignLanguage ? "🤟" : "👐"}
        </motion.div>
        {isSignLanguage && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none border border-white">
            صم
          </span>
        )}
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sl-panel"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              zIndex: 9998,
              left: Math.min(pos.x, window.innerWidth - 320),
              top: pos.y > window.innerHeight / 2 ? pos.y - 420 : pos.y + 70,
            }}
            className="w-80 bg-white rounded-3xl shadow-2xl border border-primary/10 overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className={`p-4 flex items-center justify-between text-white ${isSignLanguage ? "bg-blue-600" : "bg-primary"}`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤟</span>
                <div>
                  <div className="font-black text-sm">إمكانية الوصول</div>
                  <div className="text-xs opacity-80">لغة الإشارة العربية</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="p-4 border-b border-border">
              <p className="text-xs font-bold text-muted-foreground mb-3">اختر وضع العرض</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("normal")}
                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-1
                    ${mode === "normal" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
                >
                  <Volume2 className="h-5 w-5" />
                  <span>عادي</span>
                </button>
                <button
                  onClick={() => setMode("sign-language")}
                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center gap-1
                    ${mode === "sign-language" ? "border-blue-500 bg-blue-50 text-blue-600" : "border-border text-muted-foreground hover:border-blue-300"}`}
                >
                  <HandMetal className="h-5 w-5" />
                  <span>لغة الإشارة</span>
                </button>
              </div>
              {isSignLanguage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-2 bg-blue-50 rounded-xl text-xs text-blue-700 font-medium text-center">
                  ✅ وضع الصم مفعّل — الإشارات المتحركة نشطة
                </motion.div>
              )}
            </div>

            {/* Animated sign language dictionary */}
            <div className="p-4">
              <p className="text-xs font-bold text-muted-foreground mb-3">قاموس الإشارات المتحركة</p>
              <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                {SIGN_WORDS.map(({ word, signs }) => (
                  <div key={word} className="bg-muted/40 rounded-xl p-3 text-center hover:bg-muted/70 transition-colors">
                    <AnimatedSign signs={signs} />
                    <div className="text-xs font-black text-primary mt-1">{word}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drag hint */}
            <div className="px-4 pb-3 text-center text-[10px] text-muted-foreground">
              اسحب الزر لتحريكه في أي مكان على الشاشة
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign language overlay bar when mode is active */}
      <AnimatePresence>
        {isSignLanguage && !open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9990 }}
            className="bg-blue-600 text-white py-2 px-4"
            dir="rtl"
          >
            <div className="flex items-center justify-between max-w-screen-lg mx-auto">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                {SIGN_WORDS.slice(0, 6).map(({ word, signs }) => (
                  <div key={word} className="flex items-center gap-1 shrink-0">
                    <AnimatedSign signs={signs} />
                    <span className="text-xs font-bold opacity-80">{word}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0 mr-4">
                <span className="text-xs font-black opacity-90 hidden sm:block">وضع الصم مفعّل</span>
                <button
                  onClick={() => setMode("normal")}
                  className="text-xs bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 font-bold transition-colors"
                >
                  إيقاف
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
