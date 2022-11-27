const { Dog, Temps, conn } = require("../../src/db.js");
const { expect } = require("chai");

const dog = {
    name: "Puppy Transformer",
    weight: "10 - 30",
    height: "20 - 50",
};

describe("Dog model", () => {
    before(() =>
        conn.authenticate().catch((err) => {
            console.error("Unable to connect to the database:", err);
        })
    );

    describe("Validators", () => {
        beforeEach(() => Dog.sync({ force: true }));

        describe("properties", () => {
            it("should throw an error if name is null", () => {
                try {
                    Dog.create({});
                } catch (error) {
                    new Error(error);
                }
            });

            it("should not accept with only names", async () => {
                try {
                    await Dog.create({ name: "Pug" });
                } catch (error) {
                    new Error(error);
                }
            });

            it("should work with weight and height", async () => {
                await Dog.create(dog);
            });
        });

        describe("temperaments", () => {
            it("should stores temperaments", async () => {
                await Temps.create({temperament: "New unknown temp"});
            });

            it("should delete temperaments", async ()=> {
                await Temps.destroy({where: {temperament: "New unknown temp"}});
            })

            it("should get temperaments", async () => {
                await Temps.findAll();
            });

            it("Should not repeat temps", async () => {
                try {
                    await Temps.create({ temperament: "Happy" });
                } catch (error) {
                    new Error(error);
                }
            });
        });

        describe("associations", () => {
            it("should has association with temps", async ()=>{
                await Dog.create(dog);

                const association = await Dog.findOne({where:{name: "Puppy Transformer"}});
                expect(association.temps);
            })
        });
    });
});
