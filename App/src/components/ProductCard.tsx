import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { ProductCardProps } from '../types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

/**
 * ProductCard Component
 * Displays individual product information with interactive features:
 * - Add/Remove from cart
 * - Quantity adjustment
 * - Add/Remove from favorites
 * - Navigation to product details
 */
export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  
  // Get necessary actions and state from global store
  const { 
    auth, 
    addToCart, 
    removeFromCart,
    isFavorite, 
    addToFavorites, 
    removeFromFavorites, 
    isInCart,
    cart,
    updateQuantity 
  } = useStore();

  // Find this product in the cart if it exists
  const cartItem = cart.items.find(item => item.id === product.id);

  /**
   * Handle adding product to cart
   * Redirects to login if user is not authenticated
   */
  const handleAddToCart = () => {
    if (!auth.isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isInCart(product.id)) {
      addToCart(product);
    }
  };

  /**
   * Handle quantity changes for products in cart
   * @param change - Amount to change quantity by (+1 or -1)
   */
  const handleQuantityChange = (change: number) => {
    if (!cartItem) return;
    const newQuantity = cartItem.quantity + change;
    if (newQuantity >= 1) {
      updateQuantity(product.id, newQuantity);
    }
  };

  /**
   * Toggle product favorite status
   * Removes from favorites if already favorited, adds if not
   */
  const handleFavoriteClick = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  /**
   * Navigate to product details page
   */
  const handleProductClick = () => {
    navigate(`/product-details?id=${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transition hover:shadow-lg relative cursor-pointer" 
      onClick={handleProductClick}
    >
      {/* Favorite Button - Positioned absolutely in top-right */}
      <button
        onClick={(e) => {
          e.stopPropagation();  // Prevent triggering card click
          handleFavoriteClick();
        }}
        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm z-10 transition-colors"
      >
        {isFavorite(product.id) ? (
          <FavoriteIcon className="w-5 h-5 text-red-500 cursor-pointer" />
        ) : (
          <FavoriteBorderIcon className="w-5 h-5 text-gray-600 hover:text-red-500 cursor-pointer" />
        )}
      </button>

      {/* Product Image */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-48 w-full object-contain p-2 bg-gray-100"
      />

      {/* Product Information */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        </div>
        <div className="mt-4">
          <p className="text-xl font-bold text-blue-600">${product.price}</p>
        </div>
      </div>

      {/* Cart Controls Section */}
      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2">
          {/* Conditional rendering based on cart status */}
          {isInCart(product.id) ? (
            // Quantity adjustment controls for items in cart
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                disabled={cartItem?.quantity === 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <span className="flex-1 text-center font-medium">
                {cartItem?.quantity || 0} in cart
              </span>

              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // Add to cart button for items not in cart
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          )}

          {/* Remove from cart button - Only shown for items in cart */}
          {isInCart(product.id) && (
            <button
              onClick={() => removeFromCart(product.id)}
              className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-2 flex items-center justify-center"
              title="Remove from cart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View in Cart button - Only shown for items in cart */}
        {isInCart(product.id) && (
          <>
            <button
              onClick={() => navigate('/cart')}
              className="mt-2 w-full text-white font-medium text-sm font-medium bg-green-700 rounded p-2 flex items-center justify-center hover:bg-green-800 transition "
            >
              <ShoppingCartCheckoutIcon className="mr-2" />
              View in Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};
