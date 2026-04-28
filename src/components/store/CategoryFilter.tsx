import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={selectedCategory === "all" ? "default" : "ghost"}
        className={`justify-start font-bold h-12 px-6 rounded-xl ${
          selectedCategory === "all" 
            ? "bg-primary text-white hover:bg-primary/90" 
            : "hover:bg-muted text-muted-foreground hover:text-primary"
        }`}
        onClick={() => onSelectCategory("all")}
      >
        الكل
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "ghost"}
          className={`justify-start font-bold h-12 px-6 rounded-xl ${
            selectedCategory === category
              ? "bg-primary text-white hover:bg-primary/90" 
              : "hover:bg-muted text-muted-foreground hover:text-primary"
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
