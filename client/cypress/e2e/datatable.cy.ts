describe('DataTable', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/orgs/*/repos*', { fixture: 'repos' }).as(
      'getRepos',
    );
    cy.visit('/');
  });

  it('should load and display repositories', () => {
    cy.wait('@getRepos');
    cy.contains('List of Repositories').should('be.visible');
    cy.get('table').should('exist');
    cy.get('tbody tr').should('have.length.at.least', 1);
  });

  it('should handle repository selection and saving', () => {
    cy.wait('@getRepos');
    cy.intercept('POST', '/api/v1/repos/save', {
      statusCode: 200,
      body: { message: 'Repository saved successfully' },
    }).as('saveRepo');

    // Select first repository
    cy.get('tbody tr').first().find('input[type="checkbox"]').click();
    cy.wait('@saveRepo');

    // Verify success message
    cy.contains('Repository saved successfully').should('be.visible');

    // Verify checkbox remains checked
    cy.get('tbody tr')
      .first()
      .find('input[type="checkbox"]')
      .should('be.checked');
  });

  it('should handle repository deletion', () => {
    cy.wait('@getRepos');
    cy.intercept('DELETE', '/api/v1/repos/*/delete', {
      statusCode: 200,
      body: { message: 'Repository deleted successfully' },
    }).as('deleteRepo');

    // Select and delete first repository
    cy.get('tbody tr').first().find('input[type="checkbox"]').click();
    cy.contains('button', 'Delete').click();
    cy.wait('@deleteRepo');

    // Verify success message
    cy.contains('Repository deleted successfully').should('be.visible');

    // Verify row is removed or unchecked
    cy.get('tbody tr')
      .first()
      .find('input[type="checkbox"]')
      .should('not.be.checked');
  });

  it('should handle multiple repository operations', () => {
    cy.wait('@getRepos');
    cy.intercept('POST', '/api/v1/repos/save', {
      statusCode: 200,
    }).as('saveRepo');
    cy.intercept('DELETE', '/api/v1/repos/*/delete', {
      statusCode: 200,
    }).as('deleteRepo');

    // Select multiple repositories
    cy.get('tbody tr').first().find('input[type="checkbox"]').click();
    cy.wait('@saveRepo');
    cy.get('tbody tr').eq(1).find('input[type="checkbox"]').click();
    cy.wait('@saveRepo');

    // Delete selected repositories
    cy.contains('button', 'Delete').click();
    cy.wait('@deleteRepo');

    // Verify checkboxes are unchecked
    cy.get('tbody tr')
      .first()
      .find('input[type="checkbox"]')
      .should('not.be.checked');
    cy.get('tbody tr')
      .eq(1)
      .find('input[type="checkbox"]')
      .should('not.be.checked');
  });

  it('should handle error states', () => {
    cy.wait('@getRepos');
    cy.intercept('POST', '/api/v1/repos/save', {
      statusCode: 500,
      body: { message: 'Server error' },
    }).as('saveRepoError');

    // Attempt to select repository
    cy.get('tbody tr').first().find('input[type="checkbox"]').click();
    cy.wait('@saveRepoError');

    // Verify error message
    cy.contains('Server error').should('be.visible');
  });

  it('should maintain state after page reload', () => {
    cy.wait('@getRepos');
    cy.intercept('POST', '/api/v1/repos/save', {
      statusCode: 200,
    }).as('saveRepo');

    // Select repository
    cy.get('tbody tr').first().find('input[type="checkbox"]').click();
    cy.wait('@saveRepo');

    // Reload page
    cy.reload();
    cy.wait('@getRepos');

    // Verify checkbox state is preserved
    cy.get('tbody tr')
      .first()
      .find('input[type="checkbox"]')
      .should('be.checked');
  });
});
