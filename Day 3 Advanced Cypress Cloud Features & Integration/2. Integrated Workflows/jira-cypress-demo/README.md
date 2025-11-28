# JIRA-Cypress Demo

This project demonstrates how to automatically create JIRA bug tickets whenever a Cypress test fails by using Cypress tasks plus the JIRA REST API.

## Setup

1. Generate a JIRA API token from Atlassian Cloud: Profile → Security → Create API Token.
2. Provide the credentials to Cypress through environment variables or your CI system:
   - `JIRA_EMAIL`
   - `JIRA_TOKEN`
   - `JIRA_BASE_URL`
   - `JIRA_PROJECT_KEY`
3. Install dependencies and run the tests:

```bash
npm install
npm run cypress:open
```

Whenever a test fails, Cypress will call the `createJiraTicket` task defined in `cypress.config.js`, which raises a JIRA issue that contains the failing test name and error message.

