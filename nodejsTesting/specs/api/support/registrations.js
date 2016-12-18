// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var apiURL = process.env.API_URL || require('../../../env.json').default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// GET all created registrations
function getRegistrations() {
    return api
        .get("/registrations")
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// POST a new registration
function createRegistration(registration) {
    return api
        .post("/registrations")
        .set("Content-type", "application/json")
        .send(registration)
        .then(function (response) {
            return response
        });
}

// PUT an existing registration
function updateCompletelyRegistration(id, registration) {
    return api
        .put("/registrations/" + id)
        .set("Content-type", "application/json")
        .send(registration)
        .then(function (response) {
            return response
        });
}

// DELETE an existing registration
function deleteRegistration(id) {
    return api
        .delete("/registrations/" + id)
        .send()
        .then(function (response) {
            return response
        });
}

// Generation of a new registration with random values
function generateRegistration() {
    return {
        name: chance.word(),
        description: chance.sentence(),
        password: chance.word({ length: 7 })
    }
}

module.exports = {
    getRegistrations: getRegistrations,
    createRegistration: createRegistration,
    updateCompletelyRegistration: updateCompletelyRegistration,
    deleteRegistration: deleteRegistration,
    generateRegistration: generateRegistration
};