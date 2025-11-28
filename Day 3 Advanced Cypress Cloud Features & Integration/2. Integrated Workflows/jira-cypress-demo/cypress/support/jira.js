export const createJiraTicket = (details) => {
  return cy.task("createJiraTicket", details);
};

