import { homePage } from "../pages/homePage";

const visitHomePage = () => {
  cy.env(["username", "password"]).then(({ username, password }) => {
    homePage.visit({
      auth: {
        username,
        password,
      },
    });
  });
};

describe("header buttons", () => {
  beforeEach(visitHomePage);

  it("About button exists", () => {
    homePage.header.aboutButton.should("exist");
  });

  it("Contact button exists", () => {
    homePage.header.contactsButton.should("exist");
  });

  it("Login button exists", () => {
    homePage.header.guestLoginButton.should("exist");
  });

  it("Sign In button exists", () => {
    homePage.header.signInButton.should("exist");
  });
});

describe("footer buttons and links", () => {
  beforeEach(visitHomePage);

  it("that logo-link exists", () => {
    homePage.footer.logoLink.should("exist");
  });
});