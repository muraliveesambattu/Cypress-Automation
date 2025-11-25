// cypress.config.js
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

// this function will be used in e2e.setupNodeEvents
async function setupNodeEvents(on, config) {
  // register the Cucumber plugin
  await addCucumberPreprocessorPlugin(on, config);

  // tell Cypress to use esbuild for preprocessing feature + JS files
  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  return config;
}

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // our Express app
    specPattern: "cypress/e2e/**/*.feature", // look for .feature files
    setupNodeEvents,
  },
});
