describe('Accessibility Tests for Form', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.injectAxe();
    })
    it('Should detect accessibility violations', () => {
        // Check for accessibility violations
        cy.checkA11y();
    });
})