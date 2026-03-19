import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../context/CartContext";

interface CartSidebarProps {
  onOrderNow: () => void;
}

export default function CartSidebar({ onOrderNow }: CartSidebarProps) {
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-card shadow-float z-50 flex flex-col"
            data-ocid="cart.panel"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-foreground text-lg">Your Cart</h2>
                {totalItems > 0 && (
                  <span
                    className="w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ background: "oklch(0.61 0.18 252)" }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="cart.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-ocid="cart.empty_state"
                >
                  <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Your cart is empty</p>
                  <p className="text-sm mt-1">Add products to get started</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={item.product.id.toString()}
                    className="flex gap-3"
                    data-ocid={`cart.item.${idx + 1}`}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-primary font-bold mt-0.5">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      data-ocid={`cart.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-5 space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-foreground">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onOrderNow();
                  }}
                  className="w-full bg-navy-cta hover:bg-navy-dark text-white font-semibold rounded-xl h-12"
                  data-ocid="cart.order_button"
                >
                  Proceed to Order
                </Button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors text-center"
                  data-ocid="cart.clear_button"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
