import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, ShieldCheck, HeartHandshake, Briefcase } from "lucide-react";

const roles = [
  {
    icon: <User className="h-12 w-12 text-secondary" />,
    title: "يافع",
    description: "انضم إلى مجموعة، تعلم مهارات جديدة، وكن جزءاً من مغامرة كبرى.",
  },
  {
    icon: <ShieldCheck className="h-12 w-12 text-secondary" />,
    title: "قائد",
    description: "قُد المجموعات الشبابية وساهم في صقل شخصيات قادة المستقبل.",
  },
  {
    icon: <HeartHandshake className="h-12 w-12 text-secondary" />,
    title: "متطوع",
    description: "شارك بوقتك وخبرتك لدعم الفعاليات والمبادرات المجتمعية.",
  },
  {
    icon: <Briefcase className="h-12 w-12 text-secondary" />,
    title: "شريك",
    description: "ادعم حركتنا مادياً أو لوجستياً لنصل إلى عدد أكبر من الشباب.",
  }
];

export function JoinSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-primary mb-6"
          >
            كيف يمكنك <span className="text-secondary">المشاركة؟</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-medium"
          >
            هناك مكان للجميع في عالم الفهود. اختر الدور الذي يناسبك وابدأ رحلتك معنا.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-lg text-center hover:-translate-y-2 transition-transform duration-300 bg-white">
                <CardContent className="p-8">
                  <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                    {role.icon}
                  </div>
                  <h3 className="text-3xl font-black text-primary mb-4">{role.title}</h3>
                  <p className="text-muted-foreground text-lg mb-8 h-20">
                    {role.description}
                  </p>
                  <Button asChild className="w-full text-lg font-bold rounded-full h-14 bg-primary hover:bg-primary/90">
                    <Link href="/register">انضم كـ {role.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
