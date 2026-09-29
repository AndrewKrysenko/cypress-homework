import BasePage, { BaseModal } from './basePage';
import { addExpenseModal } from './fuelExpensesPage';

// ---------- Спільна форма авто (Add / Edit мають однакові поля й id) ----------
class CarFormModal extends BaseModal {
  get brandSelect() {
    return this.modal.find('#addCarBrand');
  }

  get modelSelect() {
    return this.modal.find('#addCarModel');
  }

  get mileageInput() {
    return this.modal.find('#addCarMileage');
  }

  get cancelButton() {
    return this.modal.find('.modal-footer .btn-secondary');
  }

  get submitButton() {
    return this.modal.find('.modal-footer .btn-primary');
  }

  // brand / model — за текстом ('BMW', 'X5'), бо value має вигляд "0: 1"
  // Список моделей підвантажується після вибору бренду
  fill({ brand, model, mileage }) {
    if (brand !== undefined) this.brandSelect.select(brand);
    if (model !== undefined) this.modelSelect.select(model);
    if (mileage !== undefined) this.mileageInput.clear().type(mileage);
  }

  cancel() {
    this.cancelButton.click();
  }
}

// ---------- Модалка Add a car ----------
class AddCarModal extends CarFormModal {
  constructor() {
    super('app-add-car-modal');
  }

  get addButton() {
    return this.submitButton;
  }

  addCar(data) {
    this.fill(data);
    this.addButton.click();
  }
}

// ---------- Модалка Edit a car ----------
class EditCarModal extends CarFormModal {
  constructor() {
    super('app-edit-car-modal');
  }

  get createdAtInput() {
    return this.modal.find('#carCreationDate');
  }

  get datepickerToggle() {
    return this.modal.find('.date-picker-toggle');
  }

  get removeCarButton() {
    return this.modal.find('.modal-footer .btn-outline-danger');
  }

  get saveButton() {
    return this.submitButton;
  }

  save(data) {
    this.fill(data);
    if (data.createdAt !== undefined) this.createdAtInput.clear().type(data.createdAt);
    this.saveButton.click();
  }

  openRemoveCar() {
    this.removeCarButton.click();
  }
}

// ---------- Модалка Remove car ----------
class RemoveCarModal extends BaseModal {
  constructor() {
    super('app-remove-car-modal');
  }

  get message() {
    return this.modal.find('.modal-body p').first();
  }

  get warning() {
    return this.modal.find('.modal-body .text-danger');
  }

  get cancelButton() {
    return this.modal.find('.modal-footer .btn-secondary');
  }

  get removeButton() {
    return this.modal.find('.modal-footer .btn-danger');
  }

  confirm() {
    this.removeButton.click();
  }

  cancel() {
    this.cancelButton.click();
  }
}

export const addCarModal = new AddCarModal();
export const editCarModal = new EditCarModal();
export const removeCarModal = new RemoveCarModal();

// ---------- Картка авто в гаражі ----------
class CarCard {
  constructor(name) {
    this.name = name; // напр. 'Audi TT'
  }

  get root() {
    return cy.contains('.car-item', this.name);
  }

  get title() {
    return this.root.find('.car_name');
  }

  get logo() {
    return this.root.find('.car-logo_img');
  }

  get editButton() {
    return this.root.find('.car_edit');
  }

  get addExpenseButton() {
    return this.root.find('.car_add-expense');
  }

  get mileageUpdateInfo() {
    return this.root.find('.car_update-mileage');
  }

  // Поточний пробіг перевіряти через .should('have.value', ...)
  get mileageInput() {
    return this.root.find('.update-mileage-form_input');
  }

  get updateMileageButton() {
    return this.root.find('.update-mileage-form_submit');
  }

  updateMileage(value) {
    this.mileageInput.clear().type(value);
    this.updateMileageButton.click();
  }
}

// ---------- Сторінка Garage ----------
class GaragePage extends BasePage {
  constructor() {
    super('/panel/garage');
  }

  get heading() {
    return cy.get('app-garage h1');
  }

  get addCarButton() {
    return cy.get('app-garage').contains('button', 'Add car');
  }

  get emptyMessage() {
    return cy.get('app-garage .panel-empty_message');
  }

  get carItems() {
    return cy.get('.car-list .car-item');
  }

  car(name) {
    return new CarCard(name);
  }

  openAddCar() {
    this.addCarButton.click();
  }

  addCar(data) {
    this.openAddCar();
    addCarModal.addCar(data);
  }

  editCar(name, data) {
    this.car(name).editButton.click();
    editCarModal.save(data);
  }

  removeCar(name) {
    this.car(name).editButton.click();
    editCarModal.openRemoveCar();
    removeCarModal.confirm();
  }

  addExpenseForCar(name, data) {
    this.car(name).addExpenseButton.click();
    addExpenseModal.addExpense(data);
  }
}

export const garagePage = new GaragePage();
