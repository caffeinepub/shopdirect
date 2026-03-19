import { useEffect, useRef, useState } from "react";
import CartSidebar from "../components/CartSidebar";
import CategorySection from "../components/CategorySection";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import OrderModal from "../components/OrderModal";
import ProductGrid from "../components/ProductGrid";
import StorefrontHeader from "../components/StorefrontHeader";
import {
  useGetAllCategories,
  useGetAllProducts,
  useSeedData,
} from "../hooks/useQueries";

export default function StorefrontPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<bigint | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const seeded = useRef(false);

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetAllCategories();
  const { data: products = [], isLoading: productsLoading } =
    useGetAllProducts();
  const seedData = useSeedData();

  useEffect(() => {
    if (
      !categoriesLoading &&
      !productsLoading &&
      categories.length === 0 &&
      !seeded.current
    ) {
      seeded.current = true;
      seedData.mutate();
    }
  }, [categoriesLoading, productsLoading, categories.length, seedData]);

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categories={categories}
      />

      <main>
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {!categoriesLoading && categories.length > 0 && (
          <CategorySection
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        )}
        <ProductGrid
          products={products}
          categories={categories}
          isLoading={productsLoading || seedData.isPending}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
        />
      </main>

      <Footer />

      <CartSidebar onOrderNow={() => setOrderModalOpen(true)} />
      <OrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  );
}
