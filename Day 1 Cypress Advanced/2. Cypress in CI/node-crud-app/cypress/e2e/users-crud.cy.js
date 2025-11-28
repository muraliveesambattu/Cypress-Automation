describe('Users CRUD Flow', () => {
  it('loads the home page', () => {
    cy.visit('/'); // baseUrl + '/'
    cy.contains('Simple CRUD App (Frontend)').should('be.visible');
    cy.contains('Create User').should('be.visible');
  });

  it('creates a new user and shows it in the list', () => {
    cy.visit('/');

    const random = Date.now();
    const name = `Test User ${random}`;
    const email = `test${random}@example.com`;

    // Fill form
    cy.get('#name').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.contains('button', 'Create').click();

    // Assert it appears in the list
    cy.contains('.user-card', name).should('be.visible');
    cy.contains('.user-card', email).should('be.visible');
  });

  it('deletes a user from the list', () => {
    cy.visit('/');

    const random = Date.now();
    const name = `Delete User ${random}`;
    const email = `delete${random}@example.com`;

    // First create
    cy.get('#name').clear().type(name);
    cy.get('#email').clear().type(email);
    cy.contains('button', 'Create').click();

    // Ensure created
    cy.contains('.user-card', name)
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Delete').click();
      });

    // After delete, that user card should not exist
    cy.contains('.user-card', name).should('not.exist');
  });
});
