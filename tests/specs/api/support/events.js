// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var env = require('../../../env.local.json');
var apiURL = process.env.API_URL || env.default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// POST a new event for the application with the correct Authorization header
function createEvent(event, authenticationToken) {
    return api
        .post("/events")
        .set("Content-type", "application/json")
        .set("Authorization", authenticationToken)
        .send(event)
        .then(function (response) {
            return response
        });
}

// Try to POST a new event for the application without Authorization header
function createEventWithoutAuthorizationHeader(event) {
    return api
        .post("/events")
        .set("Content-type", "application/json")
        .send(event)
        .then(function (response) {
            return response
        });
}

module.exports = {
    createEvent: createEvent,
    createEventWithoutAuthorizationHeader: createEventWithoutAuthorizationHeader
};