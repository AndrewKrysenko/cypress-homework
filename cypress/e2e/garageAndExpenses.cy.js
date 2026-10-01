import { homePage, signInModal } from "../pages/homePage";
import { garagePage, addCarModal } from "../pages/garagePage";
import { fuelExpensesPage, addExpenseModal } from "../pages/fuelExpensesPage";

const car = {
  brand: "BMW",
  model: "X5",
  mileage: 100,
};
const carName = `${car.brand} ${car.model}`;

const expense = {
  mileage: 150, // має бути більшим за пробіг авто
  liters: 10,
  totalCost: 200,
};

// Логін існуючим користувачем. Дані беруться з cypress.config поточного середовища:
// username / password — basic auth (доступ до сайту),
// userEmail / userPassword — зареєстрований користувач (форма Sign In).
const login = () => {
  cy.env(["username", "password", "userEmail", "userPassword"]).then(
    ({ username, password, userEmail, userPassword }) => {
      homePage.visit({
        auth: {
          username,
          password,
        },
      });

      homePage.openSignIn();
      signInModal.login({
        email: userEmail,
        password: userPassword,
      });
    }
  );

  garagePage.shouldBeOpened();
};

// Користувач той самий між запусками, тому перед кожним тестом
// чистимо гараж (витрати видаляються разом з авто)
const loginWithEmptyGarage = () => {
  login();
  garagePage.removeAllCars();
};

describe("Garage: adding a car", () => {
  beforeEach(loginWithEmptyGarage);

  it("adds a car to the garage", () => {
    garagePage.emptyMessage.should("be.visible");

    garagePage.addCar(car);

    addCarModal.shouldBeClosed();
    garagePage.carItems.should("have.length", 1);
    garagePage.car(carName).title.should("have.text", carName);
    garagePage.car(carName).mileageInput.should("have.value", String(car.mileage));
  });
});

describe("Fuel expenses: adding an expense to the created car", () => {
  beforeEach(() => {
    loginWithEmptyGarage();
    garagePage.addCar(car);
    garagePage.car(carName).title.should("be.visible");
  });

  it("adds a fuel expense from the car card in the garage", () => {
    garagePage.car(carName).addExpenseButton.click();
    addExpenseModal.vehicleSelect.find("option:selected").should("have.text", carName);

    addExpenseModal.addExpense(expense);

    addExpenseModal.shouldBeClosed();
    fuelExpensesPage.shouldBeOpened();
    fuelExpensesPage.carSelectToggle.should("contain.text", carName);
    fuelExpensesPage.rows.should("have.length", 1);
    fuelExpensesPage.cell(0, 1).should("have.text", String(expense.mileage));
    fuelExpensesPage.cell(0, 2).should("have.text", `${expense.liters}L`);
    fuelExpensesPage.cell(0, 3).should("have.text", `${expense.totalCost}.00 USD`);
  });

  it("adds a fuel expense from the Fuel expenses page", () => {
    garagePage.header.fuelExpensesLink.click();
    fuelExpensesPage.shouldBeOpened();
    fuelExpensesPage.emptyMessage.should("be.visible");

    fuelExpensesPage.addExpense(expense);

    addExpenseModal.shouldBeClosed();
    fuelExpensesPage.rows.should("have.length", 1);
    fuelExpensesPage.cell(0, 1).should("have.text", String(expense.mileage));
    fuelExpensesPage.cell(0, 2).should("have.text", `${expense.liters}L`);
    fuelExpensesPage.cell(0, 3).should("have.text", `${expense.totalCost}.00 USD`);
  });
});