describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://www.google.com/')
    cy.checkA11y();

  })
})