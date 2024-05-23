const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://www.acehardware.com",
  },
  env: {
    brand: "Milwaukee",
    department: "tools"
  }
});
