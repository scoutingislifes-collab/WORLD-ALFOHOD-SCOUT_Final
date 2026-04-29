import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Article } from "@/data/news";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="h-full overflow-hidden border-border/50 group bg-card hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link href={`/news/${article.slug}`}>
        <div className="relative h-[220px] overflow-hidden cursor-pointer bg-muted/30">
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10" />
          <img loading="lazy" decoding="async" 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
            <Badge variant="secondary" className="bg-white/90 hover:bg-white text-primary border-none shadow-sm font-bold rounded-sm">
              {article.category}
            </Badge>
            {article.breaking && (
              <Badge variant="destructive" className="animate-pulse shadow-sm font-bold rounded-sm">
                عاجل
              </Badge>
            )}
            {article.featured && (
              <Badge className="bg-accent hover:bg-accent text-accent-foreground border-none shadow-sm font-bold rounded-sm">
                مميز
              </Badge>
            )}
          </div>
        </div>
      </Link>
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="text-xs font-bold text-secondary uppercase mb-2 tracking-wider">{article.category}</div>
        <Link href={`/news/${article.slug}`}>
          <h3 className="text-xl font-black text-primary leading-tight mb-3 group-hover:text-secondary transition-colors cursor-pointer line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-2 mb-6 flex-1 text-sm">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded text-white flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: article.author.avatarColor }}
            >
              {article.author.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-none">{article.author.name}</span>
              <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                {article.date} <span className="w-1 h-1 rounded bg-muted-foreground/50 inline-block"></span> {article.readTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
            <Eye className="w-3 h-3" />
            {article.views.toLocaleString('ar-EG')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
