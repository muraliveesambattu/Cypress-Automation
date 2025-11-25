// cypress/e2e/rest_api.cy.js

const API_URL = "http://localhost:3000";

describe("REST API Testing with Cypress", () => {
  // Make sure your API server is running:
  // npm start -> REST API running at http://localhost:3000

  it("GET /users - should return list of users", () => {
    cy.request(`${API_URL}/users`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0]).to.have.keys(["id", "name", "age"]);
    });
  });

  it("POST /users - should create a new user (validate request & response)", () => {
    const newUser = { name: "Charlie", age: 28 };

    cy.request("POST", `${API_URL}/users`, newUser).then((response) => {
      // ✅ Status code assertion
      expect(response.status).to.eq(201);

      // ✅ Response payload validation
      expect(response.body).to.include({
        name: "Charlie",
        age: 28,
      });
      expect(response.body).to.have.property("id");

      // ✅ Optional: validate that server echoes what we sent
      expect(response.body.name).to.eq(newUser.name);
      expect(response.body.age).to.eq(newUser.age);
    });
  });

  it("POST /users - should return 400 for invalid payload", () => {
    const invalidUser = { name: "No Age" }; // age missing

    cy.request({
      method: "POST",
      url: `${API_URL}/users`,
      body: invalidUser,
      failOnStatusCode: false, // We expect failure
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("error");
    });
  });

  it("PUT /users/:id - should update an existing user", () => {
    const updatedData = { name: "Alice Updated", age: 26 };

    // First get an existing user
    cy.request(`${API_URL}/users`)
      .its("body")
      .then((users) => {
        const userId = users[0].id;

        cy.request("PUT", `${API_URL}/users/${userId}`, updatedData).then(
          (response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.include(updatedData);
            expect(response.body.id).to.eq(userId);
          }
        );
      });
  });

  it("PUT /users/:id - should return 404 for non-existing user", () => {
    cy.request({
      method: "PUT",
      url: `${API_URL}/users/99999`,
      body: { name: "Does Not Exist" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("error", "User not found");
    });
  });

  it("DELETE /users/:id - should delete a user", () => {
    // Create a user first
    cy.request("POST", `${API_URL}/users`, {
      name: "To Delete",
      age: 20,
    })
      .its("body")
      .then((user) => {
        const userId = user.id;

        // Delete the user
        cy.request("DELETE", `${API_URL}/users/${userId}`).then((response) => {
          expect(response.status).to.eq(204);
        });

        // Verify user is gone
        cy.request(`${API_URL}/users`)
          .its("body")
          .then((users) => {
            const exists = users.some((u) => u.id === userId);
            expect(exists).to.be.false;
          });
      });
  });

  it("DELETE /users/:id - should return 404 for non-existing user", () => {
    cy.request({
      method: "DELETE",
      url: `${API_URL}/users/99999`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property("error", "User not found");
    });
  });
});

describe("Mocking REST API with cy.intercept()", () => {
  it("should mock GET /users and show mocked data in UI", () => {
    // Mock /users response BEFORE visiting the page
    cy.intercept("GET", `${API_URL}/users`, {
      statusCode: 200,
      body: [
        { id: 100, name: "Mock User 1", age: 99 },
        { id: 101, name: "Mock User 2", age: 88 },
      ],
    }).as("getUsersMock");

    // Visit the app (served by Express)
    cy.visit(`${API_URL}/`);

    cy.contains("button", "Load Users").click();

    // Wait for intercepted call
    cy.wait("@getUsersMock");

    // Validate UI using mocked data
    cy.get("#users-list li").should("have.length", 2);
    cy.get("#users-list li").first().should("contain.text", "Mock User 1");
  });
});
