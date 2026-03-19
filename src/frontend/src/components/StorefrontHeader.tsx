import { Link } from "@tanstack/react-router";
import { ChevronDown, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

interface StorefrontHeaderProps {
  activeCategory: bigint | null;
  onCategoryChange: (id: bigint | null) => void;
  categories: { id: bigint; name: string }[];
}

export default function StorefrontHeader({
  activeCategory,
  onCategoryChange,
  categories,
}: StorefrontHeaderProps) {
  const { totalItems, setIsOpen } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.20 0.06 240) 0%, oklch(0.36 0.09 232) 100%)",
      }}
    >
      <div className="max-w-[960px] mx-auto px-6 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ background: "oklch(0.74 0.11 193)" }}
          >
            T
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Tasty Home
          </span>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative text-white/90 hover:text-white transition-colors p-1"
            data-ocid="cart.toggle"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1"
                style={{
                  background: "oklch(0.61 0.18 252)",
                  minWidth: "1.1rem",
                  minHeight: "1.1rem",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-white/90 hover:text-white transition-colors"
          >
            <User className="w-5 h-5" />
            <ChevronDown className="w-3 h-3" />
          </button>
          <Link
            to="/admin"
            className="border border-white/40 text-white/90 hover:text-white hover:border-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
            data-ocid="admin.link"
          >
            Admin Panel
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[960px] mx-auto px-6 py-2 flex items-center gap-6 text-sm">
          <button
            type="button"
            onClick={() => scrollToSection("products")}
            className="text-white/80 hover:text-white transition-colors font-medium"
            data-ocid="nav.shop.link"
          >
            Shop
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 text-white/80 hover:text-white transition-colors font-medium"
              data-ocid="nav.categories.link"
            >
              Categories <ChevronDown className="w-3 h-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-float py-2 z-50 min-w-[160px]">
                <button
                  type="button"
                  onClick={() => {
                    onCategoryChange(null);
                    setDropdownOpen(false);
                    scrollToSection("products");
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${activeCategory === null ? "font-semibold text-primary" : "text-foreground"}`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id.toString()}
                    type="button"
                    onClick={() => {
                      onCategoryChange(cat.id);
                      setDropdownOpen(false);
                      scrollToSection("products");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${activeCategory === cat.id ? "font-semibold text-primary" : "text-foreground"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("products")}
            className="text-white/80 hover:text-white transition-colors font-medium"
            data-ocid="nav.new_arrivals.link"
          >
            New Arrivals
          </button>
          <button
            type="button"
            className="text-white/80 hover:text-white transition-colors font-medium"
            data-ocid="nav.about.link"
          >
            About Us
          </button>
          <button
            type="button"
            className="text-white/80 hover:text-white transition-colors font-medium"
            data-ocid="nav.contact.link"
          >
            Contact
          </button>
        </div>
      </div>
    </header>
  );
}
