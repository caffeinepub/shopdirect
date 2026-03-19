import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Category, Order, Product } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      contactNumber,
      productIds,
    }: {
      customerName: string;
      contactNumber: string;
      productIds: bigint[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createOrder(customerName, contactNumber, productIds);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: { name: string; description: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCategory(name, description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
    }: {
      id: bigint;
      name: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCategory(id, name, description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      imageUrl,
      categoryId,
    }: {
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      categoryId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProduct(
        name,
        description,
        price,
        imageUrl,
        categoryId,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      imageUrl,
      categoryId,
    }: {
      id: bigint;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      categoryId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(
        id,
        name,
        description,
        price,
        imageUrl,
        categoryId,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUploadProductImage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      const result = await actor.uploadProductImage(blob);
      return result.getDirectURL();
    },
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const categories = await actor.getAllCategories();
      if (categories.length > 0) return;

      const [elec, fashion, home] = await Promise.all([
        actor.createCategory(
          "Electronics",
          "Latest gadgets and tech accessories",
        ),
        actor.createCategory("Fashion", "Trending clothing and accessories"),
        actor.createCategory("Home & Kitchen", "Everything for your home"),
      ]);

      await Promise.all([
        actor.createProduct(
          "Wireless Noise-Cancelling Headphones",
          "Premium sound quality with 30-hour battery life and active noise cancellation.",
          89.99,
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
          elec.id,
        ),
        actor.createProduct(
          "Smart Fitness Tracker",
          "Track your health metrics with heart rate, sleep, and step monitoring.",
          49.99,
          "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80",
          elec.id,
        ),
        actor.createProduct(
          "Classic Leather Jacket",
          "Genuine leather biker jacket with quilted lining and silver zipper details.",
          199.99,
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
          fashion.id,
        ),
        actor.createProduct(
          "Minimalist Canvas Backpack",
          "Spacious 30L backpack with laptop compartment and ergonomic shoulder straps.",
          59.99,
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
          fashion.id,
        ),
        actor.createProduct(
          "Premium Coffee Maker",
          "Brew barista-quality coffee at home with built-in grinder and 12-cup capacity.",
          129.99,
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
          home.id,
        ),
        actor.createProduct(
          "Ceramic Non-Stick Cookware Set",
          "5-piece set with PFOA-free ceramic coating, oven-safe up to 400°F.",
          79.99,
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
          home.id,
        ),
      ]);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
