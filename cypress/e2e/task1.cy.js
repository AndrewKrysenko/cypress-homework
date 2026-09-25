describe("header buttons", () => {
  beforeEach(() => {
    cy.env(["username", "password"]).then(({username, password}) => {
      cy.visit("/", {
        auth: {
          username,
          password,
        },
      });
    });
  });
  it("About button exists", () => {
    cy.contains("header button", "About").should("exist");
  });
  it(("Contact button exists"), () => {
    cy.contains("header button", "Contacts").should("exist");
  });
  it(("Login button exists"), () => {
    cy.contains("header button", "Guest log in").should("exist");
  });
  it(("Sign In button exists"), () => {
    cy.contains("header button", "Sign In").should("exist");
  });
});

describe("footer buttons and links", () => {
  beforeEach(() => {
    cy.env(["username", "password"]).then(({username, password}) => {
      cy.visit("/", {
        auth: {
          username,
          password,
        },
      });
    });
  });
  it("that logo-link exists", () => {
    cy.get("footer a").should("exist");
  });
});

