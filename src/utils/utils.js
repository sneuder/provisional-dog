const { conn } = require("../db.js");
const { Dog, Temps } = require("../db.js");

function findById(dogs, id) {
    const foundDog = dogs.find((dog) => dog.id == id);
    return foundDog;
}

function filterDogsName(dogs, filtro) {
    filtro = filtro.replace(/(^\w{1})|(\s+\w{1})/g, (first) =>
        first.toUpperCase()
    );

    const filterDogs = dogs.filter((dog) => {
        if (dog.name.includes(filtro)) {
            return dog;
        }
    });

    return filterDogs;
}

function temperament(dogs) {
    let temp = [];

    dogs.forEach((dog) => {
        if (!dog.hasOwnProperty("temperament") || dog.temperament === "")
            return;
        else {
            let tempDogs = dog.temperament.replace(/,/g, "").split(" ");
            tempDogs.forEach((eachTemp) => {
                if (!temp.includes(eachTemp)) temp.push(eachTemp);
            });
        }
    });

    temp.forEach(async (eachTemp) => {
        await Temps.findOrCreate({ where: { temperament: eachTemp } }).catch(
            (error) => {
                console.log(error);
            }
        );
    });

    return temp;
}

async function bringTemps() {
    const temps = await Temps.findAll({ attributes: ["temperament"] }).catch(
        (error) => {
            console.log(error);
        }
    );
    return temps;
}

async function addDogDB(name, height, weight, life, image, temps) {
    const date = new Date();
    const id = date.getMilliseconds() * 2 + date.getMinutes();
    
    name = name.replace(/(^\w{1})|(\s+\w{1})/g, (first) =>
        first.toUpperCase()
    );

    await Dog.create({
        id: id,
        name: name,
        height: height,
        weight: weight,
        life: life,
        image: image,
    })
        .then((result) => {
            temps.forEach((temp) => {
                bringFilteredTemps(temp)
                    .then(async (idTemp) => {
                        (await result).addTemps(idTemp);
                    })
                    .catch((error) => console.log(error));
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

async function bringFilteredTemps(temp) {
    const temps = await Temps.findAll({
        where: { temperament: temp },
    }).catch((error) => {
        console.log(error);
    });

    return temps;
}

async function bringDogsDB() {
    let dogsToSend = await Dog.findAll({
        include: Temps,
    }).catch((error) => console.log(error));

    return dogsToSend;
}

module.exports = {
    temperament,
    findById,
    filterDogsName,
    addDogDB,
    bringTemps,
    bringDogsDB,
};
