import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CategoriesTab from "../components/admin/CategoriesTab";
import OrdersTab from "../components/admin/OrdersTab";
import ProductsTab from "../components/admin/ProductsTab";
import {
  useGetAllCategories,
  useGetAllOrders,
  useGetAllProducts,
} from "../hooks/useQueries";

const PIN_KEY = "admin_pin_unlocked";
const CORRECT_PIN = "0852";
const PIN_POSITIONS = [0, 1, 2, 3] as const;

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [digits, setDigits] = useState<string[]>(PIN_POSITIONS.map(() => ""));
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError("");
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const pin = digits.join("");
    if (pin === CORRECT_PIN) {
      sessionStorage.setItem(PIN_KEY, "1");
      onUnlock();
    } else {
      setError("Incorrect PIN");
      setDigits(PIN_POSITIONS.map(() => ""));
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    }
  };

  const handleKeyDown2 = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
  };

  const borderColor = (index: number) => {
    if (error) return "oklch(0.55 0.22 27)";
    if (digits[index]) return "oklch(0.36 0.09 232)";
    return "oklch(0.30 0.04 240)";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div
        className="bg-card rounded-2xl shadow-float p-10 max-w-sm w-full mx-4 text-center"
        onKeyDown={handleKeyDown2}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.20 0.06 240) 0%, oklch(0.36 0.09 232) 100%)",
          }}
        >
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Admin Access
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your 4-digit PIN to continue
        </p>

        <div className="flex gap-3 justify-center mb-4">
          {PIN_POSITIONS.map((pos) => (
            <input
              key={`pin-pos-${pos}`}
              ref={(el) => {
                inputRefs.current[pos] = el;
              }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digits[pos]}
              onChange={(e) => handleChange(pos, e.target.value)}
              onKeyDown={(e) => handleKeyDown(pos, e)}
              data-ocid={`admin.pin_input.${pos + 1}` as string}
              className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 bg-background text-foreground outline-none transition-all focus:border-primary"
              style={{ borderColor: borderColor(pos) }}
            />
          ))}
        </div>

        {error ? (
          <p
            className="text-sm mb-4 font-medium"
            style={{ color: "oklch(0.55 0.22 27)" }}
            data-ocid="admin.pin_error_state"
          >
            {error}
          </p>
        ) : (
          <div className="mb-4 h-5" />
        )}

        <Button
          onClick={handleConfirm}
          className="w-full bg-navy-cta hover:bg-navy-dark text-white rounded-xl h-12 font-semibold mb-4"
          data-ocid="admin.pin_confirm_button"
        >
          Confirm
        </Button>

        <Link
          to="/"
          className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="admin.back_to_store_link"
        >
          ← Back to Store
        </Link>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [pinUnlocked, setPinUnlocked] = useState(
    () => sessionStorage.getItem(PIN_KEY) === "1",
  );

  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();
  const { data: products = [], isLoading: productsLoading } =
    useGetAllProducts();
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetAllCategories();

  if (!pinUnlocked) {
    return <PinGate onUnlock={() => setPinUnlocked(true)} />;
  }

  if (ordersLoading || productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header
        style={{
          background:
            "linear-gradient(135deg, oklch(0.20 0.06 240) 0%, oklch(0.36 0.09 232) 100%)",
        }}
      >
        <div className="max-w-[960px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: "oklch(0.74 0.11 193)" }}
            >
              T
            </div>
            <div>
              <span className="text-white font-bold">Admin Dashboard</span>
              <span className="text-white/50 text-sm ml-2">· Tasty Home</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              ← Storefront
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem(PIN_KEY);
                window.location.reload();
              }}
              className="border-white/30 text-white hover:bg-white/10 rounded-lg"
              data-ocid="admin.logout_button"
            >
              Lock
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-8">
        <Tabs defaultValue="orders" data-ocid="admin.tabs">
          <TabsList className="mb-8 bg-card border border-border shadow-xs">
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-navy-cta data-[state=active]:text-white rounded-lg"
              data-ocid="admin.orders.tab"
            >
              Orders{" "}
              {orders.length > 0 && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({orders.length})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-navy-cta data-[state=active]:text-white rounded-lg"
              data-ocid="admin.products.tab"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-navy-cta data-[state=active]:text-white rounded-lg"
              data-ocid="admin.categories.tab"
            >
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersTab
              orders={orders}
              products={products}
              isLoading={ordersLoading}
            />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab
              products={products}
              categories={categories}
              isLoading={productsLoading}
            />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab
              categories={categories}
              isLoading={categoriesLoading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
