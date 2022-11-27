/* eslint-disable import/no-extraneous-dependencies */
const { expect, should } = require("chai");
const session = require("supertest-session");
const app = require("../../src/app.js");
const { Dog, conn } = require("../../src/db.js");

const agent = session(app);

const dog = {
    name: "Pugtest",
    height: "30 - 60",
    weight: "20 - 40",
};

const dog2 = {
    name: "Richpuppy",
    height: "30 - 60",
    weight: "20 - 40",
    temperament: ["Happy", "Wild"]
};

describe("Dogs Routes", () => {
    before(() =>
        conn.authenticate().catch((err) => {
            console.error("Unable to connect to the database:", err);
        })
    );

    beforeEach(() => Dog.sync({ force: true }).then(() => Dog.create(dog)));

    describe("GET /dogs", () => {
        it("should get 200", async () => await agent.get("/dogs").expect(200));

        it("should not get dog", async () =>{
            const notFoundDog = await agent.get("/dogs?name=The King of Dogs");
            expect(notFoundDog, []);
        });

        it("should get dog", async () => {
            const dog = await agent.get("/dogs?name=Akita");
            expect(dog.body[0].name, "Akita");
        });
    });

    describe("GET /dogs/:idRaza", () => {
        it("should get 200", () => agent.get("/dogs/1").expect(200));

        it("should get dog", async () => {
            const dog = await agent.get("/dogs/1");
            expect(dog.body.id, 1);
        });
    });

    describe("GET /temperament", () => {
        it("should get 200", () => agent.get("/temperament").expect(200));

        it("should get temperaments", async () => {
            const temperaments = await agent.get("/temperament");
            expect(temperaments.body[0],{ temperament: 'Stubborn' });
        });
    });

    describe("POST /dog", () => {
        it("should get 200", async () => await agent.post("/dog").send(dog2).expect(200));

        it("should get created dog", async () => {
            await agent.post("/dog").send(dog2);

            const createdDog = await agent.get("/dogs?name=Richpuppy");
            expect(createdDog.body[0].name, "Richpuppy")
        })
    })

    describe("GET /random", () => {
        it("should get 200", async () => await agent.get("/random").expect(200));
    })
});
