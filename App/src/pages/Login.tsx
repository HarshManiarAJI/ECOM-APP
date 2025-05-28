// Import necessary hooks from React and React Router
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';

/**
 * Login Component
 * Handles user authentication and provides a sign-in form interface
 * Uses local storage for persistence and Zustand for global state management
 */
export const Login = () => {
  // Navigation hook for redirecting after login
  const navigate = useNavigate();
  // Global auth state setter from Zustand store
  const { setAuth } = useStore();

  // Form state management
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /**
   * Handle form submission
   * Validates inputs, saves user data to localStorage,
   * updates global auth state, and redirects to home
   * @param e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // Store user credentials in localStorage
    localStorage.setItem('user', JSON.stringify({ username, password }));

    // Update global auth state with user information
    setAuth({
      id: 1,
      username,

      firstName: username,
      token: `${username}:${password}`,
    });

    // Redirect to home page after successful login
    navigate('/');
  };

  return (
    // Main container with centered content
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Login card container */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign in</h1>
        
        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Error message display */}
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
