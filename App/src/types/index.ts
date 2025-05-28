export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  username: string;

  firstName: string;

  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface FilterState {
  category: string;
  sortBy: "price-asc" | "price-desc" | "";
  searchQuery: string;
}

export interface ProductCardProps {
  product: Product;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface FavoriteState {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

export interface CouponCode {
  code: string;
  discount: number;
  maxDiscountAmount: number;
}