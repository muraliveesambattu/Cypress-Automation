describe('Create & Read Items', () => {
  it('creates an item', () => {
    cy.request('POST', '/api/items', { name: 'Item A' })
      .its('status')
      .should('eq', 201);
  });

  it('lists items', () => {
    cy.request('GET', '/api/items')
      .its('status')
      .should('eq', 200);
  });
});

