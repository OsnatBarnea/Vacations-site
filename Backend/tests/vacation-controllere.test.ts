import supertest from "supertest";
import { app } from "../src/app";
import path from "path";
import { expect } from "chai";

describe("Test vacation-controller", () => {
    let token: string;
    let imagePath: string;

    before(async () => {
        const response = await supertest(app.server).post("/api/login")
        .field("email", "adam@gmail.com")
        .field("password", "123456");
        token = response.body;
        imagePath = path.join(__dirname, "resources", "imageTest.jpg");
    });

    it("should return all vacations", async () => {
        const response = await supertest(app.server).get("/api/vacations");
        const vacations = response.body;
        expect(vacations.length).to.be.greaterThanOrEqual(1);
        expect(vacations[0]).to.contain.keys("id", "destination", "description", "startDate", "endDate", "price", "imageName")
    });

    it("should return a single vacation (by id)", async () => {
        const response = await supertest(app.server).get("/api/vacations/2");
        const vacation = response.body;
        expect(vacation).to.not.be.empty;
        expect(vacation).to.contain.keys("id", "destination", "description", "startDate", "endDate", "price", "imageName")
    });

    it("should add a vacation ", async () => {
        const response = await supertest(app.server).post("/api/vacations")
        .set("Authorization", "Bearer " + token)
        .field("destination", "Test vacation")
        .field("description", "The best hotel for a great vacation in Hawaii")
        .field("startDate", "2025-02-11")
        .field("endDate", "2025-02-22")
        .field("price", 2200)
        .attach("image", imagePath);

        const dbVacation = response.body;
        expect(dbVacation).to.not.be.empty;
        expect(dbVacation).to.contain.keys("id", "destination", "description", "startDate", "endDate", "price", "imageName")
    });
})