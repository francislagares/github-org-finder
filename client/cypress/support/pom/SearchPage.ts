import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  private searchInput =
    'input[placeholder="Search for repositories by organization name"]';
  private searchResults = 'tbody tr';
  private loadingIndicator = '[data-testid="loading-indicator"]';

  visit() {
    cy.visit('/');
    return this;
  }

  search(orgName: string) {
    cy.get(this.searchInput)
      .should('be.visible')
      .clear()
      .type(`${orgName}{enter}`);
    return this;
  }

  waitForResults() {
    cy.get(this.loadingIndicator).should('not.exist');
    cy.get(this.searchResults).should('be.visible');
    return this;
  }

  getResultsCount() {
    return cy.get(this.searchResults).its('length');
  }
}
