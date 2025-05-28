# E-Commerce Product Showcase Documentation

## Table of Contents
1. [Components](#components)
2. [Pages](#pages)
3. [Store](#store)
4. [Services](#services)
5. [Utils](#utils)

## Components

### Navbar Component
```tsx
Location: src/components/Navbar.tsx
Purpose: Main navigation component
Features:
- Links to Home, Cart, and Favorites
- Shows cart items count
- Handles user authentication status
- Responsive design with mobile menu
```

### ProductCard Component
```tsx
Location: src/components/ProductCard.tsx
Purpose: Displays individual product information
Features:
- Shows product image, title, price
- Add to Cart functionality
- Quantity adjustment when in cart
- Remove from Cart option
- Add/Remove from Favorites
- Links to product details page
- Shows favorite status with tooltip
```

## Pages

### ProductList Page
```tsx
Location: src/pages/ProductList.tsx
Purpose: Main product listing page
Features:
- Displays grid of ProductCard components
- Handles pagination (12 items per page)
- Category filtering
- Search functionality
- Product sorting options
```

### ProductDetails Page
```tsx
Location: src/pages/ProductDetails.tsx
Purpose: Shows detailed product information
Features:
- Image gallery with zoom functionality
- Product information display
- Add to Cart functionality
- Quantity adjustment
- Rating display
- Price and discount information
```

### Cart Page
```tsx
Location: src/pages/Cart.tsx
Purpose: Shopping cart management
Features:
- Lists cart items with quantities
- Allows quantity adjustment
- Shows item subtotals
- Coupon code system with maximum limits
- Shows favorite status of cart items
- Calculates total with discounts
```

### Favorites Page
```tsx
Location: src/pages/Favorites.tsx
Purpose: Shows user's favorite products
Features:
- Displays favorited products
- Pagination system (12 items per page)
- Empty state message
- Maintains cart functionality
```

### Login Page
```tsx
Location: src/pages/Login.tsx
Purpose: User authentication
Features:
- Login form
- Authentication state management
- Error handling
- Redirect after login
```

## Store

### Store Management
```tsx
Location: src/store/store.ts
Purpose: Central state management
Features:
- Authentication state
- Cart management
  - Add/Remove items
  - Update quantities
  - Calculate totals
- Favorites management
  - Add/Remove favorites
  - Check favorite status
- Persistent storage
```

## Services

### API Service
```tsx
Location: src/services/api.ts
Purpose: Handle API communications
Endpoints:
- GET /products - List all products
- GET /products/:id - Get single product
- GET /products/categories - Get categories
Features:
- Axios instance configuration
- Error handling
- Type safety
```

## Utils

### Utility Functions
```tsx
Location: src/utils/utils.ts
Purpose: Shared utility functions
Features:
- Coupon code management
  - Code validation
  - Discount calculations
  - Maximum discount limits
- Other helper functions
```

## Type Definitions

### Types
```tsx
Location: src/types/index.ts
Purpose: TypeScript type definitions
Includes:
- Product interface
- Cart types
- API response types
- Coupon code types
```

## Routing

### App Router
```tsx
Location: src/App.tsx
Purpose: Main application router
Features:
- Route definitions
- Private route protection
- Layout management
- Authentication checks
```

## Features and Functionality

### Authentication
- Protected routes
- Login/Logout functionality
- Persistent auth state

### Shopping Cart
- Add/Remove products
- Quantity adjustment
- Price calculations
- Coupon system
- Maximum discount limits

### Favorites
- Add/Remove favorites
- Persistent favorites
- Quick access to favorite products

### Product Management
- Product listing with filters
- Detailed product views
- Image galleries
- Rating display

## Technical Implementation

### State Management
- Zustand for global state
- React Query for API cache
- Local storage persistence

### Styling
- Tailwind CSS
- Custom components
- Icon integration