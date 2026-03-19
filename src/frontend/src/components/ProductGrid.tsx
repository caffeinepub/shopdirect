import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Category, Product } from "../backend";
import { useCart } from "../context/CartContext";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  activeCategory: bigint | null;
  searchQuery: string;
}

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

function ProductCard({
  product,
  category,
}: { product: Product; category?: Category }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-2xl overflow-hidden shadow-card border border-border flex flex-col"
    >
      <div className="relative bg-muted h-48 overflow-hidden">
        <img
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";
          }}
        />
        {category && (
          <Badge className="absolute top-3 left-3 text-xs bg-white/90 text-foreground border-0 shadow-xs">
            {category.name}
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center gap-1 mb-3">
          {STAR_KEYS.map((key, i) => (
            <Star
              key={key}
              className={`w-3 h-3 fill-current ${i < 4 ? "text-amber-star" : "text-border"}`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={() => addToCart(product)}
            className="bg-navy-cta hover:bg-navy-dark text-white text-xs px-3 py-1.5 h-auto rounded-lg"
            data-ocid="product.add_button"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-8 w-full mt-3" />
      </div>
    </div>
  );
}

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function ProductGrid({
  products,
  categories,
  isLoading,
  activeCategory,
  searchQuery,
}: ProductGridProps) {
  const filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === null || p.categoryId === activeCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCat = (catId: bigint) => categories.find((c) => c.id === catId);

  return (
    <section id="products" className="py-12">
      <div className="max-w-[960px] mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {activeCategory
                ? `Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""} in this category`
                : `${filtered.length} products available`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            data-ocid="products.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <ProductSkeleton key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="products.empty_state"
          >
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            data-ocid="products.list"
          >
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id.toString()}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                data-ocid={`products.item.${idx + 1}`}
              >
                <ProductCard
                  product={product}
                  category={getCat(product.categoryId)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
