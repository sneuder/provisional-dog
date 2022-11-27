const { Router } = require("express");
const axios = require("axios");

const router = Router();
const apiKey = process.env.API_KEY;

const {
    temperament,
    findById,
    addDogDB,
    filterDogsName,
    bringTemps,
    bringDogsDB,
} = require("../utils/utils.js");

router.get("/dogs", (req, res) => {
    axios
        .get(`https://api.thedogapi.com/v1/breeds?api_key=${apiKey}`)
        .then((result) => {
            bringDogsDB().then((response) => {
                const dogs = [...response, ...result.data];

                if (req.query.hasOwnProperty("name")) {
                    const filteredDogs = filterDogsName(dogs, req.query.name);
                    return res.json(filteredDogs);
                }

                res.json(dogs);
            });
        });
});

router.get("/dogs/:idRaza", (req, res) => {
    const idRaza = req.params.idRaza;
    axios
        .get(`https://api.thedogapi.com/v1/breeds?api_key=${apiKey}`)
        .then((result) => {
            bringDogsDB().then((response) => {
                const dogs = [...response, ...result.data];
                let dog = findById(dogs, idRaza);

                res.json(dog);
            });
            
        });
});

router.get("/temperament", (req, res) => {
    axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${apiKey}`)
        .then((result) => {
            temperament(result.data);
            bringTemps().then(temps => res.json(temps))
            
        }).catch((error) => res.json(error));
});

router.post("/dog", (req, res) => {
    const { name, height, weight, life, image, temperament } = req.body;
    addDogDB(name, height, weight, life, image, temperament);

    res.json("Succes");
});

router.get("/random", (req, res) => {
    axios
        .get("https://dog.ceo/api/breeds/image/random")
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
});

module.exports = router;
