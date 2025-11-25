// cypress/e2e/login.js
const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

let response; // will hold the response from cy.request

Given("the API is running", () => {
  cy.request("GET", "/health")
    .its("status")
    .should("eq", 200);
});

When(
  "I login with username {string} and password {string}",
  (username, password) => {
    cy.request({
      method: "POST",
      url: "/login",
      failOnStatusCode: false, // allow 4xx/5xx, we'll assert manually
      body: { username, password },
    }).then((res) => {
      response = res;
    });
  }
);

Then("I should get a {int} response", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});

Then("the response should indicate success", () => {
  expect(response.body).to.have.property("success", true);
});

Then("the response should indicate failure", () => {
  expect(response.body).to.have.property("success", false);
});
