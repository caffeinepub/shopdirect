import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
}: HeroSectionProps) {
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-br from-white to-background py-12 md:py-16 overflow-hidden">
      <div className="max-w-[960px] mx-auto px-6">
        <div className="max-w-2xl">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for products…"
              className="w-full rounded-full py-2.5 pl-5 pr-12 text-sm border border-border bg-white text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
              data-ocid="search.search_input"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight mb-4">
            Discover
            <span className="block text-teal">Amazing</span>
            Products
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
            Shop premium electronics, fashion, and home essentials — all in one
            place, with fast delivery and unbeatable prices.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              onClick={scrollToProducts}
              size="lg"
              className="bg-navy-cta hover:bg-navy-dark text-white rounded-full px-8 font-semibold shadow-md transition-all hover:shadow-lg"
              data-ocid="hero.primary_button"
            >
              Shop Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("categories")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-primary font-semibold underline-offset-2 hover:underline"
              data-ocid="hero.secondary_button"
            >
              Browse Categories
            </button>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-teal" />
              Free shipping over $50
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-teal" />
              30-day returns
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
