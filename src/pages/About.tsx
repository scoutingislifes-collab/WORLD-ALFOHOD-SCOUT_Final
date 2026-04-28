import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import aboutHeroImg from "@/assets/images/about-hero.png";

const leaders = [
  { name: "سارة النعيمي", role: "الأمين العام", initials: "سن" },
  { name: "أحمد بن علي", role: "المدير التنفيذي", initials: "أع" },
  { name: "ليلى محمود", role: "مديرة البرامج", initials: "لم" },
  { name: "كريم يوسف", role: "مدير العمليات", initials: "كي" },
  { name: "نورة سعيد", role: "مديرة الاتصال", initials: "نس" },
  { name: "عمر الفاروق", role: "المدير المالي", initials: "عف" },
];

export default function About() {
  return (
    <SiteLayout>
      <PageHero
        title="من نحن"
        description="حركة شبابية عالمية تهدف إلى تمكين الشباب وبناء قادة المستقبل."
        image={aboutHeroImg}
        breadcrumbs={[{ label: "من نحن", href: "/about" }]}
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black text-primary mb-6"
            >
              تاريخ <span className="text-secondary">الحركة</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              تأسست عام ١٩٠٧ الكشافة الأصلية وتحولت إلى عالم الفهود الكشفي والإرشادي في مسيرة قرن من الزمان، بهدف واحد: ترك العالم أفضل مما وجدناه.
            </motion.p>
          </div>

          <div className="mb-20">
            <h3 className="text-3xl font-bold text-primary mb-10 text-center">فريق القيادة</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {leaders.map((leader, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 mx-auto rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-lg">
                    {leader.initials}
                  </div>
                  <h4 className="text-lg font-bold text-primary">{leader.name}</h4>
                  <p className="text-muted-foreground text-sm">{leader.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-muted/30 rounded-3xl p-8 md:p-12 mb-20 text-center">
            <h3 className="text-3xl font-bold text-primary mb-6">التقارير السنوية</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              نلتزم بالشفافية الكاملة في جميع أعمالنا. اقرأ تقاريرنا السنوية لمعرفة المزيد عن تأثيرنا المالي والمجتمعي.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 rounded-full font-bold">
                تقرير ٢٠٢٣ <Download className="mr-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full font-bold">
                تقرير ٢٠٢٢ <Download className="mr-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
