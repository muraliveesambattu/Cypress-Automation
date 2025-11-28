describe('Update Items', () => {
  it('updates an existing item', () => {
    cy.request('POST', '/api/items', { name: 'Item B' }).then((res) => {
      const id = res.body.id;

      cy.request('PUT', `/api/items/${id}`, { name: 'Item B Updated' })
        .its('status')
        .should('eq', 200);
    });
  });
});

