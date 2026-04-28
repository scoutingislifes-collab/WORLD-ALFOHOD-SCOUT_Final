import { motion } from "framer-motion";

const stats = [
  { value: "60 مليون+", label: "فهد ومتطوع" },
  { value: "176", label: "منظمة وطنية" },
  { value: "2.7 مليار+", label: "ساعة خدمة مجتمعية" },
  { value: "16 مليون+", label: "مشروع ومبادرة" },
];

export function Stats() {
  return (
    <section className="py-20 bg-background relative z-30 -mt-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-border/50">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-primary mb-2" dir="ltr">
                {stat.value}
              </div>
              <div className="text-lg md:text-xl font-bold text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
