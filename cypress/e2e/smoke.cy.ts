describe('Smoke Test', () => {
  it('should load the homepage', () => {
    cy.visit('/');
    cy.get('h1').should('exist');
  });

  it('should redirect to login when accessing admin without session', () => {
    cy.visit('/admin');
    cy.url().should('include', '/login');
  });
});