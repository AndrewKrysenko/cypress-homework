// Точний збіг тексту для cy.contains (щоб "5" не зачепило "X5")
export const exact = (text) =>
  new RegExp(`^\\s*${Cypress._.escapeRegExp(String(text))}\\s*$`);

// ---------- Базова модалка ----------
// Кожна модалка має свій кореневий тег (app-signin-modal, app-add-car-modal ...),
// тому однакові id в різних модалках не плутаються.
export class BaseModal {
  constructor(rootSelector) {
    this.rootSelector = rootSelector;
  }

  get modal() {
    return cy.get(this.rootSelector);
  }

  get title() {
    return this.modal.find('.modal-title');
  }

  get closeButton() {
    return this.modal.find('button.close');
  }

  close() {
    this.closeButton.click();
  }

  shouldBeOpened() {
    this.modal.should('be.visible');
  }

  shouldBeClosed() {
    cy.get(this.rootSelector).should('not.exist');
  }
}

// ---------- Хедер ----------
class Header {
  get logo() {
    return cy.get('.header_logo');
  }

  get nav() {
    return cy.get('.header_nav');
  }

  // Гостьовий режим
  get homeLink() {
    return this.nav.contains('a', 'Home');
  }

  get aboutButton() {
    return this.nav.contains('button', 'About');
  }

  get contactsButton() {
    return this.nav.contains('button', 'Contacts');
  }

  get guestLoginButton() {
    return cy.get('.header-link.-guest');
  }

  get signInButton() {
    return cy.get('.header_signin');
  }

  // Після логіну
  get garageLink() {
    return this.nav.contains('a', 'Garage');
  }

  get fuelExpensesLink() {
    return this.nav.contains('a', 'Fuel expenses');
  }

  get instructionsLink() {
    return this.nav.contains('a', 'Instructions');
  }

  openSignIn() {
    this.signInButton.click();
  }

  loginAsGuest() {
    this.guestLoginButton.click();
  }
}

// ---------- Дропдаун "My profile" ----------
class UserNavDropdown {
  get toggle() {
    return cy.get('#userNavDropdown');
  }

  get menu() {
    return cy.get('.user-nav_menu');
  }

  open() {
    this.toggle.click();
  }

  item(name) {
    return this.menu.contains('.user-nav_link', exact(name));
  }

  // name: 'Garage' | 'Fuel expenses' | 'Instructions' | 'Profile' | 'Settings' | 'Logout'
  goTo(name) {
    this.open();
    this.item(name).click();
  }

  logout() {
    this.goTo('Logout');
  }
}

// ---------- Сайдбар ----------
// Видно тільки при ширині >= 992px (у Cypress за замовчуванням 1000px — ок)
class Sidebar {
  get root() {
    return cy.get('.sidebar');
  }

  link(name) {
    return this.root.contains('.sidebar_btn', name);
  }

  // name: 'Garage' | 'Fuel expenses' | 'Instructions' | 'Profile' | 'Settings' | 'Log out'
  goTo(name) {
    this.link(name).click();
  }

  logout() {
    this.goTo('Log out');
  }
}

// ---------- Алерт (спільний для всього застосунку) ----------
class Alert {
  get alerts() {
    return cy.get('.alert-list .alert');
  }

  get success() {
    return cy.get('.alert-list .alert-success');
  }

  get danger() {
    return cy.get('.alert-list .alert-danger');
  }

  shouldHaveText(text) {
    this.alerts.should('contain.text', text);
  }
}

// ---------- Футер ----------
class Footer {
  get root() {
    return cy.get('footer');
  }

  get logoLink() {
    return cy.get('footer .footer_logo');
  }
}

// ---------- Базова сторінка ----------
export default class BasePage {
  constructor(url) {
    this.url = url;
    this.header = new Header();
    this.userNav = new UserNavDropdown();
    this.sidebar = new Sidebar();
    this.alert = new Alert();
    this.footer = new Footer();
  }

  visit(options = {}) {
    cy.visit(this.url, options);
  }

  shouldBeOpened() {
    cy.url().should('include', this.url);
  }
}