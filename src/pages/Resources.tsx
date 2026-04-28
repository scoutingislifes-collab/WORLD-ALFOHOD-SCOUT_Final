import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { FileText, Download, PlayCircle, BookOpen, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const resources = [
  { title: "دليل القائد 2024", type: "دليل", icon: BookOpen, date: "٢٠٢٤" },
  { title: "التقرير السنوي للحركة", type: "تقرير", icon: BarChart, date: "٢٠٢٣" },
  { title: "كيف تنظم مخيماً آمناً؟", type: "كتيب", icon: FileText, date: "٢٠٢٣" },
  { title: "تأثير رسل السلام", type: "إنفوجرافيك", icon: BarChart, date: "٢٠٢٤" },
  { title: "الدليل الإرشادي لحماية البيئة", type: "دليل", icon: BookOpen, date: "٢٠٢٢" },
  { title: "أساسيات الإسعافات الأولية", type: "كتيب", icon: FileText, date: "٢٠٢٤" },
];

export default function Resources() {
  return (
    <SiteLayout>
      <PageHero
        title="الموارد والمكتبة"
        description="مجموعة شاملة من الأدلة، والتقارير، والمواد التعليمية المتاحة للتحميل."
        breadcrumbs={[{ label: "الموارد", href: "/resources" }]}
      />
      
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {["الكل", "دليل", "كتيب", "فيديو", "إنفوجرافيك", "تقرير"].map((filter, i) => (
              <Button key={i} variant={i === 0 ? "default" : "outline"} className={i === 0 ? "bg-primary rounded-full px-6" : "rounded-full px-6"}>
                {filter}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res, i) => {
              const Icon = res.icon;
              return (
                <Card key={i} className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 text-secondary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-bold text-muted-foreground">{res.type}</div>
                        <div className="text-xs text-muted-foreground">{res.date}</div>
                      </div>
                      <h3 className="font-bold text-primary text-lg mb-4 line-clamp-2">{res.title}</h3>
                      <Button variant="ghost" className="text-secondary hover:text-primary hover:bg-secondary/10 p-0 h-auto">
                        تحميل <Download className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
