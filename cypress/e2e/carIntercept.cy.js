import { homePage, signInModal } from "../pages/homePage";
import { garagePage } from "../pages/garagePage";
import { fuelExpensesPage } from "../pages/fuelExpensesPage";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const expense = {
    reportedAt: `${year}-${month}-${day}`, // формат API: 2026-10-05
    uiDate: `${day}.${month}.${year}`,     // формат UI: 05.10.2026
    mileage: 150,
    liters: 10,
    totalCost: 200,
};

const car = {
    brand: "BMW",
    model: "X5",
    mileage: 100,
};
const carName = `${car.brand} ${car.model}`;

let carId;


const login = () => {
    cy.env(["username", "password", "userEmail", "userPassword"]).then(
        ({ username, password, userEmail, userPassword }) => {
            homePage.visit({
                auth: { username, password },
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


describe("Cars: UI + API", () => {
    beforeEach(login);

    it("creates a car via UI and intercepts the response", () => {
        garagePage.removeAllCars();

        cy.intercept("POST", "/api/cars").as("createCar");

        garagePage.addCar(car);

        cy.wait("@createCar").then((interception) => {
            expect(interception.response.statusCode).to.eq(201);
            expect(interception.response.body.data.id).to.be.a("number");

            carId = interception.response.body.data.id;
            cy.log(`Created car id: ${carId}`);
        });

        garagePage.car(carName).title.should("be.visible");
    });

    it("returns the created car in GET /api/cars", () => {
        cy.env(["username", "password"]).then(({ username, password }) => {
            cy.request({
                method: "GET",
                url: "/api/cars",
                auth: { username, password },
            }).then((response) => {
                expect(response.status).to.eq(200);

                const createdCar = response.body.data.find((item) => item.id === carId);

                expect(createdCar, "created car in the list").to.exist;
                expect(createdCar.id).to.eq(carId);
                expect(createdCar.brand).to.eq(car.brand);
                expect(createdCar.model).to.eq(car.model);
                expect(createdCar.mileage).to.eq(car.mileage);
            });
        });
    });

    it("creates an expense for the car via API", () => {
        const expenseBody = {
            carId,
            reportedAt: expense.reportedAt,
            mileage: expense.mileage,
            liters: expense.liters,
            totalCost: expense.totalCost,
            forceMileage: false,
        };

        cy.createExpense(expenseBody).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.status).to.eq("ok");

            const createdExpense = response.body.data;

            expect(createdExpense.id).to.be.a("number");
            expect(createdExpense.carId).to.eq(carId);
            expect(createdExpense.reportedAt).to.eq(expense.reportedAt);
            expect(createdExpense.mileage).to.eq(expense.mileage);
            expect(createdExpense.liters).to.eq(expense.liters);
            expect(createdExpense.totalCost).to.eq(expense.totalCost);
        });
    });

    it("shows the API-created expense in UI", () => {
        garagePage.header.fuelExpensesLink.click();
        fuelExpensesPage.shouldBeOpened();

        fuelExpensesPage.selectCar(carName);
        fuelExpensesPage.carSelectToggle.should("contain.text", carName);

        fuelExpensesPage.rows.should("have.length", 1);
        fuelExpensesPage.cell(0, 0).should("have.text", expense.uiDate);
        fuelExpensesPage.cell(0, 1).should("have.text", String(expense.mileage));
        fuelExpensesPage.cell(0, 2).should("have.text", `${expense.liters}L`);
        fuelExpensesPage.cell(0, 3).should("have.text", `${expense.totalCost}.00 USD`);
    });
});