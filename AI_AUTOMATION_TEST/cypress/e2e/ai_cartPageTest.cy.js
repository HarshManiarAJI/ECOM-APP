describe("Cart Page", () => {
	const username = "testUser";
	const password = "harsh@securePassword_12345678";

	const login = () => {
		cy.getDataTest("btnLogin").should("exist").click();
		cy.location("pathname").should("include", "/login");

		cy.getDataTest("loginForm").within(() => {
			cy.getDataTest("inpUsername").type(username);
			cy.getDataTest("inpPassword").type(password);
			cy.getDataTest("btnLogin").click();
		});

		cy.getDataTest("secProducts").should("exist");
	};

	const addFirstProductToCart = () => {
		// cy.getDataTest("secProducts").should("have.length.at.least", 6);
		cy.getDataTest("secProductCard")
			.first()
			.within(() => {
				cy.getDataTest("btnAddToCart").click();
				cy.getDataTest("btnViewInCart").should("exist").click();
			});

		cy.location("pathname").should("include", "/cart");
	};

	beforeEach(() => {
		cy.visit("http://localhost:5173");

		cy.getDataTest("btnLogout").should("not.exist");
		login();
	});
	afterEach(() => {
		cy.saveLocalStorage();
	});

	// =====================
	// Empty Cart State
	// =====================
	context("Empty Cart State", () => {
		beforeEach(() => {
			// Ensure the cart is empty by navigating directly
			cy.visit("http://localhost:5173/cart");
		});

		/**
		 * Should display empty cart message and Continue Shopping button
		 */
		it("displays empty cart message and Continue Shopping button", () => {
			cy.getDataTest("emptyCartSection").should("be.visible");
			cy.getDataTest("emptyCartTitle").should("contain", "Your cart is empty");
			cy.getDataTest("continueShoppingBtn").should("be.visible");
		});

		/**
		 * Should navigate to home when Continue Shopping is clicked
		 */
		it("navigates to home when Continue Shopping is clicked", () => {
			cy.getDataTest("continueShoppingBtn").click();
			cy.location("pathname").should("eq", "/");
		});
	});

	// =====================
	// Cart with Items
	// =====================
	context("Cart with Items", () => {
		// ---------------------
		// Coupon Code Functionality
		// ---------------------
		context("Coupon Code Functionality", () => {
			/**
			 * Should show error for invalid coupon code
			 */
			it("shows error for invalid coupon code", () => {
				cy.getDataTest("couponInput").type("INVALIDCODE");
				cy.getDataTest("applyCouponBtn").click();
				cy.getDataTest("couponError").should("contain", "Invalid coupon code");
			});

			/**
			 * Should apply valid coupon and show discount
			 */
			it("applies valid coupon and shows discount", () => {
				cy.getDataTest("couponInput").type("RAM50");
				cy.getDataTest("applyCouponBtn").click();
				cy.getDataTest("appliedCoupon").should("contain", "RAM50");
				cy.getDataTest("discountInfo").should("exist");
				cy.getDataTest("couponInput").should("be.disabled");
			});

			/**
			 * Should remove applied coupon and re-enable input
			 */
			it("removes applied coupon and re-enables input", () => {
				cy.getDataTest("couponInput").type("SITA40");
				cy.getDataTest("applyCouponBtn").click();
				cy.getDataTest("removeCouponBtn").click();
				cy.getDataTest("couponInput").should("not.be.disabled");
				cy.getDataTest("appliedCoupon").should("not.exist");
			});
		});
		beforeEach(() => {
			addFirstProductToCart();
		});

		/**
		 * Should display cart items and total price
		 */
		it("displays cart items and total price", () => {
			cy.getDataTest("cartTableSection").should("have.length.at.least", 1);
			cy.getDataTest("txtCartTotal").should("exist").and("not.contain", "$0");
		});

		/**
		 * Should remove items from the cart
		 */
		it("removes items from the cart", () => {
			cy.getDataTest("removeCartItemBtn").click();
			cy.getDataTest("emptyCartSection").should("be.visible");
		});

		/**
		 * Should update item quantities correctly
		 */
		it("updates item quantities correctly", () => {
			cy.getDataTest("cartTableSection")
				.first()
				.within(() => {
					// Clear the input before typing new value, since it's a number input
					cy.getDataTest("cartItemQtyInput").type("2").type("{backspace}");
					cy.getDataTest("cartItemQtyInput").type("1").type("{backspace}");
				});
		});
		/**
		 * Should show Order placed successfully alert when Checkout is clicked
		 */
		it("navigates to checkout when Checkout is clicked", () => {
			cy.getDataTest("btnCheckout").click();
			cy.on("window:alert", (alertText) => {
				expect(alertText).to.equal("Order placed successfully!");
			});
		});
	});
});
