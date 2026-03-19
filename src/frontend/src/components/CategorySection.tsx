import { Cpu, Grid, Home, Shirt } from "lucide-react";
import { motion } from "motion/react";
import type { Category } from "../backend";

const CATEGORY_STYLES = [
  {
    bg: "bg-sky-50",
    icon: <Cpu className="w-7 h-7 text-sky-500" />,
    border: "border-sky-100",
  },
  {
    bg: "bg-cyan-50",
    icon: <Shirt className="w-7 h-7 text-cyan-500" />,
    border: "border-cyan-100",
  },
  {
    bg: "bg-emerald-50",
    icon: <Home className="w-7 h-7 text-emerald-500" />,
    border: "border-emerald-100",
  },
  {
    bg: "bg-violet-50",
    icon: <Grid className="w-7 h-7 text-violet-500" />,
    border: "border-violet-100",
  },
];

interface CategorySectionProps {
  categories: Category[];
  activeCategory: bigint | null;
  onCategoryChange: (id: bigint | null) => void;
}

export default function CategorySection({
  categories,
  activeCategory,
  onCategoryChange,
}: CategorySectionProps) {
  const scrollToProducts = () =>
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="categories" className="py-12">
      <div className="max-w-[960px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Find exactly what you're looking for
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onCategoryChange(null);
              scrollToProducts();
            }}
            className="text-primary font-semibold text-sm hover:underline underline-offset-2"
            data-ocid="categories.view_all.button"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {categories.slice(0, 6).map((cat, idx) => {
            const style = CATEGORY_STYLES[idx % CATEGORY_STYLES.length];
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id.toString()}
                type="button"
                whileHover={{
                  y: -3,
                  boxShadow: "0 8px 24px rgba(11,42,68,0.12)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onCategoryChange(isActive ? null : cat.id);
                  scrollToProducts();
                }}
                className={`${style.bg} ${style.border} border-2 rounded-2xl p-6 text-left transition-all cursor-pointer ${isActive ? "ring-2 ring-primary ring-offset-2" : ""}`}
                data-ocid={`categories.item.${idx + 1}`}
              >
                <div className="mb-3">{style.icon}</div>
                <h3 className="font-bold text-foreground text-lg mb-1">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cat.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
