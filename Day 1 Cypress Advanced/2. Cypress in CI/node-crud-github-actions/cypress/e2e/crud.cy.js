describe("User CRUD UI", () => {
  it("loads the page and shows initial users", () => {
    cy.visit("/");

    cy.contains("User CRUD App").should("be.visible");
    cy.get("#user-list li").should("have.length.at.least", 1);
  });

  it("creates a new user via UI", () => {
    cy.visit("/");

    const name = `Test User ${Date.now()}`;
    const email = `test${Date.now()}@example.com`;

    cy.get("#name").type(name);
    cy.get("#email").type(email);
    cy.get("form#user-form button[type='submit']").click();

    cy.get("#user-list").contains(name).should("exist");
  });
});
