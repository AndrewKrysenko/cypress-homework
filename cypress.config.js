const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1470,
  viewportHeight: 956,

  e2e: {
    baseUrl: "https://qauto.forstudy.space",
    //baseUrl: "https://google.com",

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
