import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CinematicSlide = {
  id: string;
  badge: "أكثر مبيعاً" | "وصل حديثاً" | "حصري" | "عرض محدود" | string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  accent?: string;
  background?: string;
};

interface Props {
  slides: CinematicSlide[];
  intervalMs?: number;
}

export function CinematicHeroSlider({ slides, intervalMs = 6000 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex(i => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  if (!slides.length) return null;
  const current = slides[index];
  const accent = current.accent || "#D4AF37";

  const isGradient = current.image?.startsWith("linear-gradient");

  return (
    <section
      className="relative overflow-hidden text-white"
      data-testid="hero-cinematic"
      style={{
        background:
          current.background ||
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
      }}
    >
      {/* Animated radial glow */}
      <motion.div
        key={current.id + "-glow"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1.1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${accent}33 0%, transparent 60%)`,
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 md:px-8 py-20 md:py-28 min-h-[520px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="grid md:grid-cols-2 gap-10 items-center w-full"
          >
            {/* Text */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border"
                style={{
                  borderColor: `${accent}80`,
                  background: `${accent}1a`,
                  color: accent,
                }}
                data-testid="badge-hero"
              >
                {current.badge.includes("مبيع") ? (
                  <Flame className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {current.badge}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl font-black leading-tight"
                data-testid="text-hero-title"
              >
                {current.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl"
              >
                {current.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Link href={current.ctaHref}>
                  <Button
                    size="lg"
                    className="text-base font-bold h-14 px-8 rounded-full"
                    style={{ background: accent, color: "#0a0a0a" }}
                    data-testid="button-hero-cta"
                  >
                    {current.ctaLabel}
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* 3D floating element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -25 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
              className="relative flex items-center justify-center"
              style={{ perspective: 1200 }}
            >
              <motion.div
                animate={{ y: [0, -16, 0], rotateZ: [0, 1.5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-[280px] h-[380px] md:w-[340px] md:h-[460px] rounded-2xl overflow-hidden"
                style={{
                  transform: "rotateY(-12deg) rotateX(4deg)",
                  transformStyle: "preserve-3d",
                  boxShadow: `0 30px 60px -10px ${accent}66, 0 18px 36px -18px rgba(0,0,0,0.7)`,
                }}
              >
                {isGradient ? (
                  <div className="absolute inset-0" style={{ background: current.image }} />
                ) : (
                  <img
                    src={current.image}
                    alt={current.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 mix-blend-overlay" />
                <div
                  className="absolute -bottom-1 inset-x-0 h-1/3 pointer-events-none"
                  style={{
                    background: `linear-gradient(to top, ${accent}55, transparent)`,
                  }}
                />
              </motion.div>

              {/* Floating sparkles */}
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 10 + i * 3,
                    height: 10 + i * 3,
                    background: accent,
                    left: `${20 + i * 25}%`,
                    top: `${15 + i * 20}%`,
                    filter: "blur(1px)",
                    opacity: 0.7,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex(i => (i - 1 + slides.length) % slides.length)}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/15 flex items-center justify-center transition-colors"
              aria-label="السابق"
              data-testid="button-hero-prev"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIndex(i => (i + 1) % slides.length)}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/15 flex items-center justify-center transition-colors"
              aria-label="التالي"
              data-testid="button-hero-next"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-10 bg-[var(--ac)]" : "w-3 bg-white/30"
                  }`}
                  style={{ ["--ac" as any]: accent }}
                  aria-label={`الانتقال إلى الشريحة ${i + 1}`}
                  data-testid={`button-hero-dot-${i}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
