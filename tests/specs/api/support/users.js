// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var env = require('../../../env.local.json');
var apiURL = process.env.API_URL || env.default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// GET all users for the application with the correct Authorization header
function getUsers(authenticationToken) {
    return api
        .get("/users")
        .set("Accept", "application/json")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Try to GET all created users for the application without Authorization header
function getUsersWithoutAuthorizationHeader() {
    return api
        .get("/users")
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}


module.exports = {
    getUsers: getUsers,
    getUsersWithoutAuthorizationHeader: getUsersWithoutAuthorizationHeader
};