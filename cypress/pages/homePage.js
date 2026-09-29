import BasePage, { BaseModal } from './basePage';

// ---------- Модалка Log in ----------
class SignInModal extends BaseModal {
  constructor() {
    super('app-signin-modal');
  }

  get emailInput() {
    return this.modal.find('#signinEmail');
  }

  get passwordInput() {
    return this.modal.find('#signinPassword');
  }

  get rememberMeCheckbox() {
    return this.modal.find('#remember');
  }

  get forgotPasswordButton() {
    return this.modal.contains('button', 'Forgot password');
  }

  get registrationButton() {
    return this.modal.find('.modal-footer').contains('button', 'Registration');
  }

  get loginButton() {
    return this.modal.find('.modal-footer .btn-primary');
  }

  fill({ email, password, rememberMe = false }) {
    if (email !== undefined) this.emailInput.clear().type(email);
    if (password !== undefined) this.passwordInput.clear().type(password, { log: false });
    if (rememberMe) this.rememberMeCheckbox.check();
  }

  login(credentials) {
    this.fill(credentials);
    this.loginButton.click();
  }

  openRegistration() {
    this.registrationButton.click();
  }
}

// ---------- Модалка Registration ----------
class SignUpModal extends BaseModal {
  constructor() {
    super('app-signup-modal');
  }

  get nameInput() {
    return this.modal.find('#signupName');
  }

  get lastNameInput() {
    return this.modal.find('#signupLastName');
  }

  get emailInput() {
    return this.modal.find('#signupEmail');
  }

  get passwordInput() {
    return this.modal.find('#signupPassword');
  }

  get repeatPasswordInput() {
    return this.modal.find('#signupRepeatPassword');
  }

  get registerButton() {
    return this.modal.find('.modal-footer .btn-primary');
  }

  fill({ name, lastName, email, password, repeatPassword = password }) {
    if (name !== undefined) this.nameInput.clear().type(name);
    if (lastName !== undefined) this.lastNameInput.clear().type(lastName);
    if (email !== undefined) this.emailInput.clear().type(email);
    if (password !== undefined) this.passwordInput.clear().type(password, { log: false });
    if (repeatPassword !== undefined) {
      this.repeatPasswordInput.clear().type(repeatPassword, { log: false });
    }
  }

  register(user) {
    this.fill(user);
    this.registerButton.click();
  }
}

// ---------- Головна сторінка (гість) ----------
class HomePage extends BasePage {
  constructor() {
    super('/');
  }

  get heroTitle() {
    return cy.get('.hero-descriptor_title');
  }

  get heroSignUpButton() {
    return cy.get('.hero-descriptor_btn');
  }

  get aboutSection() {
    return cy.get('#aboutSection');
  }

  get contactsSection() {
    return cy.get('#contactsSection');
  }

  get socialLinks() {
    return cy.get('.contacts_socials .socials_link');
  }

  get siteLink() {
    return cy.get('.contacts_link.display-4');
  }

  get supportEmailLink() {
    return cy.get('.contacts_link.h4');
  }

  openSignIn() {
    this.header.signInButton.click();
  }

  openSignUp() {
    this.heroSignUpButton.click();
  }
}

export const homePage = new HomePage();
export const signInModal = new SignInModal();
export const signUpModal = new SignUpModal();
