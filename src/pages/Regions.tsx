import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { regions } from "@/data/regions";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import regionsImg from "@/assets/images/regions-abstract.png";

export default function Regions() {
  return (
    <SiteLayout>
      <PageHero
        title="المناطق العالمية"
        description="نعمل في ست مناطق جغرافية لضمان وصول برامجنا إلى كل شاب وشابة حول العالم."
        image={regionsImg}
        breadcrumbs={[{ label: "المناطق", href: "/regions" }]}
      />
      
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regions.map((region, i) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
                  <CardContent className="p-8">
                    <div className="mb-6 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                      <span className="text-6xl font-black text-primary/20 opacity-50 select-none">
                        {region.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-primary mb-4 group-hover:text-secondary transition-colors">
                      {region.name}
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6 line-clamp-2">
                      {region.description}
                    </p>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span dir="ltr">{region.memberCount}</span> دولة عضو
                      </div>
                    </div>
                    <Link href={`/regions/${region.slug}`}>
                      <div className="inline-flex items-center text-primary font-bold hover:text-secondary transition-colors w-full justify-between border-t border-border pt-4 mt-auto">
                        تعرف أكثر
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                          <ArrowLeft className="h-5 w-5" />
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
