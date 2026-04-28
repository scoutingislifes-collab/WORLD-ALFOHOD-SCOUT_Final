import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { User, ShieldCheck, HeartHandshake, Briefcase, ArrowLeft } from "lucide-react";

const roles = [
  {
    icon: User,
    slug: "youth",
    title: "يافع",
    description: "انضم إلى مجموعة، تعلم مهارات جديدة، وكن جزءاً من مغامرة كبرى.",
  },
  {
    icon: ShieldCheck,
    slug: "leader",
    title: "قائد",
    description: "قُد المجموعات الشبابية وساهم في صقل شخصيات قادة المستقبل.",
  },
  {
    icon: HeartHandshake,
    slug: "volunteer",
    title: "متطوع",
    description: "شارك بوقتك وخبرتك لدعم الفعاليات والمبادرات المجتمعية.",
  },
  {
    icon: Briefcase,
    slug: "partner",
    title: "شريك",
    description: "ادعم حركتنا مادياً أو لوجستياً لنصل إلى عدد أكبر من الشباب.",
  }
];

export default function GetInvolved() {
  return (
    <SiteLayout>
      <PageHero
        title="انضم إلينا"
        description="هناك مكان للجميع في عالم الفهود. اختر الدور الذي يناسبك وابدأ رحلتك."
        breadcrumbs={[{ label: "انضم إلينا", href: "/get-involved" }]}
      />
      
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer">
                    <Link href="/register">
                      <CardContent className="p-8 md:p-12 text-center">
                        <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-secondary group-hover:text-white transition-colors text-secondary">
                          <Icon className="h-12 w-12" />
                        </div>
                        <h3 className="text-3xl font-black text-primary mb-4">{role.title}</h3>
                        <p className="text-lg text-muted-foreground mb-8">
                          {role.description}
                        </p>
                        <div className="inline-flex items-center text-primary font-bold group-hover:text-secondary transition-colors">
                          اكتشف كيف تنضم
                          <ArrowLeft className="mr-2 h-5 w-5" />
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
