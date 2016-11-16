// If we don't specify an API URL at run time, system takes the API URL specified in env.json under "default"
var apiURL = require('../../../env.json')[process.env.NODE_ENV || 'default'];
var api = require("supertest-as-promised")(apiURL);

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
function generateBdge() {
    return {
        name: chance.word(),
        description: chance.sentence(),
        image: chance.sentence()
    }
}

module.exports = {
  getBadges: getBadges,
  createBadge: createBadge,
  generateBdge: generateBdge
};