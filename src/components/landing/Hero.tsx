import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import heroImg from "@/assets/images/hero.webp";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply z-10" />
        <img
          src={heroImg}
          alt="شباب الفهود"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
          // @ts-expect-error fetchpriority is a valid HTML attr not yet typed in React
          fetchpriority="high"
        />
      </div>

      <div className="container relative z-20 mx-auto px-4 md:px-8 py-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30 font-bold mb-6">
              حركة شبابية عالمية
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6">
              نصنع <span className="text-secondary">قادة</span> الغد،
              <br />
              لنبني عالماً أفضل.
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-2xl font-medium">
              مجتمع تعليمي تحويلي للشباب في جميع أنحاء العالم. نتحلى بالسرعة، التركيز، الشجاعة، والرشاقة — تماماً كالفهد.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-16 px-8 text-xl font-bold bg-secondary text-white hover:bg-secondary/90 rounded-full group">
                انضم إلى الحركة
                <ArrowLeft className="ml-2 h-6 w-6 group-hover:-translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-8 text-xl font-bold rounded-full border-white/30 hover:bg-white/10 text-white">
                اكتشف المخيم العالمي
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      />
    </section>
  );
}
