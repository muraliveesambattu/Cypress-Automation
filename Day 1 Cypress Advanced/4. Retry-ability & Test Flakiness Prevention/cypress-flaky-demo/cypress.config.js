const { defineConfig } = require("cypress");

module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    retries: {
      runMode: 2,
      openMode: 0,
    },
    defaultCommandTimeout: 8000, // 8s – more generous for slower UI
  },
};
