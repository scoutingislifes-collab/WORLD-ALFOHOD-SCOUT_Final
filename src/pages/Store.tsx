import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCard } from "@/components/store/ProductCard";
import { CartDrawer } from "@/components/store/CartDrawer";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import storeBannerImg from "@/assets/images/store-banner.png";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Link } from "wouter";

const ITEMS_PER_PAGE = 12;

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "latest":
      default:
        // Assume default order is latest
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const newProducts = products.filter(p => p.tag === "جديد").slice(0, 4);
  const bestSellers = products.filter(p => p.tag === "الأكثر مبيعاً").slice(0, 4);

  // Reset page on filter change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  return (
    <SiteLayout>
      <div className="relative pt-32 pb-20 overflow-hidden bg-primary text-white flex flex-col justify-center min-h-[50vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply z-10" />
          <img
            src={storeBannerImg}
            alt="مجموعة الفهود العالمية"
            className="w-full h-full object-cover object-center opacity-70"
          />
        </div>
        <div className="container relative z-20 mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">مجموعة الفهود العالمية</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8">
              اكتشف أحدث المعدات والملابس والشارات الرسمية للمغامرة القادمة.
            </p>
            <Button size="lg" className="bg-[#F5B041] text-primary hover:bg-[#F5B041]/90 text-lg h-14 px-8 rounded-full font-bold">
              تسوق المجموعة
            </Button>
          </motion.div>
        </div>
      </div>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* Collections Grid */}
          {currentPage === 1 && selectedCategory === "all" && !searchQuery && priceRange[0] === 0 && priceRange[1] >= 100 && (
            <div className="mb-16">
              <h2 className="text-3xl font-black text-primary mb-8 text-center">تسوق حسب المجموعة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {collections.map((c, i) => (
                  <Link key={c.slug} href={`/store/c/${c.slug}`}>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                    >
                      <div className="absolute inset-0 z-10 opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-90" style={{ backgroundColor: c.accent }} />
                      <img src={c.heroImage} alt={c.titleAr} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                        <span className="text-white/80 text-sm font-bold mb-1">{c.subtitleAr}</span>
                        <h3 className="text-2xl font-black text-white mb-2">{c.titleAr}</h3>
                        <div className="flex items-center gap-2 text-white text-sm font-bold opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                          تسوق الآن <ArrowLeft className="h-4 w-4" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Categories */}
          <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide mb-12 border-b border-border/50">
            <Button 
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={`rounded-full px-6 h-12 whitespace-nowrap font-bold ${selectedCategory === "all" ? "bg-secondary text-white hover:bg-secondary/90" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              الكل
            </Button>
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`rounded-full px-6 h-12 whitespace-nowrap font-bold ${selectedCategory === cat ? "bg-secondary text-white hover:bg-secondary/90" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Sidebar Filter */}
            <div className="lg:w-1/4 shrink-0 space-y-8">
              <div className="bg-muted/10 p-6 rounded-2xl border border-border/50 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-primary">تصفية النتائج</h3>
                  <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="space-y-8">
                  {/* Search */}
                  <div className="space-y-3">
                    <Label className="font-bold">بحث</Label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="ابحث عن منتج..." 
                        className="pl-3 pr-10 rounded-xl bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Categories List */}
                  <div className="space-y-3">
                    <Label className="font-bold">الأقسام</Label>
                    <div className="flex flex-col gap-2">
                      <div 
                        className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${selectedCategory === "all" ? "bg-secondary/10 text-secondary font-bold" : "hover:bg-muted"}`}
                        onClick={() => setSelectedCategory("all")}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedCategory === "all" ? "border-secondary bg-secondary text-white" : "border-muted-foreground"}`}>
                          {selectedCategory === "all" && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        الكل
                      </div>
                      {categories.map((cat) => (
                        <div 
                          key={cat}
                          className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${selectedCategory === cat ? "bg-secondary/10 text-secondary font-bold" : "hover:bg-muted"}`}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedCategory === cat ? "border-secondary bg-secondary text-white" : "border-muted-foreground"}`}>
                            {selectedCategory === cat && <div className="w-2 h-2 bg-white rounded-sm" />}
                          </div>
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-bold">السعر</Label>
                      <span className="text-sm font-bold text-secondary" dir="ltr">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider 
                      defaultValue={[0, 100]} 
                      max={200} 
                      step={5} 
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-4"
                    />
                  </div>

                  {/* In Stock */}
                  <div className="flex items-center justify-between pt-2">
                    <Label className="font-bold cursor-pointer" htmlFor="in-stock">متوفر في المخزن فقط</Label>
                    <Switch 
                      id="in-stock" 
                      checked={inStockOnly}
                      onCheckedChange={setInStockOnly}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid Area */}
            <div className="lg:w-3/4">
              
              {/* Highlight Strips (Only show if on page 1 and no search filters applied that would hide them) */}
              {currentPage === 1 && selectedCategory === "all" && !searchQuery && priceRange[0] === 0 && priceRange[1] >= 100 && (
                <div className="space-y-16 mb-16">
                  {newProducts.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-primary">وصل حديثاً</h2>
                        <Link href="/store/c/new-in" className="text-secondary font-bold text-sm hover:underline" data-testid="link-view-all-new">عرض الكل</Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {newProducts.map((p, i) => (
                          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <ProductCard product={p} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                  {bestSellers.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-primary">الأكثر مبيعاً</h2>
                        <Link href="/store" className="text-secondary font-bold text-sm hover:underline" data-testid="link-view-all-best">عرض الكل</Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {bestSellers.map((p, i) => (
                          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <ProductCard product={p} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Grid Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-muted/10 p-4 rounded-xl">
                <p className="text-muted-foreground font-medium">
                  عرض <span className="font-bold text-primary">{paginatedProducts.length}</span> من <span className="font-bold text-primary">{filteredProducts.length}</span> منتج
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground">ترتيب حسب:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] bg-white rounded-lg">
                      <SelectValue placeholder="ترتيب" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">الأحدث</SelectItem>
                      <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
                      <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
                      <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              
              {paginatedProducts.length === 0 && (
                <div className="text-center py-24 bg-muted/10 rounded-2xl border border-dashed border-border/50">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">لم نجد ما تبحث عنه</h3>
                  <p className="text-muted-foreground mb-6">حاول تغيير خيارات البحث أو التصفية.</p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange([0, 100]);
                    setInStockOnly(false);
                  }}>إعادة ضبط التصفية</Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button 
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      className={`h-10 w-10 rounded-full font-bold ${currentPage === i + 1 ? "bg-secondary text-white border-secondary" : ""}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <CartDrawer />
    </SiteLayout>
  );
}
