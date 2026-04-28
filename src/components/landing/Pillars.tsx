import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Compass, Users, Heart, Sprout, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  {
    icon: <Compass className="h-10 w-10 text-secondary" />,
    title: "التعليم والمهارات",
    description: "تطوير مهارات حياتية عملية من خلال التعلم بالممارسة والمغامرات في الطبيعة.",
    href: "/academy",
  },
  {
    icon: <Heart className="h-10 w-10 text-secondary" />,
    title: "السلام والتعايش",
    description: "بناء جسور التواصل بين الثقافات وتعزيز التفاهم المتبادل بين شعوب العالم.",
    href: "/programmes/messengers-of-peace",
  },
  {
    icon: <Sprout className="h-10 w-10 text-secondary" />,
    title: "حماية البيئة",
    description: "قيادة مبادرات الاستدامة والمحافظة على كوكب الأرض للأجيال القادمة.",
    href: "/programmes/earth-tribe",
  },
  {
    icon: <Shield className="h-10 w-10 text-secondary" />,
    title: "القيادة والتمكين",
    description: "إعداد قادة شباب قادرين على اتخاذ القرارات وصنع التغيير الإيجابي.",
    href: "/programmes/youth-leadership",
  },
  {
    icon: <Users className="h-10 w-10 text-secondary" />,
    title: "الخدمة المجتمعية",
    description: "المساهمة الفاعلة في تنمية المجتمعات المحلية ودعم الفئات الأكثر حاجة.",
    href: "/get-involved",
  }
];

export function Pillars() {
  return (
    <section id="what-we-do" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-primary mb-6"
          >
            ركائز <span className="text-secondary">الحركة</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-medium"
          >
            نعمل على تمكين الشباب من خلال خمس ركائز أساسية تبني شخصياتهم وتعدهم للمستقبل
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={index === 4 ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-white overflow-hidden group">
                <CardContent className="p-8">
                  <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">{pillar.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center text-secondary font-bold text-lg hover:text-primary transition-colors"
                    data-testid={`link-pillar-${index}`}
                  >
                    اقرأ المزيد
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
