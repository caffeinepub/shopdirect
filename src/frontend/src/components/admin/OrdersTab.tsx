import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Package } from "lucide-react";
import type { Order, Product } from "../../backend";

interface OrdersTabProps {
  orders: Order[];
  products: Product[];
  isLoading: boolean;
}

const SKEL_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export default function OrdersTab({
  orders,
  products,
  isLoading,
}: OrdersTabProps) {
  const getProductNames = (productIds: bigint[]) => {
    const names = productIds.map((id) => {
      const p = products.find((pr) => pr.id === id);
      return p?.name || `#${id.toString()}`;
    });
    const counts: Record<string, number> = {};
    for (const n of names) {
      counts[n] = (counts[n] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => (count > 1 ? `${name} ×${count}` : name))
      .join(", ");
  };

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="orders.loading_state">
        {SKEL_KEYS.map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div data-ocid="orders.table">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">All Orders</h2>
          <p className="text-sm text-muted-foreground">
            {orders.length} total orders
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" /> Live
        </Badge>
      </div>

      {orders.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="orders.empty_state"
        >
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No orders yet</p>
          <p className="text-sm mt-1">
            Orders will appear here when customers place them
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Products</TableHead>
                <TableHead className="font-semibold">Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow
                  key={order.id.toString()}
                  data-ocid={`orders.row.${idx + 1}`}
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    #{order.id.toString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.customerName}
                  </TableCell>
                  <TableCell>{order.contactNumber}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {getProductNames(order.productIds)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.productIds.length}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
