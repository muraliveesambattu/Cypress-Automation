// cypress/e2e/users.cy.js

describe('Users page - dynamic elements & race conditions', () => {
  // ❌ BAD / FLAKY VERSION
  it('naive test: loads users (flaky)', () => {
    cy.visit('/');

    cy.get('[data-testid="load-users-btn"]').click();

    // Immediately assert list length (no wait for API or spinner)
    cy.get('[data-testid="user-item"]').should('have.length', 3);
  });

  // ✅ GOOD / STABLE VERSION
  it('stable test: waits for API + spinner to finish', () => {
    cy.intercept('GET', '/api/users').as('getUsers');

    cy.visit('/');

    cy.get('[data-testid="load-users-btn"]').click();

    // 1. Wait for API to finish (no race condition)
    cy.wait('@getUsers');

    // 2. Ensure spinner disappears (UI settled)
    cy.get('[data-testid="spinner"]').should('not.be.visible');

    // 3. Now assert users list
    cy.get('[data-testid="user-item"]').should('have.length', 3);
  });
});
