import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../components/ProductCard';
import { api } from '../services/api';
import { useStore } from '../store/store';
import { Category, Product } from '../types';

/**
 * ProductList Component
 * Main product listing page with filtering, sorting, and search capabilities
 * Uses React Query for data fetching and Zustand for state management
 */
export const ProductList = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(12);  // Products per page
  
  // Global filter state from Zustand store
  const { filter, setFilter } = useStore();
  
  // Local state for categories and search
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Fetch categories on component mount
   */
  useEffect(() => {
    api.products.getCategories().then(setCategories);
  }, []);

  /**
   * Query for fetching all products when no filters are applied
   * Used for client-side filtering and sorting
   */
  const { data: allProductsData } = useQuery({
    queryKey: ['allProducts'],
    queryFn: () => api.products.getAll(100, 0),
    enabled: !filter.category && !searchQuery,
  });

  /**
   * Query for fetching filtered/searched products
   * Only enabled when category filter or search is active
   */
  const { data, isLoading } = useQuery({
    queryKey: ['products', page, limit, filter.category, searchQuery],
    queryFn: async () => {
      if (searchQuery) return api.products.search(searchQuery);
      if (filter.category) return api.products.getByCategory(filter.category);
      return api.products.getAll(limit, (page - 1) * limit);
    },
    enabled: !!filter.category || !!searchQuery,
  });

  /**
   * Callback handlers for filtering and sorting
   */
  const handleCategoryChange = useCallback((category: string) => {
    setFilter({ category });
    setPage(1);  // Reset to first page when changing category
  }, [setFilter]);

  const handleSortChange = useCallback((sortBy: 'price-asc' | 'price-desc' | '') => {
    setFilter({ sortBy });
  }, [setFilter]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);  // Reset to first page when searching
  }, []);

  const handlePageChange = (newPage: number) => setPage(newPage);

  /**
   * Determine which products to display based on filters
   * Returns filtered products or all products depending on active filters
   */
  const getProductsToDisplay = useCallback((): Product[] => {
    if (filter.category || searchQuery) return data?.products || [];
    return allProductsData?.products || [];
  }, [filter.category, searchQuery, data?.products, allProductsData?.products]);

  /**
   * Sort products based on selected sort option
   * Memoized to prevent unnecessary recalculations
   */
  const sortedProducts = useMemo(() => {
    const products = getProductsToDisplay();
    return [...products].sort((a, b) => {
      switch (filter.sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return 0;
      }
    });
  }, [getProductsToDisplay, filter.sortBy]);

  /**
   * Calculate pagination values and slice products for current page
   * Memoized to prevent unnecessary recalculations
   */
  const { totalPages, paginatedProducts } = useMemo(() => {
    const totalPages = Math.ceil(sortedProducts.length / limit);
    const paginated = sortedProducts.slice((page - 1) * limit, page * limit);
    return { totalPages, paginatedProducts: paginated };
  }, [sortedProducts, page, limit]);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 bg-white text-gray-900">
      <div className="w-full max-w-7xl mx-auto">
        {/* Filter Section - Category, Sort, and Search controls */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6" data-test="secFilters">
          <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
            <Filter className="w-5 h-5" />
            Filters
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <select
            data-test="selCategory"
              value={filter.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.name}</option>
              ))}
            </select>

            <select
            data-test="selSort"
              value={filter.sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <div className="relative flex-1">
              <input
                data-test="inpSearch"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search"
                className="w-full border border-gray-300 rounded px-10 py-2 bg-white"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Products Section - Loading state or product grid */}
        {isLoading ? (
          <div className="flex justify-center mt-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Product Grid - Responsive layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-test="secProducts">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls - Only shown when needed */}
            {!filter.category && !searchQuery && totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2" data-test="secProductsPagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 rounded ${page === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
