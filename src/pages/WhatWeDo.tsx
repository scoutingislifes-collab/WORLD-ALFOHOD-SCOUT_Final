import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Compass, Heart, Sprout, Shield, Users, Scale } from "lucide-react";

const programmes = [
  { slug: "adventure-education", title: "التعليم من خلال المغامرة", icon: Compass },
  { slug: "messengers-of-peace", title: "السلام والمواطنة", icon: Heart },
  { slug: "earth-tribe", title: "البيئة وقبيلة الأرض", icon: Sprout },
  { slug: "youth-leadership", title: "القيادة الشبابية", icon: Shield },
  { slug: "community-service", title: "الخدمة المجتمعية", icon: Users },
  { slug: "gender-equality", title: "المساواة بين الجنسين", icon: Scale },
];

export default function WhatWeDo() {
  return (
    <SiteLayout>
      <PageHero
        title="ما نقوم به"
        description="برامجنا ومبادراتنا مصممة لتطوير مهارات الشباب وتمكينهم."
        breadcrumbs={[{ label: "ما نقوم به", href: "/what-we-do" }]}
      />
      
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programmes.map((prog, i) => {
              const Icon = prog.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer">
                    <Link href={`/programmes/${prog.slug}`}>
                      <CardContent className="p-8">
                        <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-secondary">
                          <Icon className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">{prog.title}</h3>
                        <div className="inline-flex items-center text-primary font-bold hover:text-secondary transition-colors mt-4">
                          اكتشف البرنامج
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
