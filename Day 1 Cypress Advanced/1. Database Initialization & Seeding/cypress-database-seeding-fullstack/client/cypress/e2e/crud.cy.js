const seedItems = [
  { name: "Seed Alpha", description: "First seeded record" },
  { name: "Seed Beta", description: "Second seeded record" },
];

const resetDatabase = () => {
  cy.request("POST", `${Cypress.env("apiUrl")}/test/reset`, {
    items: seedItems,
  });
};

describe("CRUD App", () => {
  beforeEach(() => {
    resetDatabase();
    cy.visit("/");
  });

  it("creates, reads, updates, and deletes an item", () => {
    cy.get("tbody tr").should("have.length", seedItems.length);

    cy.get('input[name="name"]').clear().type("New User");
    cy.get('input[name="description"]').clear().type("New Description");
    cy.contains("button", "Create User").click();

    cy.get("tbody tr").should("have.length", seedItems.length + 1);
    cy.contains("tr", "New User").within(() => {
      cy.contains("td", "New Description");
    });

    cy.contains("tr", "New User").within(() => {
      cy.contains("Edit User").click();
    });

    cy.get('input[name="name"]').should("have.value", "New User");

    cy.get('input[name="name"]').clear().type("Updated User");
    cy.get('input[name="description"]')
      .clear()
      .type("Updated Description");
    cy.contains("button", "Update User").click();

    cy.contains("td", "Updated User").should("exist");
    cy.contains("tr", "Updated User").within(() => {
      cy.contains("td", "Updated Description");
    });

    cy.contains("tr", "Updated User").within(() => {
      cy.contains("Delete User").click();
    });

    cy.contains("td", "Updated User").should("not.exist");
    cy.get("tbody tr").should("have.length", seedItems.length);
  });
});

