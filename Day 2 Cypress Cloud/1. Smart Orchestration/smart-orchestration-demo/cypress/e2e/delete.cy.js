describe('Delete Items', () => {
  it('deletes an existing item', () => {
    cy.request('POST', '/api/items', { name: 'Item C' }).then((res) => {
      const id = res.body.id;

      cy.request('DELETE', `/api/items/${id}`)
        .its('status')
        .should('eq', 204);
    });
  });
});

