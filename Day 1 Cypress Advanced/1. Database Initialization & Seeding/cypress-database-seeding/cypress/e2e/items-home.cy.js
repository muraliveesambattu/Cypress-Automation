describe("Items App Home Page", () => {
  beforeEach(() => {
    cy.resetAndSeedItems();
    cy.visit("/");
  });

  it("shows seeded items", () => {
    cy.get(".item-card").should("have.length", 3);
    cy.contains("Seed Item 1").should("exist");
  });

  it("creates a new item", () => {
    cy.get("#item-name").type("New Item");
    cy.get("#item-description").type("Created from test");
    cy.get("#submit-btn").click();

    cy.contains(".message.success", "Item created successfully!");
    cy.contains(".item-name", "New Item").should("exist");
  });
  
  it("updates an item", () => {
    cy.get(".item-card").first().find(".btn-edit").click();
    cy.get("#item-name").clear().type("Updated Item");
    cy.get("#item-description").clear().type("Updated description");
    cy.get("#submit-btn").click();

    cy.contains(".message.success", "Item updated successfully!");
    cy.contains(".item-name", "Updated Item").should("exist");
  });
  it("deletes an item", () => {
    cy.get(".item-card").first().find(".btn-delete").click();
    cy.contains(".message.success", "Item deleted successfully!");
    cy.contains(".item-name", "Updated Item").should("not.exist");
  });
});
