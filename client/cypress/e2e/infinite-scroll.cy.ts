describe('Repository Infinite Scroll', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/orgs/*/repos*', { fixture: 'repos' }).as(
      'getRepos',
    );
    cy.visit('/');
  });

  it('should load more repositories on scroll', () => {
    cy.searchRepositories('vercel');
    cy.wait('@getRepos');

    // Intercept next page request
    cy.intercept('GET', '/api/v1/orgs/*/repos*', {
      fixture: 'repos-page-2',
    }).as('getNextPage');

    // Scroll to bottom
    cy.scrollTo('bottom');
    cy.wait('@getNextPage');

    // Verify more repositories are loaded
    cy.get('tbody tr').should('have.length', 20);
  });

  it('should show end of results message', () => {
    cy.searchRepositories('vercel');
    cy.wait('@getRepos');

    // Mock empty next page
    cy.intercept('GET', '/api/v1/orgs/*/repos*', {
      body: { repos: [] },
    }).as('getEmptyPage');

    cy.scrollTo('bottom');
    cy.wait('@getEmptyPage');

    cy.findByText(/no more repositories to load/i).should('be.visible');
  });
});
