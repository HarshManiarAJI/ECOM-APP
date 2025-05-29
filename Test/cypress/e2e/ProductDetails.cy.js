describe("Check Products Page Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });
it("Check Product Details Page", () => {
    cy.getDataTest("productCard").first().click();
    cy.location("pathname").should("eq", "/product-details");
    cy.location("search").should("include", "id=1");
    cy.getDataTest("txtProductName").should("be.visible");
    cy.getDataTest("txtProductPrice").should("be.visible");
    cy.getDataTest("txtProductDescription").should("be.visible");
    cy.getDataTest("btnAddToCart").should("be.visible").click();
  });
});