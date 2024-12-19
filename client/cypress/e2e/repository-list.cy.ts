import { ReposFixture } from '../support/types/repos';

describe('Repository List Display', () => {
  let reposData: ReposFixture;

  before(() => {
    cy.fixture('repos.json').then((data: ReposFixture) => {
      reposData = data;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/v1/orgs/*/repos*', { fixture: 'repos' }).as(
      'getRepos',
    );
    cy.visit('/');
    cy.searchRepositories('vercel');
    cy.wait('@getRepos');
  });

  it('should load and display all 10 repositories', () => {
    // Verify total number of repositories
    cy.get('tbody tr').should('have.length', 10);

    // Verify each repository's data is displayed correctly
    reposData.repos.forEach(repo => {
      cy.contains('tr', repo.name).within(() => {
        cy.contains(repo.name).should('be.visible');
        cy.contains(repo.language).should('be.visible');
        cy.contains(repo.branches.toString()).should('be.visible');
        cy.contains(repo.url).should('be.visible');
      });
    });
  });

  it('should maintain layout integrity with 10 items', () => {
    // Check table container dimensions
    cy.findByRole('grid').should('be.visible');

    // Verify row heights are consistent
    cy.get('tbody tr').then($rows => {
      const heights = [...$rows].map(row => row.offsetHeight);
      const allEqual = heights.every(h => h === heights[0]);
      expect(allEqual).to.be.true;
    });
  });
});
