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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category } from "../../backend";
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/useQueries";

interface CategoriesTabProps {
  categories: Category[];
  isLoading: boolean;
}

type FormData = { name: string; description: string };
const SKEL_KEYS = ["sk1", "sk2", "sk3", "sk4"];

export default function CategoriesTab({
  categories,
  isLoading,
}: CategoriesTabProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<FormData>({ name: "", description: "" });

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setFormOpen(true);
  };
  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, ...form });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(form);
        toast.success("Category created");
      }
      setFormOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory.mutateAsync(deleteTarget.id);
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  if (isLoading) {
    return (
      <div className="space-y-3" data-ocid="categories.loading_state">
        {SKEL_KEYS.map((k) => (
          <Skeleton key={k} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div data-ocid="categories.table">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Categories</h2>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-navy-cta hover:bg-navy-dark text-white rounded-xl gap-2"
          data-ocid="categories.add.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="categories.empty_state"
        >
          <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No categories yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat, idx) => (
                <TableRow
                  key={cat.id.toString()}
                  data-ocid={`categories.row.${idx + 1}`}
                >
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {cat.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(cat)}
                        className="rounded-lg"
                        data-ocid={`categories.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(cat)}
                        className="rounded-lg text-destructive hover:text-destructive"
                        data-ocid={`categories.delete_button.${idx + 1}`}
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
        <DialogContent data-ocid="categories.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                required
                placeholder="Category name"
                data-ocid="categories.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Brief description"
                rows={3}
                data-ocid="categories.description.textarea"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                className="flex-1"
                data-ocid="categories.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-navy-cta hover:bg-navy-dark text-white"
                data-ocid="categories.submit_button"
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
        <AlertDialogContent data-ocid="categories.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{deleteTarget?.name}" and may affect products in
              this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="categories.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              data-ocid="categories.delete.confirm_button"
            >
              {deleteCategory.isPending ? (
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
