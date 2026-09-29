import BasePage, { exact } from './basePage';

// ---------- Сторінка Instructions ----------
class InstructionsPage extends BasePage {
  constructor() {
    super('/panel/instructions');
  }

  get heading() {
    return cy.get('app-instructions h1');
  }

  // Brand і Model — кастомні дропдауни, не <select>
  get brandToggle() {
    return cy.get('#brandSelectDropdown');
  }

  get modelToggle() {
    return cy.get('#modelSelectDropdown');
  }

  get searchButton() {
    return cy.get('.instructions-search-controls_search');
  }

  get instructionItems() {
    return cy.get('.instruction-list .instruction-list_item');
  }

  get instructionTitles() {
    return cy.get('.instruction-link_description');
  }

  get downloadLinks() {
    return cy.get('.instruction-link_download');
  }

  get pagination() {
    return cy.get('.instructions_pagination');
  }

  instructionByTitle(title) {
    return cy.contains('.instruction-list_item', title);
  }

  // Активний пункт має клас disabled, тому клікаємо лише якщо значення інше
  selectFromDropdown(toggle, itemSelector, value) {
    toggle.then(($btn) => {
      if ($btn.text().trim() !== value) {
        cy.wrap($btn).click();
        cy.contains(itemSelector, exact(value)).click();
      }
    });
  }

  selectBrand(brand) {
    this.selectFromDropdown(this.brandToggle, '.brand-select-dropdown_item', brand);
  }

  selectModel(model) {
    this.selectFromDropdown(this.modelToggle, '.model-select-dropdown_item', model);
  }

  search(brand, model) {
    this.selectBrand(brand);
    this.selectModel(model);
    this.searchButton.click();
  }

  // Посилання відкриваються в новій вкладці (target="_blank"),
  // тому перевіряємо href, а не клікаємо
  shouldAllTitlesContain(text) {
    this.instructionTitles.each(($el) => {
      expect($el.text()).to.contain(text);
    });
  }
}

export const instructionsPage = new InstructionsPage();
