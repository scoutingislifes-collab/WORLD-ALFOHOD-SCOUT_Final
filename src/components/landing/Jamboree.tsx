import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import jamboreeImg from "@/assets/images/jamboree.webp";

export function Jamboree() {
  return (
    <section id="jamboree" className="py-24 relative overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 z-0">
        <img loading="lazy" decoding="async"
          src={jamboreeImg}
          alt="المخيم العالمي"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/30 font-bold mb-6 text-lg">
              الحدث الأكبر هذا العام
            </span>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              المخيم العالمي <br /> <span className="text-secondary">للفهود ٢٠٢٥</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 text-xl font-bold">
              <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
                <Calendar className="h-6 w-6 text-accent" />
                <span>١٢ - ٢٤ أغسطس ٢٠٢٥</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
                <MapPin className="h-6 w-6 text-accent" />
                <span>طوكيو، اليابان</span>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-12 font-medium max-w-3xl mx-auto">
              انضم إلى أكثر من ٥٠,٠٠٠ شاب وشابة من جميع أنحاء العالم في تجربة استثنائية للاحتفال بالتنوع، بناء الصداقات، وصنع ذكريات تدوم مدى الحياة.
            </p>
            
            <Button size="lg" className="h-16 px-10 text-xl font-bold bg-accent text-primary hover:bg-accent/90 rounded-full group shadow-[0_0_40px_rgba(245,176,65,0.4)] hover:shadow-[0_0_60px_rgba(245,176,65,0.6)] transition-all">
              سجل لحضور المخيم
              <ArrowLeft className="ml-2 h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
