const { defineConfig } = require("cypress");
const axios = require("axios");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        async createJiraTicket({ testName, error }) {
          try {
            const response = await axios.post(
              `${process.env.JIRA_BASE_URL}/rest/api/3/issue`,
              {
                fields: {
                  project: { key: process.env.JIRA_PROJECT_KEY },
                  summary: `❌ Test Failed: ${testName}`,
                  description: `The test **${testName}** failed.\n\nError:\n${error}`,
                  issuetype: { name: "Bug" },
                },
              },
              {
                auth: {
                  username: process.env.JIRA_EMAIL,
                  password: process.env.JIRA_TOKEN,
                },
                headers: { "Content-Type": "application/json" },
              }
            );
            return response.data;
          } catch (err) {
            console.error("JIRA ticket creation failed:", err);
            return null;
          }
        },
      });

      return config;
    },
  },
});

