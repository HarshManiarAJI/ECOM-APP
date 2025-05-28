// Import routing and state management utilities
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';

// Import icons for navigation elements
import { ShoppingCart, LogIn, LogOut } from 'lucide-react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

/**
 * Navbar Component
 * Provides main navigation and displays user authentication status,
 * cart information, and access to favorites
 */
export const Navbar = () => {
  // Get authentication, cart state, and logout function from global store
  const { auth, cart, logout } = useStore();

  /**
   * Handle user logout
   * Calls the logout function from the store
   */
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Store brand/logo with home link */}
          <RouterLink to="/" className="text-2xl font-bold">
            E-Commerce Store
          </RouterLink>
        
          {/* Navigation items container */}
          <div className="flex items-center space-x-6">
            {/* Conditional rendering based on authentication status */}
            {auth.isAuthenticated ? (
              <>
                {/* Welcome message and authenticated user actions */}
                <span className="text-sm">Welcome, {auth.user?.firstName}</span>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:underline"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
                {/* Favorites link with dynamic icon based on current route */}
                <RouterLink
                  to="/favorites"
                  className={`flex space-x-1 hover:underline transition-colors ${
                    useLocation().pathname === '/favorites' ? 'text-pink-500' : ''
                  }`}
                >
                  {useLocation().pathname === '/favorites' ? (
                    <FavoriteIcon className="w-5 h-5" />
                  ) : (
                    <FavoriteBorderIcon className="w-5 h-5" />
                  )}
                  <span>Favorites</span>
                </RouterLink>
              </>
            ) : (
              // Login link for unauthenticated users
              <RouterLink
                to="/login"
                className="flex items-center space-x-1 hover:underline"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </RouterLink>
            )}

            {/* Shopping cart with item count badge */}
            <RouterLink to="/cart" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {/* Show item count badge only if cart has items */}
              {cart.items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cart.items.length}
                </span>
              )}
            </RouterLink>

            {/* Cart total display */}
            <span className="text-sm">Total: ${cart.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
