// Import required dependencies from Zustand and types
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, CartState, FilterState, Product } from "../types";

// Define the main store state interface that includes all state slices and actions
interface StoreState {
  // State slices
  auth: AuthState;        // Authentication state (user info and auth status)
  cart: CartState;        // Shopping cart state (items and total)
  filter: FilterState;    // Product filtering state (category, sort, search)
  favorites: Product[];   // List of favorited products

  // Authentication actions
  setAuth: (user: AuthState["user"]) => void;     // Set user authentication state
  logout: () => void;                             // Handle user logout

  // Cart actions
  addToCart: (product: Product) => void;          // Add product to cart
  removeFromCart: (productId: number) => void;    // Remove product from cart
  updateQuantity: (productId: number, quantity: number) => void;  // Update item quantity
  clearCart: () => void;                         // Clear all items from cart
  isInCart: (productId: number) => boolean;      // Check if product is in cart

  // Filter actions
  setFilter: (filter: Partial<FilterState>) => void;  // Update filter settings

  // Favorites actions
  addToFavorites: (product: Product) => void;        // Add product to favorites
  removeFromFavorites: (productId: number) => void;  // Remove product from favorites
  isFavorite: (productId: number) => boolean;        // Check if product is favorited
  clearFavorites: () => void;                        // Clear all favorites
}

// Create the store with persistence middleware
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      auth: {
        user: null,
        isAuthenticated: false,
      },
      cart: {
        items: [],
        total: 0,
      },
      filter: {
        category: "",
        sortBy: "",
        searchQuery: "",
      },
      favorites: [],

      // Auth actions
      setAuth: (user: AuthState["user"]) =>
        set((state) => {
          // Clear cart when user changes to maintain cart separation between users
          if (state.auth.user?.username !== user?.username) {
            return {
              auth: {
                user,
                isAuthenticated: !!user,
              },
              cart: {
                items: [],
                total: 0,
              },
            };
          }
          return {
            auth: {
              user,
              isAuthenticated: !!user,
            },
          };
        }),

      // Cart actions
      addToCart: (product: Product) =>
        set((state) => {
          const existingItem = state.cart.items.find(
            (item: any) => item.id === product.id
          );
          // If item exists, increment quantity
          if (existingItem) {
            return {
              cart: {
                items: state.cart.items.map((item: any) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
                total: state.cart.total + product.price,
              },
            };
          }
          // If item is new, add to cart with quantity 1
          return {
            cart: {
              items: [...state.cart.items, { ...product, quantity: 1 }],
              total: state.cart.total + product.price,
            },
          };
        }),

      // Remove item from cart and update total
      removeFromCart: (productId: number) =>
        set((state) => {
          const item = state.cart.items.find((item: any) => item.id === productId);
          if (!item) return state;
          return {
            cart: {
              items: state.cart.items.filter((item: any) => item.id !== productId),
              total: state.cart.total - item.price * item.quantity,
            },
          };
        }),

      // Update item quantity and recalculate total
      updateQuantity: (productId: number, quantity: number) =>
        set((state) => {
          const item = state.cart.items.find((item: any) => item.id === productId);
          if (!item) return state;
          const oldTotal = item.price * item.quantity;
          const newTotal = item.price * quantity;
          return {
            cart: {
              items: state.cart.items.map((item: any) =>
                item.id === productId ? { ...item, quantity } : item
              ),
              total: state.cart.total - oldTotal + newTotal,
            },
          };
        }),

      // Filter actions
      setFilter: (filter: Partial<FilterState>) =>
        set((state) => ({
          filter: { ...state.filter, ...filter },
        })),

      // Clear cart
      clearCart: () =>
        set({
          cart: {
            items: [],
            total: 0,
          },
        }),

      // Logout action - clear user data and cart
      logout: () => {
        localStorage.removeItem("user");
        set({
          auth: {
            user: null,
            isAuthenticated: false,
          },
          cart: {
            items: [],
            total: 0,
          },
          favorites: [],
        });
      },

      // Favorites actions
      addToFavorites: (product: Product) =>
        set((state) => ({
          favorites: [...state.favorites, product],
        })),

      removeFromFavorites: (productId: number) =>
        set((state) => ({
          favorites: state.favorites.filter((item: Product) => item.id !== productId),
        })),

      isFavorite: (productId: number) =>
        get().favorites.some((item: Product) => item.id === productId),

      clearFavorites: () =>
        set({
          favorites: [],
        }),

      // Helper method to check if product is in cart
      isInCart: (productId: number) =>
        get().cart.items.some((item: any) => item.id === productId),
    }),
    {
      // Configure persistence with local storage key
      name: "ecommerce-store",
    }
  )
);
