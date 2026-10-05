const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1470,
  viewportHeight: 956,

  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/reports/qauto",
    overwrite: false,
    html: true,
    json: true,
  },

  e2e: {
    baseUrl: "https://qauto.forstudy.space",

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  env: {
    // basic auth — доступ до сайту
    username: "guest",
    password: "welcome2qauto",

    // зареєстрований користувач — логін через форму Sign In
    userEmail: "andrejkrysenko@gmail.com",
    userPassword: "7!g54YpRJLLGU",
  },
});