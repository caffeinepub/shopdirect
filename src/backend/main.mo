import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type CategoryId = Nat;
  type ProductId = Nat;
  type OrderId = Nat;

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Float;
    imageUrl : Text;
    categoryId : CategoryId;
  };

  public type Category = {
    id : CategoryId;
    name : Text;
    description : Text;
  };

  public type Order = {
    id : OrderId;
    customerName : Text;
    contactNumber : Text;
    productIds : [ProductId];
  };

  public type UserProfile = {
    name : Text;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  // Maps & Counters
  let productMap = Map.empty<ProductId, Product>();
  let categoryMap = Map.empty<CategoryId, Category>();
  let orderMap = Map.empty<OrderId, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProductId = 1;
  var nextCategoryId = 1;
  var nextOrderId = 1;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Category CRUD
  public shared ({ caller }) func createCategory(name : Text, description : Text) : async Category {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };
    let category : Category = {
      id = nextCategoryId;
      name;
      description;
    };
    categoryMap.add(nextCategoryId, category);
    nextCategoryId += 1;
    category;
  };

  public query func getCategory(id : CategoryId) : async ?Category {
    categoryMap.get(id);
  };

  public shared ({ caller }) func updateCategory(id : CategoryId, name : Text, description : Text) : async Category {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };
    switch (categoryMap.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        let category : Category = { id; name; description };
        categoryMap.add(id, category);
        category;
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : CategoryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };
    if (not categoryMap.containsKey(id)) {
      Runtime.trap("Category not found");
    };
    categoryMap.remove(id);
  };

  public query func getAllCategories() : async [Category] {
    categoryMap.values().toArray();
  };

  // Product CRUD
  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Float, imageUrl : Text, categoryId : CategoryId) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      imageUrl;
      categoryId;
    };
    productMap.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public query func getProduct(id : ProductId) : async ?Product {
    productMap.get(id);
  };

  public shared ({ caller }) func updateProduct(id : ProductId, name : Text, description : Text, price : Float, imageUrl : Text, categoryId : CategoryId) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (productMap.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let product : Product = { id; name; description; price; imageUrl; categoryId };
        productMap.add(id, product);
        product;
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : ProductId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not productMap.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    productMap.remove(id);
  };

  public query func getAllProducts() : async [Product] {
    productMap.values().toArray().sort();
  };

  public query func getProductsByCategoryId(categoryId : CategoryId) : async [Product] {
    productMap.values().toArray().filter(
      func(product) { product.categoryId == categoryId }
    ).sort();
  };

  // Orders (public creation, admin-only listing)
  public shared func createOrder(customerName : Text, contactNumber : Text, productIds : [ProductId]) : async Order {
    let order : Order = {
      id = nextOrderId;
      customerName;
      contactNumber;
      productIds;
    };
    orderMap.add(nextOrderId, order);
    nextOrderId += 1;
    order;
  };

  public query ({ caller }) func getOrder(id : OrderId) : async ?Order {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orderMap.get(id);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view orders");
    };
    orderMap.values().toArray();
  };

  // Price conversion (public utility function)
  public query func convertPrice(productId : ProductId, conversionRate : Float) : async Float {
    switch (productMap.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product.price * conversionRate };
    };
  };

  // Image upload (admin only)
  public shared ({ caller }) func uploadProductImage(image : Storage.ExternalBlob) : async Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload product images");
    };
    image;
  };
};
