import { Link } from "wouter";
import { Eye, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Article } from "@/data/news";
import { Badge } from "@/components/ui/badge";

interface ListArticleRowProps {
  article: Article;
}

export function ListArticleRow({ article }: ListArticleRowProps) {
  return (
    <Card className="overflow-hidden border-border/50 group bg-card hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <Link href={`/news/${article.slug}`}>
          <div className="relative w-full md:w-[240px] h-[200px] md:h-full overflow-hidden cursor-pointer bg-muted/30 shrink-0">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10" />
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
              {article.breaking && (
                <Badge variant="destructive" className="animate-pulse shadow-sm font-bold rounded-sm">
                  عاجل
                </Badge>
              )}
            </div>
          </div>
        </Link>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">{article.category}</span>
            {article.featured && (
              <>
                <span className="w-1 h-1 rounded bg-border inline-block"></span>
                <span className="text-xs font-bold text-accent">مميز</span>
              </>
            )}
          </div>
          
          <Link href={`/news/${article.slug}`}>
            <h3 className="text-xl md:text-2xl font-black text-primary leading-tight mb-3 group-hover:text-secondary transition-colors cursor-pointer line-clamp-2">
              {article.title}
            </h3>
          </Link>
          
          <p className="text-muted-foreground line-clamp-2 md:line-clamp-3 mb-6 flex-1 text-sm md:text-base">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded text-white flex items-center justify-center font-bold text-xs shrink-0"
                style={{ backgroundColor: article.author.avatarColor }}
              >
                {article.author.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <span className="text-sm font-bold text-foreground leading-none">{article.author.name}</span>
                <span className="hidden md:inline-block w-1 h-1 rounded bg-muted-foreground/50"></span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {article.date} <span className="w-1 h-1 rounded bg-muted-foreground/50 inline-block"></span> {article.readTime}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1 text-muted-foreground text-xs font-medium">
                <Eye className="w-3 h-3" />
                {article.views.toLocaleString('ar-EG')}
              </div>
              <Link href={`/news/${article.slug}`}>
                <span className="text-secondary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                  اقرأ المزيد <ArrowLeft className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
