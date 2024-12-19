export abstract class BasePage {
  protected toast = '[role="alert"]';

  waitForToast(message: string) {
    cy.get(this.toast)
      .should('be.visible')
      .and('contain', message)
      .then($toast => {
        cy.wrap($toast).should('not.exist', { timeout: 5000 });
      });
    return this;
  }

  waitForApiResponse(alias: string) {
    cy.wait(alias);
    return this;
  }
}
