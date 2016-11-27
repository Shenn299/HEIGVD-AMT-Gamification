// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var apiURL = process.env.API_URL || require('../../../env.json').default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// GET all created badges
function getBadges() {
    return api
    .get("/badges")
    .set("Accept", "application/json")
    .send()
    .then(function (response) {
        return response
    });
}

// Create a new badge
function createBadge(badge) {
    return api
    .post("/badges")
    .set("Content-type", "application/json")
    .send(badge)
    .then(function (response) {
        return response
    });
}

// Creation of a new badge with random values
function generateBadge() {
    return {
        name: chance.word(),
        description: chance.sentence(),
        image: chance.sentence()
    }
}

module.exports = {
  getBadges: getBadges,
  createBadge: createBadge,
  generateBadge: generateBadge
};