// Import necessary hooks and components
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Product } from "../types";
import { Loader2, ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { useStore } from "../store/store";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

/**
 * ProductDetails Component
 * Displays detailed information about a specific product
 * Including images, specifications, pricing, and reviews
 */
const ProductDetails = () => {
  // Get product ID from URL parameters and navigation
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get necessary actions and state from global store
  const { auth, addToCart, removeFromCart, isInCart, cart, updateQuantity } =
    useStore();

  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Find this product in the cart if it exists
  const cartItem = cart.items.find((item) => product && item.id === product.id);

  /**
   * Handle adding product to cart
   * Redirects to login if user is not authenticated
   */
  const handleAddToCart = () => {
    if (!product) return;
    if (!auth.isAuthenticated) {
      navigate("/login");
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
    if (!cartItem || !product) return;
    const newQuantity = cartItem.quantity + change;
    if (newQuantity >= 1) {
      updateQuantity(product.id, newQuantity);
    }
  };

  /**
   * Fetch product details when component mounts or URL parameters change
   */
  useEffect(() => {
    const fetchProduct = async () => {
      const id = Number(searchParams.get("id"));
      // Validate product ID
      if (!id) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        const data = await api.products.getById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [searchParams]);

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Display error message if fetch failed or product not found
  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error || "Product not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Main product information grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left column: Image Gallery */}
        <div className="space-y-4">
          {/* Main product image */}
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-96 object-cover rounded-2xl shadow-md"
          />
          {/* Thumbnail gallery */}
          <div className="grid grid-cols-4 gap-2">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.title} ${idx + 1}`}
                className="h-20 w-full object-cover rounded-lg border hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>

        {/* Right column: Product Information */}
        <div className="space-y-6">
          {/* Product title and description */}
          <h1
            className="text-4xl font-bold text-gray-900"
            data-test="txtProductName"
          >
            {product.title}
          </h1>
          <p
            className="text-gray-600 leading-relaxed"
            data-test="txtProductDescription"
          >
            {product.description}
          </p>

          {/* Pricing section */}
          <div className="pt-4 border-t space-y-2">
            <p
              className="text-3xl font-bold text-blue-700"
              data-test="txtProductPrice"
            >
              ${product.price}
            </p>
            <p className="text-green-600 font-medium">
              {product.discountPercentage}% OFF
            </p>
          </div>

          {/* Cart Controls Section */}
          <div className="pt-4 border-t">
            <div className="flex gap-4">
              {isInCart(product.id) ? (
                <>
                  {/* Quantity adjustment controls */}
                  <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                      disabled={cartItem?.quantity === 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <span className="flex-1 text-center font-medium text-lg">
                      {cartItem?.quantity || 0} in cart
                    </span>

                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Remove from cart button */}
                  <button
                    data-test="btnRemoveFromCart"
                    onClick={() => product && removeFromCart(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded px-6 py-2 flex items-center gap-2"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                    Remove
                  </button>
                </>
              ) : (
                // Add to cart button
                <button
                  data-test="btnAddToCart"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-lg transition"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
              )}
            </div>

            {/* View Cart button - Only shown for items in cart */}
            {isInCart(product.id) && (
              <button
                onClick={() => navigate("/cart")}
                className="mt-4 w-full text-white font-medium text-lg bg-green-700 rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-green-800 transition"
              >
                <ShoppingCartCheckoutIcon className="w-6 h-6" />
                View in Cart
              </button>
            )}
          </div>

          {/* Product specifications grid */}
          <div className="pt-4 border-t text-sm text-gray-700 space-y-3">
            <div className="flex">
              {/* Left specifications column */}
              <div className="">
                <p>
                  <span className="font-semibold">Brand:</span> {product.brand}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category}
                </p>
                <p>
                  <span className="font-semibold">Rating:</span>{" "}
                  {product.rating} / 5
                </p>
                <p>
                  <span className="font-semibold">Stock:</span> {product.stock}{" "}
                  units
                </p>
                <p>
                  <span className="font-semibold">Warranty:</span>{" "}
                  {product.warrantyInformation}
                </p>
              </div>
              {/* Right specifications column */}
              <div className="ml-8">
                <p>
                  <span className="font-semibold">Shipping:</span>{" "}
                  {product.shippingInformation}
                </p>
                <p>
                  <span className="font-semibold">Return Policy:</span>{" "}
                  {product.returnPolicy}
                </p>
                <p>
                  <span className="font-semibold">Min Order Qty:</span>{" "}
                  {product.minimumOrderQuantity}
                </p>
                <p>
                  <span className="font-semibold">Weight:</span>{" "}
                  {product.weight}g
                </p>
                <p>
                  <span className="font-semibold">Dimensions:</span>{" "}
                  {product.dimensions.width} x {product.dimensions.height} x{" "}
                  {product.dimensions.depth}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Customer Reviews
        </h2>
        {/* Review cards */}
        <div className="space-y-4">
          {product.reviews?.map((review, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border rounded-xl p-4 shadow-sm"
            >
              <p className="text-sm text-gray-800 italic">"{review.comment}"</p>
              <div className="text-sm text-gray-600 mt-2 flex justify-between">
                <span>By {review.reviewerName}</span>
                <span className="text-yellow-600 font-medium">
                  {review.rating} / 5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
