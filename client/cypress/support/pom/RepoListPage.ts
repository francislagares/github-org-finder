import { BasePage } from './BasePage';

export class RepositoryListPage extends BasePage {
  private repoRow = (name: string) => `tr:contains("${name}")`;
  private checkbox = 'input[type="checkbox"]';
  private deleteButton = '[aria-label="Delete"]';
  private expandButton = 'button[aria-label="Expand row"]';
  private branchesTable = '[data-testid="branches-table"]';

  selectRepository(name: string) {
    cy.get(this.repoRow(name))
      .should('be.visible')
      .within(() => {
        cy.get(this.checkbox)
          .should('be.visible')
          .should('not.be.disabled')
          .check();
      });
    return this;
  }

  deleteRepository(name: string) {
    this.selectRepository(name);
    cy.get(this.deleteButton)
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    return this;
  }

  expandRepository(name: string) {
    cy.get(this.repoRow(name)).find(this.expandButton).click();
    cy.get(this.branchesTable).should('be.visible');
    return this;
  }

  verifyRepositoryDetails(
    name: string,
    details: { language: string; branches: number },
  ) {
    cy.get(this.repoRow(name)).within(() => {
      cy.contains(details.language).should('be.visible');
      cy.contains(details.branches.toString()).should('be.visible');
    });
    return this;
  }
}
