import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { Trash2, Heart } from 'lucide-react';
import { useState } from 'react';
import { couponCodes } from '../utils/utils';
import { CouponCode } from '../types';

// Cart component
export const Cart = () => {
  // Hooks for navigation and state management
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, isFavorite } = useStore();
  
  // Local state for coupon management
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);

  /**
   * Handle checkout process
   * Shows success message, clears cart, and redirects to home
   */
  const handleCheckout = () => {
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  /**
   * Apply coupon code to the cart
   * Validates coupon and applies discount if valid
   */
  const handleApplyCoupon = () => {
    const coupon = couponCodes.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );
    
    if (coupon) {
      setAppliedCoupon(coupon);
      setAppliedDiscount(coupon.discount);
      setError('');
      // Disable input field after successful coupon application
      const input = document.getElementById('coupon-input') as HTMLInputElement;
      if (input) input.disabled = true;
    } else {
      setAppliedCoupon(null);
      setAppliedDiscount(0);
      setError('Invalid coupon code');
    }
  };

  /**
   * Remove applied coupon and reset discount
   */
  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
    setAppliedCoupon(null);
    setError('');
    // Re-enable input field after coupon removal
    const input = document.getElementById('coupon-input') as HTMLInputElement;
    if (input) input.disabled = false;
  };

  /**
   * Calculate the discount amount based on cart total and coupon restrictions
   * @returns {number} The calculated discount amount
   */
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const rawDiscount = cart.total * (appliedCoupon.discount / 100);
    return Math.min(rawDiscount, appliedCoupon.maxDiscountAmount);
  };

  // Calculate final amounts
  const discountAmount = calculateDiscount();
  const discountedTotal = cart.total - discountAmount;

  // Render empty cart message if no items
  if (cart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto mt-10 mb-10 px-4" data-test="emptyCartSection">
        <h2 className="text-2xl font-semibold mb-4" data-test="emptyCartTitle">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          data-test="continueShoppingBtn"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-10 px-4" data-test="cartSection">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      {/* Cart Table - Displays product list with actions */}
      <div className="overflow-x-auto bg-white shadow rounded-md" data-test="cartTableSection">
        <table className="min-w-full table-auto border-collapse" data-test="cartTable">
          <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-center">Quantity</th>
              <th className="p-4 text-right">Total</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.id} className="border-t" data-test="cartItemRow">
                <td className="p-4 flex items-center" data-test="cartItemInfo">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 object-contain mr-4"
                    data-test="cartItemImg"
                  />
                  <div className="flex items-center">
                    <span className="text-sm text-gray-800" data-test="cartItemTitle">{item.title}</span>
                    {isFavorite(item.id) && (
                      <div className="relative group ml-2" data-test="favoriteIcon">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          Favorite product
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right text-sm" data-test="cartItemPrice">${item.price}</td>
                <td className="p-4 text-center" data-test="cartItemQty">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
                    data-test="cartItemQtyInput"
                  />
                </td>
                <td className="p-4 text-right text-sm" data-test="cartItemTotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove item"
                    data-test="removeCartItemBtn"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4">
        {/* Coupon Code Section - Input and apply/remove buttons */}
        <div className="flex gap-4 items-center" data-test="couponSection">
          <div className="flex-1 max-w-xs">
            <input
              id="coupon-input"
              type="text"
              value={couponCode}
              onChange={(e) => !appliedDiscount && setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              disabled={appliedDiscount > 0}
              className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${appliedDiscount > 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              data-test="couponInput"
            />
            {error && <p className="text-red-500 text-sm mt-1" data-test="couponError">{error}</p>}
          </div>
          {appliedDiscount > 0 ? (
            <button
              onClick={handleRemoveCoupon}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
              data-test="removeCouponBtn"
            >
              <Trash2 className="w-4 h-4" />
              Remove Coupon
            </button>
          ) : (
            <button
              onClick={handleApplyCoupon}
              disabled={!couponCode.trim()}
              className={`px-4 py-2 rounded flex items-center gap-2
                ${couponCode.trim() 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
              data-test="applyCouponBtn"
            >
              Apply Coupon
            </button>
          )}
        </div>

        {/* Price Summary - Shows subtotal, discount, and final total */}
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded" data-test="priceSummarySection">
          <div className="space-y-1">
            <p className="text-lg" data-test="subtotal">Subtotal: ${cart.total.toFixed(2)}</p>
            {appliedCoupon && (
              <>
                <p className="text-green-600" data-test="appliedCoupon">Applied Coupon: {couponCode}</p>
                <p className="text-green-600" data-test="discountInfo">
                  Discount ({appliedCoupon.discount}% up to ${appliedCoupon.maxDiscountAmount}): 
                  -${discountAmount.toFixed(2)}
                </p>
              </>
            )}
            <p className="text-xl font-semibold" data-test="finalTotal">
              Final Total: ${discountedTotal.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg font-medium"
            data-test="btnCheckout"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
