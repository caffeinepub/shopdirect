import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useCreateOrder } from "../hooks/useQueries";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function OrderModal({ open, onClose }: OrderModalProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [success, setSuccess] = useState(false);
  const createOrder = useCreateOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !contactNumber.trim()) return;
    try {
      const productIds = items.flatMap((item) =>
        Array(item.quantity).fill(item.product.id),
      );
      await createOrder.mutateAsync({
        customerName: customerName.trim(),
        contactNumber: contactNumber.trim(),
        productIds,
      });
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      toast.error(err?.message || "Failed to place order. Please try again.");
    }
  };

  const handleClose = () => {
    setCustomerName("");
    setContactNumber("");
    setSuccess(false);
    createOrder.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md" data-ocid="order.dialog">
        {success ? (
          <div className="py-8 text-center" data-ocid="order.success_state">
            <CheckCircle className="w-16 h-16 text-teal mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Order Placed!
            </h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We'll contact you shortly.
            </p>
            <Button
              onClick={handleClose}
              className="bg-navy-cta hover:bg-navy-dark text-white px-8 rounded-xl"
              data-ocid="order.close_button"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <DialogTitle className="text-xl">
                  Complete Your Order
                </DialogTitle>
              </div>
              <DialogDescription>
                {items.length} item{items.length !== 1 ? "s" : ""} · Total: $
                {totalPrice.toFixed(2)}
              </DialogDescription>
            </DialogHeader>

            {/* Order summary */}
            <div className="bg-muted rounded-xl p-3 space-y-2 max-h-36 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.product.id.toString()}
                  className="flex justify-between text-sm"
                >
                  <span className="text-foreground truncate mr-2">
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span className="text-muted-foreground shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-ocid="order.form"
            >
              <div className="space-y-1.5">
                <Label htmlFor="cname">Full Name</Label>
                <Input
                  id="cname"
                  placeholder="e.g. Jane Smith"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  data-ocid="order.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cphone">Contact Number</Label>
                <Input
                  id="cphone"
                  type="tel"
                  placeholder="e.g. +1 555-123-4567"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  data-ocid="order.phone.input"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 rounded-xl"
                  data-ocid="order.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createOrder.isPending ||
                    !customerName.trim() ||
                    !contactNumber.trim()
                  }
                  className="flex-1 bg-navy-cta hover:bg-navy-dark text-white rounded-xl"
                  data-ocid="order.submit_button"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing…
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
