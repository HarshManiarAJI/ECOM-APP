// Import axios for making HTTP requests
import axios from "axios";

// Base URL for the dummy JSON API service
const BASE_URL = "https://dummyjson.com";

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API service object containing all endpoint methods
export const api = {
  // Product-related API endpoints
  products: {
    /**
     * Fetch a paginated list of all products
     * @param limit - Number of products to fetch per page (default: 12)
     * @param skip - Number of products to skip for pagination (default: 0)
     * @returns Promise containing products data with pagination
     */
    getAll: async (limit: number = 12, skip: number = 0) => {
      const response = await axiosInstance.get(
        `/products?limit=${limit}&skip=${skip}`
      );
      return response.data;
    },

    /**
     * Fetch all available product categories
     * @returns Promise containing array of category names
     */
    getCategories: async () => {
      const response = await axiosInstance.get("/products/categories");
      return response.data;
    },

    /**
     * Fetch products filtered by category
     * @param category - The category name to filter products
     * @returns Promise containing products in the specified category
     */
    getByCategory: async (category: string) => {
      const response = await axiosInstance.get(
        `/products/category/${category}`
      );
      return response.data;
    },

    /**
     * Search products by query string
     * @param query - Search term to filter products
     * @returns Promise containing products matching the search query
     */
    search: async (query: string) => {
      const response = await axiosInstance.get(`/products/search?q=${query}`);
      return response.data;
    },

    /**
     * Fetch a specific product by its ID
     * @param id - The unique identifier of the product
     * @returns Promise containing the product details
     */
    getById: async (id: number) => {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    },
  },
};
