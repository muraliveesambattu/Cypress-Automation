import { createJiraTicket } from "../support/jira";

Cypress.on("fail", (error, runnable) => {
  createJiraTicket({
    testName: runnable.fullTitle(),
    error: error.message,
  });

  throw error;
});

