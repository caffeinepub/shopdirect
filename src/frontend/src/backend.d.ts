import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type OrderId = bigint;
export interface Category {
    id: CategoryId;
    name: string;
    description: string;
}
export type CategoryId = bigint;
export type ProductId = bigint;
export interface Order {
    id: OrderId;
    customerName: string;
    productIds: Array<ProductId>;
    contactNumber: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: ProductId;
    categoryId: CategoryId;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    convertPrice(productId: ProductId, conversionRate: number): Promise<number>;
    createCategory(name: string, description: string): Promise<Category>;
    createOrder(customerName: string, contactNumber: string, productIds: Array<ProductId>): Promise<Order>;
    createProduct(name: string, description: string, price: number, imageUrl: string, categoryId: CategoryId): Promise<Product>;
    deleteCategory(id: CategoryId): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategory(id: CategoryId): Promise<Category | null>;
    getOrder(id: OrderId): Promise<Order | null>;
    getProduct(id: ProductId): Promise<Product | null>;
    getProductsByCategoryId(categoryId: CategoryId): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCategory(id: CategoryId, name: string, description: string): Promise<Category>;
    updateProduct(id: ProductId, name: string, description: string, price: number, imageUrl: string, categoryId: CategoryId): Promise<Product>;
    uploadProductImage(image: ExternalBlob): Promise<ExternalBlob>;
}
