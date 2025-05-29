describe("Check Products Page Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
     cy.restoreLocalStorage();
  });
  afterEach(() => {
      cy.saveLocalStorage();

  });
  it("Check The Header is containing title or not", () => {
    cy.getDataTest("navbar")
      .should("exist")
      .contains(/E-Commerce Store/i);
  });
  it("Check Login Flow", () => {
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
    // Check if the user is redirected to the home page after login
    cy.location("pathname").should("include", "/");
    cy.getDataTest("welcomeMessage")
      .should("exist")
      .contains(/Welcome, testUser/i);

    cy.getDataTest("btnLogout").should("exist");
    cy.getDataTest("btnFavorites").should("exist");
  });
  it("Check Home Page", () => {
    cy.getDataTest("secFilters").should("exist");
    cy.getDataTest("selCategory").should("exist");
    cy.getDataTest("selSort").should("exist");
    cy.getDataTest("inpSearch").should("exist");
    cy.wait(2000); // Wait for the products to load
    cy.getDataTest("secProducts").should("exist");

    cy.getDataTest("productCard").should("have.length.at.least", 1);

    cy.getDataTest("secProductsPagination").should("exist");

    // Go to page 2
    cy.getDataTest("secProductsPagination").contains("2").click();

    cy.wait(1000);
    cy.getDataTest("productCard").should("have.length.at.least", 1);
  });

  
});
