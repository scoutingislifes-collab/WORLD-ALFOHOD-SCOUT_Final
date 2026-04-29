import { useEffect, useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
  PanInfo,
} from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Carousel3DItem = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
};

interface CardProps {
  item: Carousel3DItem;
  angle: number;
  base: MotionValue<number>;
  cardWidth: number;
  radius: number;
  onClick: () => void;
}

function Card3D({ item, angle, base, cardWidth, radius, onClick }: CardProps) {
  const rotateY = useTransform(base, v => ((v + angle) * 180) / Math.PI);
  const translateZ = useTransform(base, v => Math.cos(v + angle) * radius - radius);
  const opacity = useTransform(base, v => 0.35 + Math.max(0, Math.cos(v + angle)) * 0.65);
  const zIndex = useTransform(base, v => Math.round(Math.cos(v + angle) * 100));
  const isGradient = item.image.startsWith("linear-gradient");

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        width: cardWidth,
        height: cardWidth * 1.4,
        marginLeft: -cardWidth / 2,
        marginTop: -(cardWidth * 1.4) / 2,
        transformStyle: "preserve-3d",
        rotateY,
        translateZ,
        opacity,
        zIndex,
      }}
      onClick={onClick}
    >
      <Link href={item.href} className="block w-full h-full">
        <div
          className="relative w-full h-full rounded-xl overflow-hidden border border-[#D4AF37]/40"
          style={{
            boxShadow:
              "0 30px 60px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.2)",
          }}
        >
          {isGradient ? (
            <div className="absolute inset-0" style={{ background: item.image }} />
          ) : (
            <img loading="lazy" decoding="async"
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          )}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
            {item.subtitle && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                {item.subtitle}
              </span>
            )}
            <h3 className="text-sm font-bold text-white line-clamp-2 mt-1">
              {item.title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface Props {
  title?: string;
  items: Carousel3DItem[];
  cardWidth?: number;
  radius?: number;
}

export function Carousel3D({ title, items, cardWidth = 220, radius = 380 }: Props) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const baseRotation = useMotionValue(0);

  const step = items.length > 0 ? (2 * Math.PI) / items.length : 0;

  useEffect(() => {
    if (!items.length) return;
    const target = -active * step;
    const controls = animate(baseRotation, target, {
      type: "spring",
      stiffness: 60,
      damping: 18,
    });
    return () => controls.stop();
  }, [active, step, items.length]);

  if (!items.length) return null;

  const next = () => setActive(a => (a + 1) % items.length);
  const prev = () => setActive(a => (a - 1 + items.length) % items.length);

  function onDragEnd(_: any, info: PanInfo) {
    const threshold = 60;
    if (info.offset.x < -threshold) next();
    else if (info.offset.x > threshold) prev();
  }

  return (
    <section className="py-16 bg-[#0a0a0a] text-white" data-testid="carousel-3d">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5E199] to-[#D4AF37] bg-clip-text text-transparent">
              {title}
            </span>
          </h2>
        )}

        <div
          ref={containerRef}
          className="relative h-[420px] md:h-[480px] mx-auto"
          style={{ perspective: 1400 }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ transformStyle: "preserve-3d" }}
          >
            {items.map((item, i) => (
              <Card3D
                key={item.id}
                item={item}
                angle={i * step}
                base={baseRotation}
                cardWidth={cardWidth}
                radius={radius}
                onClick={() => setActive(i)}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={prev}
            className="h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 flex items-center justify-center"
            aria-label="السابق"
            data-testid="button-3d-prev"
          >
            <ChevronRight className="h-5 w-5 text-[#D4AF37]" />
          </button>

          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-10 bg-[#D4AF37]" : "w-2 bg-white/20"
                }`}
                aria-label={`الانتقال للعنصر ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 flex items-center justify-center"
            aria-label="التالي"
            data-testid="button-3d-next"
          >
            <ChevronLeft className="h-5 w-5 text-[#D4AF37]" />
          </button>
        </div>
      </div>
    </section>
  );
}
