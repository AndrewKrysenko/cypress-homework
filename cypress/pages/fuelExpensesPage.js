import BasePage, { BaseModal, exact } from './basePage';

// ---------- Спільна форма витрати (Add / Edit мають однакові поля й id) ----------
class ExpenseFormModal extends BaseModal {
  get vehicleSelect() {
    return this.modal.find('#addExpenseCar');
  }

  get reportDateInput() {
    return this.modal.find('#addExpenseDate');
  }

  get datepickerToggle() {
    return this.modal.find('.date-picker-toggle');
  }

  get mileageInput() {
    return this.modal.find('#addExpenseMileage');
  }

  get litersInput() {
    return this.modal.find('#addExpenseLiters');
  }

  get totalCostInput() {
    return this.modal.find('#addExpenseTotalCost');
  }

  get cancelButton() {
    return this.modal.find('.modal-footer .btn-secondary');
  }

  get submitButton() {
    return this.modal.find('.modal-footer .btn-primary');
  }

  // vehicle — за текстом ('Audi TT'), бо value містить id авто
  // reportDate — у форматі 'dd.mm.yyyy'
  // Mileage має бути не меншим за поточний пробіг авто
  fill({ vehicle, reportDate, mileage, liters, totalCost }) {
    if (vehicle !== undefined) this.vehicleSelect.select(vehicle);
    if (reportDate !== undefined) this.reportDateInput.clear().type(reportDate);
    if (mileage !== undefined) this.mileageInput.clear().type(mileage);
    if (liters !== undefined) this.litersInput.clear().type(liters);
    if (totalCost !== undefined) this.totalCostInput.clear().type(totalCost);
  }

  cancel() {
    this.cancelButton.click();
  }
}

// ---------- Модалка Add an expense ----------
class AddExpenseModal extends ExpenseFormModal {
  constructor() {
    super('app-add-expense-modal');
  }

  get addButton() {
    return this.submitButton;
  }

  addExpense(data) {
    this.fill(data);
    this.addButton.click();
  }
}

// ---------- Модалка Edit an expense ----------
class EditExpenseModal extends ExpenseFormModal {
  constructor() {
    super('app-edit-expense-modal');
  }

  get saveButton() {
    return this.submitButton;
  }

  save(data) {
    this.fill(data);
    this.saveButton.click();
  }
}

// ---------- Модалка Remove entry ----------
class DeleteExpenseModal extends BaseModal {
  constructor() {
    super('app-delete-expense-modal');
  }

  get message() {
    return this.modal.find('.modal-body p');
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

export const addExpenseModal = new AddExpenseModal();
export const editExpenseModal = new EditExpenseModal();
export const deleteExpenseModal = new DeleteExpenseModal();

// ---------- Сторінка Fuel expenses ----------
class FuelExpensesPage extends BasePage {
  constructor() {
    super('/panel/expenses');
  }

  get heading() {
    return cy.get('app-fuel-expenses h1');
  }

  get carSelectToggle() {
    return cy.get('#carSelectDropdown');
  }

  get addExpenseButton() {
    return cy.get('app-fuel-expenses').contains('button', 'Add an expense');
  }

  get table() {
    return cy.get('.expenses_table');
  }

  get rows() {
    return cy.get('.expenses_table tbody tr');
  }

  get emptyMessage() {
    return cy.get('app-fuel-expenses .panel-empty_message');
  }

  row(index = 0) {
    return this.rows.eq(index);
  }

  // Колонки: 0 Date, 1 Mileage, 2 Liters used, 3 Total cost
  cell(rowIndex, columnIndex) {
    return this.row(rowIndex).find('td').eq(columnIndex);
  }

  // Кастомний дропдаун; активний пункт disabled, тому клікаємо лише якщо авто інше
  selectCar(name) {
    this.carSelectToggle.then(($btn) => {
      if ($btn.text().trim() !== name) {
        cy.wrap($btn).click();
        cy.contains('.car-select-dropdown_item', exact(name)).click();
      }
    });
  }

  openAddExpense() {
    this.addExpenseButton.click();
  }

  addExpense(data) {
    this.openAddExpense();
    addExpenseModal.addExpense(data);
  }

  // Кнопки Edit/Delete приховані до наведення на рядок, тому force: true
  openEditExpense(index = 0) {
    this.row(index).find('.btn-edit').click({ force: true });
  }

  editExpense(index, data) {
    this.openEditExpense(index);
    editExpenseModal.save(data);
  }

  openDeleteExpense(index = 0) {
    this.row(index).find('.btn-delete').click({ force: true });
  }

  deleteExpense(index = 0) {
    this.openDeleteExpense(index);
    deleteExpenseModal.confirm();
  }
}

export const fuelExpensesPage = new FuelExpensesPage();
