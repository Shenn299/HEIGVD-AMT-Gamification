// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var apiURL = process.env.API_URL || require('../../../env.json').default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// POST a new badge
function createAuthentication(authentication) {
    return api
        .post("/authentications")
        .set("Content-type", "application/json")
        .send(badge)
        .then(function (response) {
            return response
        });
}

module.exports = {
    createAuthentication: createAuthentication
};