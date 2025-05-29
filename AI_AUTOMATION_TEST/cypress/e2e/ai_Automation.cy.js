describe("Home Page E2E Tests", () => {
  beforeEach(() => {
    // Intercept the main products endpoint with real DummyJSON structure
    cy.intercept("GET", "https://dummyjson.com/products*", {
      fixture: "products.json",
    }).as("getProducts");

    // Intercept category-based products
    cy.intercept("GET", "https://dummyjson.com/products/category/*", {
      fixture: "categories.json",
    }).as("getCategoryProducts");

    // // Intercept search endpoint
    // cy.intercept('GET', 'https://dummyjson.com/products/search*', {
    //   fixture: 'searchProducts.json'
    // }).as('searchProducts');

    // Intercept categories endpoint
    cy.intercept("GET", "https://dummyjson.com/products/categories", {
      fixture: "categories.json",
    }).as("getCategories");

    // Visit the home page before each test
    cy.visit("http://localhost:5173/");
    cy.restoreLocalStorage();
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });

  describe("Navbar Tests", () => {
    it("should display E-Commerce Store title in the navbar", () => {
      cy.get('[data-test="navbar"]')
        .should("be.visible")
        .and("contain", "E-Commerce Store");
    });

    it("should show login button when user is not authenticated", () => {
      cy.get('[data-test="btnLogin"]')
        .should("be.visible")
        .and("contain", "Login");
    });

    it("should not show cart count when cart is empty", () => {
      cy.get('[data-test="btnCart"]')
        .should("be.visible")
        .find("span")
        .should("not.exist");
    });

    it("should show $0.00 total when cart is empty", () => {
      cy.get('[data-test="txtCartTotal"]').should("contain", "Total: $0.00");
    });
  });

  describe("Filter and Search Tests", () => {
    it("should render filter section with category options", () => {
      cy.get('[data-test="secFilters"]').should("be.visible");
      cy.wait("@getCategories").then((interception) => {
        const categories = interception.response.body;
        cy.get('[data-test="selCategory"]')
          .should("be.visible")
          .find("option")
          .should("have.length", categories.length + 1); // +1 for default option
      });
    });

    it("should apply category filter and update product list", () => {
      cy.get('[data-test="selCategory"]').select("laptops");
      cy.wait("@getCategoryProducts").then((interception) => {
        expect(interception.request.url).to.include(
          "/products/category/laptops"
        );
      });
    });

    it("should apply sort filter and update product list", () => {
      cy.get('[data-test="selSort"]').select("price-asc");
      cy.wait("@getProducts");
      cy.get('[data-test="secProductCard"]').first().contains("$"); // Verify price sorting
    });
  });

  describe("Product Card Tests", () => {
    it("should render product cards with correct information", () => {
      cy.get('[data-test="secProductCard"]')
        .first()
        .within(() => {
          cy.contains("Essence Mascara Lash Princess").should("be.visible");
          cy.contains(
            "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects."
          ).should("be.visible");
          cy.contains("$9.99").should("be.visible");
          cy.get('[data-test="btnAddToCart"]').should("be.visible");
        });
    });

    it("should navigate to product details on card click", () => {
      cy.get('[data-test="secProductCard"]').first().click();
      cy.url().should("include", "/product-details");
    });

    it("should hide add to cart and show quantity controls after adding to cart", () => {
      cy.get('[data-test="secProductCard"]')
        .first()
        .within(() => {
          cy.get('[data-test="btnAddToCart"]').should("be.visible").click();
          cy.location("pathname").should("include", "/login");
        });
      cy.getDataTest("loginForm").should("exist");
      // Ensure the username, password, and login button are inside the form
      cy.getDataTest("loginForm").within(() => {
        cy.getDataTest("inpUsername").should("exist").type("testUser");
        cy.getDataTest("inpPassword")
          .should("exist")
          .type("harsh@securePassword_12345678");
        cy.getDataTest("btnLogin").should("exist").click();
      });
      cy.get('[data-test="secProductCard"]')
        .first()
        .within(() => {
          cy.getDataTest("btnAddToCart").should("exist").click();
        cy.getDataTest("btnAddToCart").should("not.exist");
        cy.getDataTest("btnRemoveFromCart").should("exist");
        cy.getDataTest("btnViewInCart").should("exist");

        cy.getDataTest("btnIncreaseQuantity").should("exist").click();
        cy.getDataTest("txtCartItemQuantity").should("contain", "2");
        cy.getDataTest("btnDecreaseQuantity").should("exist").click();
        cy.getDataTest("txtCartItemQuantity").should("contain", "1");
        cy.getDataTest("btnViewInCart").click();
        });
    });
  });

  describe('Authentication and Cart Tests', () => {
    beforeEach(() => {
      // Ensure user is logged out before each test
      cy.get('[data-test="btnLogout"]').click();
    });
    it('should redirect to login when adding to cart while logged out', () => {
      cy.get('[data-test="secProductCard"]')
        .eq(1) // Second product (in stock)
        .find('[data-test="btnAddToCart"]')
        .click();

      cy.location('pathname').should('include', 'login');
    });
  });

  describe('Empty States and Error Handling', () => {
    it('should show empty state when no products are found', () => {
      cy.intercept('GET', '**/products*', { products: [] }).as('emptyProducts');
      cy.reload();
      cy.contains('No Products Available').should('be.visible');
    });

    it('should show empty results when filters yield no products', () => {
      cy.intercept('GET', '**/products*', { products: [] }).as('filteredProducts');
      cy.get('[data-test="selCategory"]').select('Tops');
      cy.contains('No Products Available').should('be.visible');
    });
  });

  describe('Pagination Tests', () => {
    it('should display pagination when products exceed page limit', () => {
      cy.get('[data-test="secProductsPagination"]').should('be.visible');
      cy.get('[data-test="secProductCard"]').should('have.length', 12); // First page limit
    });

    it('should navigate between pages', () => {
      cy.get('[data-test="secProductsPagination"]').contains('2').click();
      cy.get('[data-test="secProductCard"]').should('have.length.greaterThan', 2); // Remaining products
    });
  });

});
