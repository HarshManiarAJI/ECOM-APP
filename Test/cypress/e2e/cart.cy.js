describe("Check Products Page Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
    cy.restoreLocalStorage();
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });
  it("Login process for add to cart feature test", () => {
    cy.getDataTest("btnLogout").should("not.exist");
    cy.getDataTest("btnFavorites").should("not.exist");

    cy.getDataTest("btnLogin").should("exist").click();
    cy.location("pathname").should("include", "/login");
    cy.getDataTest("loginForm").should("exist");
    // Ensure the username, password, and login button are inside the form
    cy.getDataTest("loginForm").within(() => {
      cy.getDataTest("inpUsername").should("exist").type("testUser");
      cy.getDataTest("inpPassword")
        .should("exist")
        .type("harsh@securePassword_12345678");
      cy.getDataTest("btnLogin").should("exist").click();
    });




    // cart flow


    cy.getDataTest("secProducts").should("exist");

    cy.getDataTest("productCard").should("have.length.at.least", 6);
    cy.getDataTest("productCard")
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
    cy.location("pathname").should("include", "/cart");
    // cy.findByLabelText(/Shopping cart/i, { timeout: 7000 }).should("exist");
    cy.getDataTest("secCartPage").should("exist").contains(/Shopping Cart/i);

  });

//   it("Check the cart flow", () => {
//     cy.getDataTest("secProducts").should("exist");

//     cy.getDataTest("productCard").should("have.length.at.least", 6);
//     cy.getDataTest("productCard")
//       .first()
//       .within(() => {
//         cy.getDataTest("btnAddToCart").should("exist").click();
//         cy.getDataTest("btnAddToCart").should("not.exist");
//         cy.getDataTest("btnRemoveFromCart").should("exist");
//         cy.getDataTest("btnViewInCart").should("exist");

//         cy.getDataTest("btnIncreaseQuantity").should("exist").click();
//         cy.getDataTest("txtCartItemQuantity").should("contain", "2");
//         cy.getDataTest("btnDecreaseQuantity").should("exist").click();
//         cy.getDataTest("txtCartItemQuantity").should("contain", "1");
//         cy.getDataTest("btnViewInCart").click();
//       });
//     cy.location("pathname").should("include", "/cart");
//     cy.findByLabelText(/Shopping cart/i, { timeout: 7000 }).should("exist");
//   });
});
