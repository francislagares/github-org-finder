describe('Repository Search', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/orgs/*/repos*', { fixture: 'repos' }).as(
      'getRepos',
    );
    cy.visit('/');
  });

  it('should display the search interface correctly', () => {
    cy.findByText(/github repository search/i).should('be.visible');
    cy.findByPlaceholderText(
      'Search for repositories by organization name',
    ).should('be.visible');
  });

  it('should search for repositories and display results', () => {
    cy.searchRepositories('vercel');
    cy.wait('@getRepos');

    cy.findByRole('grid').should('be.visible');
    cy.get('tbody tr').should('have.length', 10);
  });

  it('should show loading state during search', () => {
    cy.intercept('GET', '/api/v1/orgs/*/repos*', {
      delay: 1000,
      fixture: 'repos',
    }).as('getReposDelayed');

    cy.searchRepositories('vercel');
    cy.findByText(/loading content/i).should('be.visible');
    cy.wait('@getReposDelayed');
    cy.findByText(/loading content/i).should('not.exist');
  });

  it('should handle no results gracefully', () => {
    cy.intercept('GET', '/api/v1/orgs/*/repos*', { body: { repos: [] } }).as(
      'getEmptyRepos',
    );

    cy.searchRepositories('nonexistentorg');
    cy.wait('@getEmptyRepos');

    cy.findByText(/no repositories found/i).should('be.visible');
  });
});
