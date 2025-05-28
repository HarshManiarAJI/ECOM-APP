// Import required hooks and components
import { useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/store';
import { Heart } from 'lucide-react';

/**
 * Favorites Component
 * Displays a paginated list of user's favorite products
 * Includes empty state handling and responsive grid layout
 */
const Favorites = () => {
  // State for pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // Products per page

  // Get favorites from global store
  const { favorites } = useStore();

  /**
   * Memoized pagination calculations
   * Prevents recalculation unless favorites, page, or limit changes
   */
  const { totalPages, paginatedProducts } = useMemo(() => {
    const totalPages = Math.ceil(favorites.length / limit);
    // Slice the array to get current page's products
    const paginated = favorites.slice((page - 1) * limit, page * limit);
    return { totalPages, paginatedProducts: paginated };
  }, [favorites, page, limit]);

  /**
   * Handle page navigation
   * @param newPage - The page number to navigate to
   */
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 bg-white text-gray-900">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section with Heart Icon */}
        <div className="flex items-center gap-2 mb-8">
          <Heart className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">Favorite Products</h1>
        </div>

        {/* Conditional Rendering: Empty State or Product Grid */}
        {favorites.length === 0 ? (
          // Empty State with centered heart icon and message
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">No favorite products yet</p>
          </div>
        ) : (
          <>
            {/* Responsive Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls - Only shown if there are multiple pages */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-1 rounded ${
                      page === i + 1
                        ? 'bg-blue-600 text-white' // Active page style
                        : 'bg-gray-200 hover:bg-gray-300' // Inactive page style
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

export default Favorites;
