import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";
import { motion } from "motion/react";

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
    <section className="bg-gradient-to-br from-white to-background py-12 md:py-20 overflow-hidden">
      <div className="max-w-[960px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
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
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-foreground leading-tight mb-4">
              Discover
              <span className="block text-teal">Amazing</span>
              Products
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed">
              Shop premium electronics, fashion, and home essentials — all in
              one place, with fast delivery and unbeatable prices.
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute w-72 h-72 rounded-full bg-teal/10 -top-8 -right-8" />
            <div className="absolute w-48 h-48 rounded-full bg-badge-blue/10 bottom-0 left-4" />
            <img
              src="/assets/generated/hero-products.dim_600x500.png"
              alt="Featured products"
              className="relative z-10 w-full max-w-lg drop-shadow-xl rounded-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
