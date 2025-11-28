const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'YOUR_PROJECT_ID_HERE', // Replace with your Cypress Cloud project ID
  e2e: {
    baseUrl: 'http://localhost:4000',
    setupNodeEvents(on, config) {
      // you can add tasks/plugins here later
      return config;
    },
  },
});

