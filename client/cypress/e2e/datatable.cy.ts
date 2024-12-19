describe('DataTable', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/orgs/*/repos*', { fixture: 'repos' }).as(
      'getRepos',
    );
    cy.intercept('POST', '/api/v1/repos', { statusCode: 201, body: {} }).as(
      'createRepo',
    );
    cy.intercept('DELETE', '/api/v1/repos/*', { statusCode: 204 }).as(
      'deleteRepo',
    );

    cy.visit('/');
  });

  it.only('should load and display search form', () => {
    const heading = cy.findByText(/gitHub Repository search/i);

    heading.should('be.visible');

    const searchForm = cy
      .findByPlaceholderText('Search for repositories by organization name')
      .clear();
    searchForm.type('vercel{enter}');

    cy.wait('@getRepos');

    cy.findByRole('grid').should('be.visible');
    cy.get('tbody tr').should('have.length.at.least', 1);

    const checkbox = cy.findAllByRole('checkbox').eq(1).check();
    checkbox.should('be.checked');

    cy.findByRole('alert').should('be.visible');
  });

  it('should handle repository selection and saving', () => {});

  it('should handle repository deletion', () => {});

  it('should handle multiple repository operations', () => {});

  it('should handle error states', () => {});

  it('should maintain state after page reload', () => {});
});
