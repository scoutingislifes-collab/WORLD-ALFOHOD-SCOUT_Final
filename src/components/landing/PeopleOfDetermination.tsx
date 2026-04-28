import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, HandMetal, Eye, Ear, Users, CheckCircle } from "lucide-react";

const features = [
  {
    icon: HandMetal,
    title: "لغة الإشارة",
    desc: "جميع برامجنا مدعومة بمترجمي لغة الإشارة المعتمدين، لضمان وصول كامل للصم وضعاف السمع.",
  },
  {
    icon: Eye,
    title: "إمكانية الوصول البصري",
    desc: "محتوى رقمي متوافق مع قارئات الشاشة، وإضاءة مناسبة في جميع الأنشطة الميدانية.",
  },
  {
    icon: Ear,
    title: "دعم السمع",
    desc: "أجهزة تضخيم الصوت وأنظمة FM متاحة في جميع فعالياتنا ومخيماتنا.",
  },
  {
    icon: Users,
    title: "فرق متخصصة",
    desc: "قادة مدربون تدريباً خاصاً لدعم ذوي الهمم وتمكينهم من تحقيق إمكاناتهم الكاملة.",
  },
];

const signLanguageWords = [
  { ar: "مرحباً", emoji: "👋" },
  { ar: "أحبك", emoji: "🤟" },
  { ar: "نعم", emoji: "👍" },
  { ar: "كشافة", emoji: "✌️" },
  { ar: "أنا بخير", emoji: "👌" },
  { ar: "شكراً", emoji: "🙏" },
];

export function PeopleOfDetermination() {
  return (
    <section className="py-24 relative overflow-hidden bg-white" aria-label="قسم ذوي الهمم">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary/10 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Heart className="h-5 w-5 text-primary fill-primary/30" />
            <span className="font-bold text-primary text-sm tracking-wide">الشمول والتمكين</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-primary mb-6 leading-tight">
            الكشافة لـ<span className="text-secondary">الجميع</span>
            <br />
            <span className="text-3xl md:text-5xl">ذوو الهمم — أبطالنا الحقيقيون</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
            في عالم الفهود الكشفي نؤمن بأن كل شخص — بغض النظر عن قدراته — يستحق تجربة كشفية متكاملة.
            نُصمِّم برامجنا لتكون شاملة ومُمكِّنة لكل فرد.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="rounded-3xl overflow-hidden shadow-2xl border border-primary/10 mb-16"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Sign Language showcase */}
            <div className="bg-primary p-10 md:p-14 text-white flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                    🤟
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">لغة الإشارة</h3>
                    <p className="text-white/70 font-medium text-sm">تعلّم معنا بالإشارة</p>
                  </div>
                </div>
                <p className="text-white/85 text-lg leading-relaxed mb-10 font-medium">
                  دعنا نتعلم معاً بعض الكلمات الأساسية في لغة الإشارة العربية. لأن التواصل حق للجميع.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {signLanguageWords.map((word) => (
                    <div
                      key={word.ar}
                      className="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-4 text-center cursor-default"
                    >
                      <div className="text-4xl mb-2">{word.emoji}</div>
                      <div className="font-bold text-sm text-white/90">{word.ar}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-white/20">
                <div className="flex items-center gap-3 text-white/80">
                  <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                  <span className="font-medium text-sm">جميع فعالياتنا تشمل مترجمي لغة إشارة معتمدين</span>
                </div>
              </div>
            </div>

            {/* Right: Commitment details */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-10 md:p-14 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-primary mb-4">
                  التزامنا بالشمول الكامل
                </h3>
                <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                  لدينا برامج مخصصة تُراعي الاحتياجات الفردية، ومنهج كشفي مُعدَّل يمنح كل فرد فرصة النمو والتميز.
                </p>
                <div className="space-y-5">
                  {features.map((f, i) => (
                    <motion.div
                      key={f.title}
                      className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-primary/10 hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                    >
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <f.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary mb-1">{f.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-primary/10">
                <Link href="/get-involved">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-full group shadow-lg hover:shadow-xl transition-all">
                    انضم إلى برنامج ذوي الهمم
                    <ArrowLeft className="ml-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { num: "+٢٠٠", label: "كشاف من ذوي الهمم", icon: "🏅" },
            { num: "١٠٠٪", label: "الفعاليات الشاملة", icon: "♿" },
            { num: "+٥٠", label: "مترجم لغة إشارة", icon: "🤟" },
            { num: "+١٥", label: "برنامج مخصص", icon: "📋" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-primary/10 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-black text-primary mb-1">{stat.num}</div>
              <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
