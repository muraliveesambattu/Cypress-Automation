describe('template spec', () => {
  beforeEach(() => {
    cy.visit('https://www.amazon.in/');
    cy.injectAxe();
  })
  it('passes', () => {
    cy.checkA11y();
  })
})