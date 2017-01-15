var env = require('../../../env.json');
var apiURL = process.env.API_URL || env.default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// GET all created pointScales for the application with the correct Authorization header
function getPointScales(authenticationToken) {
    return api
        .get("/pointScales")
        .set("Accept", "application/json")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Try to GET all created pointScales for the application without Authorization header
function getPointScalesWithoutAuthorizationHeader() {
    return api
        .get("/pointScales")
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// GET desired pointScale for the application with the correct Authorization header
function getPointScale(id, authenticationToken) {
    return api
        .get("/pointScales/" + id)
        .set("Accept", "application/json")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// GET desired pointScale for the application without Authorization header
function getPointScaleWithoutAuthorizationHeader(id) {
    return api
        .get("/pointScales/" + id)
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// POST a new pointScale for the application with the correct Authorization header
function createPointScale(pointScale, authenticationToken) {
    return api
        .post("/pointScales")
        .set("Content-type", "application/json")
        .set("Authorization", authenticationToken)
        .send(pointScale)
        .then(function (response) {
            return response
        });
}

// Try to POST a new pointScale for the application without Authorization header
function createPointScaleWithoutAuthorizationHeader(pointScale) {
    return api
        .post("/pointScales")
        .set("Content-type", "application/json")
        .send(pointScale)
        .then(function (response) {
            return response
        });
}

// PUT an existing pointScale for the application with the correct Authorization header
function updateCompletelyPointScale(id, pointScale, authenticationToken) {
    return api
        .put("/pointScales/" + id)
        .set("Content-type", "application/json")
        .set("Authorization", authenticationToken)
        .send(pointScale)
        .then(function (response) {
            return response
        });
}

// Try to PUT an existing pointScale for the application without Authorization header
function updateCompletelyPointScaleWithoutAuthorizationHeader(id, pointScale) {
    return api
        .put("/pointScales/" + id)
        .set("Content-type", "application/json")
        .send(pointScale)
        .then(function (response) {
            return response
        });
}

// DELETE an existing pointScale for the application with the correct Authorization header
function deletePointScale(id, authenticationToken) {
    return api
        .delete("/pointScales/" + id)
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Try to DELETE an existing pointScale for the application without Authorization header
function deletePointScaleWithoutAuthorizationHeader(id) {
    return api
        .delete("/pointScales/" + id)
        .send()
        .then(function (response) {
            return response
        });
}

// Generation of a new pointScale with random values
function generatePointScale() {
    return {
        name: chance.word({ length: 10 }),
        description: chance.sentence(),
        coefficient: chance.integer({min: 1, max: 1000})
    }
}

module.exports = {
    getPointScales: getPointScales,
    getPointScalesWithoutAuthorizationHeader: getPointScalesWithoutAuthorizationHeader,
    getPointScale: getPointScale,
    getPointScaleWithoutAuthorizationHeader: getPointScaleWithoutAuthorizationHeader,
    createPointScale: createPointScale,
    createPointScaleWithoutAuthorizationHeader: createPointScaleWithoutAuthorizationHeader,
    updateCompletelyPointScale: updateCompletelyPointScale,
    updateCompletelyPointScaleWithoutAuthorizationHeader: updateCompletelyPointScaleWithoutAuthorizationHeader,
    deletePointScale: deletePointScale,
    deletePointScaleWithoutAuthorizationHeader: deletePointScaleWithoutAuthorizationHeader,
    generatePointScale: generatePointScale
};