import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { DonationForm } from "@/components/forms/DonationForm";
import donationImg from "@/assets/images/donation-impact.png";
import { motion } from "framer-motion";
import { Heart, Globe, Users } from "lucide-react";

export default function Donate() {
  return (
    <SiteLayout>
      <PageHero
        title="ادعم الحركة"
        description="تبرعك يصنع قادة الغد ويغير مجتمعات بأكملها. كن جزءاً من الأثر."
        image={donationImg}
        breadcrumbs={[{ label: "التبرع", href: "/donate" }]}
      />
      
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-primary mb-6">كيف يساهم تبرعك؟</h2>
                <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                  عندما تتبرع لعالم الفهود الكشفي والإرشادي، فإنك تستثمر في مستقبل الشباب. نحن نضمن أن 90% من كل دولار يتم التبرع به يذهب مباشرة لتمويل البرامج والمبادرات الميدانية.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                      <Users className="h-7 w-7 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">25$ تدرب قائداً شاباً</h3>
                      <p className="text-muted-foreground text-lg">توفر مواد تدريبية متكاملة لشاب ليصبح قائد مجموعة في مجتمعه.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Heart className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">100$ تدعم مشروعاً مجتمعياً</h3>
                      <p className="text-muted-foreground text-lg">تمول مبادرة محلية يقودها الشباب لحل مشكلة في بيئتهم المحيطة.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Globe className="h-7 w-7 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-2">250$ تمنح فرصة عالمية</h3>
                      <p className="text-muted-foreground text-lg">تساعد شاباً من دولة نامية للمشاركة في المخيم العالمي للفهود.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="sticky top-28">
              <DonationForm />
            </div>
            
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h2 className="text-3xl font-black mb-8">شكر خاص لشركائنا</h2>
          <p className="text-xl text-white/80 leading-relaxed mb-12">
            نثمن عالياً دعم المؤسسات والأفراد الذين يشاركوننا رؤيتنا في تمكين الشباب الموهوب وتجهيزه لقيادة المستقبل.
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {/* Logos placeholders */}
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-12 w-32 bg-white/20 rounded-md" />
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
