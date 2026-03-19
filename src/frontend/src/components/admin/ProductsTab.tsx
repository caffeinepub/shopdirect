import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  ImageIcon,
  Loader2,
  Package,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Category, Product } from "../../backend";
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  useUploadProductImage,
} from "../../hooks/useQueries";

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
}

type FormData = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  categoryId: string;
};
const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  categoryId: "",
};
const SKEL_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export default function ProductsTab({
  products,
  categories,
  isLoading,
}: ProductsTabProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const uploadImage = useUploadProductImage();

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      imageUrl: p.imageUrl,
      categoryId: p.categoryId.toString(),
    });
    setFormOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage.mutateAsync(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.message || "Image upload failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number.parseFloat(form.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error("Invalid price");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }
    const categoryId = BigInt(form.categoryId);

    try {
      if (editing) {
        await updateProduct.mutateAsync({
          id: editing.id,
          name: form.name,
          description: form.description,
          price,
          imageUrl: form.imageUrl,
          categoryId,
        });
        toast.success("Product updated");
      } else {
        await createProduct.mutateAsync({
          name: form.name,
          description: form.description,
          price,
          imageUrl: form.imageUrl,
          categoryId,
        });
        toast.success("Product created");
      }
      setFormOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted");
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  const getCatName = (id: bigint) =>
    categories.find((c) => c.id === id)?.name || "Unknown";
  const isPending = createProduct.isPending || updateProduct.isPending;

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="products.loading_state">
        {SKEL_KEYS.map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div data-ocid="products.table">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} products
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-navy-cta hover:bg-navy-dark text-white rounded-xl gap-2"
          data-ocid="products.add.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="products.empty_state"
        >
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No products yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Image</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, idx) => (
                <TableRow
                  key={product.id.toString()}
                  data-ocid={`products.row.${idx + 1}`}
                >
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {product.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCatName(product.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(product)}
                        className="rounded-lg"
                        data-ocid={`products.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(product)}
                        className="rounded-lg text-destructive hover:text-destructive"
                        data-ocid={`products.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg" data-ocid="products.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  placeholder="Product name"
                  data-ocid="products.name.input"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Product description"
                  rows={2}
                  data-ocid="products.description.textarea"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                  placeholder="0.00"
                  data-ocid="products.price.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, categoryId: v }))
                  }
                >
                  <SelectTrigger data-ocid="products.category.select">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, imageUrl: e.target.value }))
                    }
                    placeholder="Paste image URL or upload"
                    className="flex-1"
                    data-ocid="products.imageurl.input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadImage.isPending}
                    className="shrink-0"
                    data-ocid="products.upload_button"
                  >
                    {uploadImage.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                className="flex-1"
                data-ocid="products.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-navy-cta hover:bg-navy-dark text-white"
                data-ocid="products.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                  </>
                ) : editing ? (
                  "Save Changes"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="products.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteTarget?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="products.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              data-ocid="products.delete.confirm_button"
            >
              {deleteProduct.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
