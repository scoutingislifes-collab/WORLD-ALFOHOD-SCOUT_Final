import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import serviceImg from "@/assets/images/service.webp";

const stories = [
  {
    title: "مبادرة الفهود الخضراء تزرع مليون شجرة في أفريقيا",
    category: "البيئة",
    date: "١٥ مايو ٢٠٢٤",
    image: serviceImg,
  },
  {
    title: "تجمع السلام الإقليمي يجمع شباباً من ٢٠ دولة",
    category: "السلام",
    date: "٢ أبريل ٢٠٢٤",
    image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ae?q=80&w=2070&auto=format&fit=crop", // placeholder, but we will use the generated ones ideally or fine to use a mix
  },
  {
    title: "إطلاق منصة التعليم الرقمي لمهارات المستقبل",
    category: "التعليم",
    date: "١٠ مارس ٢٠٢٤",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
  }
];

export function FeaturedStories() {
  return (
    <section id="news" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-primary mb-6"
            >
              قصص من <span className="text-secondary">الميدان</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground font-medium"
            >
              أخبار وإنجازات أبطالنا حول العالم يصنعون أثراً حقيقياً في مجتمعاتهم.
            </motion.p>
          </div>
          <Button variant="ghost" className="text-xl font-bold text-primary hover:text-secondary group">
            عرض كل الأخبار
            <ArrowLeft className="ml-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden border-border/50 group cursor-pointer bg-white hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10" />
                  <img loading="lazy" decoding="async" 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-primary">
                    {story.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="text-sm font-bold text-muted-foreground mb-3">{story.date}</div>
                  <h3 className="text-2xl font-black text-primary leading-tight mb-4 group-hover:text-secondary transition-colors">
                    {story.title}
                  </h3>
                  <div className="flex justify-end">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                      <ArrowUpRight className="h-5 w-5 -scale-x-100" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
