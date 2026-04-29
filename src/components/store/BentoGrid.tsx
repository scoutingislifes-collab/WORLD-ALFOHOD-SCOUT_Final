import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export type BentoItem = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  image?: string;
  background?: string;
  accent?: string;
  icon?: ReactNode;
  span?: "default" | "tall" | "wide" | "large";
};

interface Props {
  title?: string;
  items: BentoItem[];
}

const SPAN_CLS: Record<NonNullable<BentoItem["span"]>, string> = {
  default: "md:col-span-2 md:row-span-2",
  tall: "md:col-span-2 md:row-span-4",
  wide: "md:col-span-4 md:row-span-2",
  large: "md:col-span-4 md:row-span-4",
};

export function BentoGrid({ title, items }: Props) {
  return (
    <section className="py-16 bg-[#0a0a0a] text-white" data-testid="section-bento">
      <div className="container mx-auto px-4 md:px-8">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black mb-10 text-center"
          >
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5E199] to-[#D4AF37] bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h2>
        )}

        <div className="grid grid-cols-2 md:grid-cols-8 md:auto-rows-[80px] gap-4">
          {items.map((it, i) => {
            const accent = it.accent || "#D4AF37";
            const spanCls = SPAN_CLS[it.span || "default"];
            const isGradient = it.background?.startsWith("linear-gradient") || it.image?.startsWith("linear-gradient");

            return (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 ${spanCls} min-h-[180px] cursor-pointer`}
                style={{
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.04)`,
                }}
                data-testid={`bento-${it.id}`}
              >
                <Link href={it.href} className="absolute inset-0 z-30" aria-label={it.title} />

                {/* Background */}
                {it.image ? (
                  isGradient ? (
                    <div className="absolute inset-0" style={{ background: it.image }} />
                  ) : (
                    <img
                      src={it.image}
                      alt={it.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        it.background ||
                        `linear-gradient(135deg, ${accent}30 0%, #0a0a0a 70%)`,
                    }}
                  />
                )}

                {/* Dark overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Glow on hover */}
                <div
                  className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${accent}40 0%, transparent 60%)`,
                    filter: "blur(20px)",
                  }}
                />
                {/* Gold border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${accent}80, 0 0 30px ${accent}40`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  {it.icon && (
                    <div
                      className="absolute top-5 right-5 h-11 w-11 rounded-xl flex items-center justify-center border"
                      style={{
                        background: `${accent}1a`,
                        borderColor: `${accent}50`,
                        color: accent,
                      }}
                    >
                      {it.icon}
                    </div>
                  )}
                  {it.subtitle && (
                    <span className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>
                      {it.subtitle}
                    </span>
                  )}
                  <h3 className="text-xl md:text-2xl font-black mb-2 text-white">{it.title}</h3>
                  <span className="inline-flex items-center gap-2 text-sm font-bold opacity-70 group-hover:opacity-100 group-hover:gap-3 transition-all">
                    اكتشف المزيد <ArrowLeft className="h-4 w-4" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
