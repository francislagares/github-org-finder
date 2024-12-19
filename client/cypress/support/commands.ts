import '@testing-library/cypress/add-commands';

// Custom command to search for repositories
Cypress.Commands.add('searchRepositories', (orgName: string) => {
  cy.findByPlaceholderText('Search for repositories by organization name')
    .should('be.visible')
    .clear()
    .type(`${orgName}{enter}`);
});

// Custom command to select repository with better waiting
Cypress.Commands.add('selectRepository', (repoName: string) => {
  cy.contains('tr', repoName)
    .should('be.visible')
    .within(() => {
      cy.get('input[type="checkbox"]')
        .should('be.visible')
        .should('not.be.disabled')
        .check();
    });
});

// Custom command to delete repository with better waiting
Cypress.Commands.add('deleteRepository', (repoName: string) => {
  cy.contains('tr', repoName)
    .should('be.visible')
    .within(() => {
      cy.get('input[type="checkbox"]')
        .should('be.visible')
        .should('not.be.disabled')
        .check();
    });

  cy.findByRole('button', { name: /delete/i })
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

// Custom command to wait for toast messages
Cypress.Commands.add('waitForToast', (message: string) => {
  cy.findByRole('alert')
    .should('be.visible')
    .and('contain', message)
    .then($toast => {
      // Wait for toast to disappear to prevent overlap with next action
      cy.wrap($toast).should('not.exist', { timeout: 5000 });
    });
});

// Extend Cypress types
declare global {
  namespace Cypress {
    interface Chainable {
      searchRepositories(orgName: string): Chainable<void>;
      selectRepository(repoName: string): Chainable<void>;
      deleteRepository(repoName: string): Chainable<void>;
      waitForToast(message: string): Chainable<void>;
    }
  }
}
