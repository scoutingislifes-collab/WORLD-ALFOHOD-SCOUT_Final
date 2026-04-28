import { useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter } from "lucide-react";
import { ArticleCard } from "@/components/news/ArticleCard";
import { EventCard } from "@/components/events/EventCard";
import { ProductCard } from "@/components/store/ProductCard";
import { news } from "@/data/news";
import { events } from "@/data/events";
import { products } from "@/data/products";

export default function Search() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredNews = news.filter(n => n.title.includes(query) || n.content.includes(query));
  const filteredEvents = events.filter(e => e.title.includes(query) || e.description.includes(query));
  const filteredProducts = products.filter(p => p.name.includes(query) || p.description.includes(query));

  const hasResults = query && (filteredNews.length > 0 || filteredEvents.length > 0 || filteredProducts.length > 0);

  return (
    <SiteLayout>
      <PageHero
        title="البحث"
        description="ابحث في جميع محتويات عالم الفهود الكشفي والإرشادي."
        breadcrumbs={[{ label: "البحث", href: "/search" }]}
      />
      
      <section className="py-20 bg-muted/10 min-h-[50vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          
          <div className="flex flex-col md:flex-row gap-4 mb-12 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6" />
              <Input 
                type="text" 
                placeholder="عن ماذا تبحث؟" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-4 pr-14 h-16 rounded-full text-xl border-primary/20 focus-visible:ring-primary shadow-lg"
              />
            </div>
            <Button className="h-16 px-8 rounded-full text-lg font-bold bg-secondary hover:bg-secondary/90">
              بحث
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { id: "all", label: "الكل" },
              { id: "news", label: "الأخبار" },
              { id: "events", label: "الفعاليات" },
              { id: "store", label: "المتجر" }
            ].map((f) => (
              <Button 
                key={f.id}
                variant={filter === f.id ? "default" : "outline"} 
                className={`rounded-full px-6 font-bold ${filter === f.id ? "bg-primary text-white" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          {query === "" ? (
            <div className="text-center text-muted-foreground text-xl font-bold py-20">
              أدخل كلمة للبحث...
            </div>
          ) : !hasResults ? (
            <div className="text-center text-muted-foreground text-xl font-bold py-20">
              لا توجد نتائج مطابقة لبحثك عن "{query}"
            </div>
          ) : (
            <div className="space-y-16">
              
              {(filter === "all" || filter === "news") && filteredNews.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black text-primary mb-8 border-b border-border pb-4">الأخبار ({filteredNews.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>
              )}

              {(filter === "all" || filter === "events") && filteredEvents.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black text-primary mb-8 border-b border-border pb-4">الفعاليات ({filteredEvents.length})</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )}

              {(filter === "all" || filter === "store") && filteredProducts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black text-primary mb-8 border-b border-border pb-4">المتجر ({filteredProducts.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
          
        </div>
      </section>
    </SiteLayout>
  );
}
