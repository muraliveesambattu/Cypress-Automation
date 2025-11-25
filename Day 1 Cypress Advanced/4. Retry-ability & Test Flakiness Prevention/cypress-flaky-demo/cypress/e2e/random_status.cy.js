// cypress/e2e/random_status.cy.js

// describe('Random status API - retries & timeouts', () => {
//   // ❌ BAD: This test is truly flaky (depends on random backend behavior)
//   it('naive test: sometimes passes, sometimes fails', () => {
//     cy.visit('/');

//     cy.get('[data-testid="check-status-btn"]').click();

//     // We expect success message, but API may fail randomly
//     cy.get('[data-testid="status-message"]').should('contain', 'Sometimes I pass');
//   });
// });

// cypress/e2e/random_status.cy.js

describe('Random status API - retries & timeouts', () => {
  it('stable test: stub the API to always succeed', () => {
    // 1. Stub /api/random-status to always return success
    cy.intercept('GET', '/api/random-status', {
      statusCode: 200,
      body: { status: 'ok', message: 'Sometimes I pass' },
    }).as('randomStatus');

    cy.visit('/');

    cy.get('[data-testid="check-status-btn"]').click();

    // 2. Wait for stubbed call (ensures timing is handled)
    cy.wait('@randomStatus');

    // 3. Assert on message (Cypress retries this until timeout)
    cy.get('[data-testid="status-message"]', { timeout: 10000 }) // 10s
      .should('contain', 'Sometimes I pass');
  });
});

