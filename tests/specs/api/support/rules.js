// If no API URL address is specified at run time, then system takes the API URL specified in env.json file under "default"
var env = require('../../../env.local.json');
var apiURL = process.env.API_URL || env.default.API_URL;
var api = require("supertest-as-promised")(apiURL);
var Chance = require("chance");
var chance = new Chance();

// GET all created rules for the application with the correct Authorization header
function getRules(authenticationToken) {
    return api
        .get("/rules")
        .set("Accept", "application/json")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Try to GET all created rules for the application without Authorization header
function getRulesWithoutAuthorizationHeader() {
    return api
        .get("/rules")
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// GET desired rule for the application with the correct Authorization header
function getRule(id, authenticationToken) {
    return api
        .get("/rules/" + id)
        .set("Accept", "application/json")
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// GET desired rule for the application without Authorization header
function getRuleWithoutAuthorizationHeader(id) {
    return api
        .get("/rules/" + id)
        .set("Accept", "application/json")
        .send()
        .then(function (response) {
            return response
        });
}

// POST a new rule for the application with the correct Authorization header
function createRule(rule, authenticationToken) {
    return api
        .post("/rules")
        .set("Content-type", "application/json")
        .set("Authorization", authenticationToken)
        .send(rule)
        .then(function (response) {
            return response
        });
}

// Try to POST a new rule for the application without Authorization header
function createRuleWithoutAuthorizationHeader(rule) {
    return api
        .post("/rules")
        .set("Content-type", "application/json")
        .send(rule)
        .then(function (response) {
            return response
        });
}

// PUT an existing rule for the application with the correct Authorization header
function updateCompletelyRule(id, rule, authenticationToken) {
    return api
        .put("/rules/" + id)
        .set("Content-type", "application/json")
        .set("Authorization", authenticationToken)
        .send(rule)
        .then(function (response) {
            return response
        });
}

// Try to PUT an existing rule for the application without Authorization header
function updateCompletelyRuleWithoutAuthorizationHeader(id, rule) {
    return api
        .put("/rules/" + id)
        .set("Content-type", "application/json")
        .send(rule)
        .then(function (response) {
            return response
        });
}

// DELETE an existing rule for the application with the correct Authorization header
function deleteRule(id, authenticationToken) {
    return api
        .delete("/rules/" + id)
        .set("Authorization", authenticationToken)
        .send()
        .then(function (response) {
            return response
        });
}

// Try to DELETE an existing rule for the application without Authorization header
function deleteRuleWithoutAuthorizationHeader(id) {
    return api
        .delete("/rules/" + id)
        .send()
        .then(function (response) {
            return response
        });
}

module.exports = {
    getRules: getRules,
    getRulesWithoutAuthorizationHeader: getRulesWithoutAuthorizationHeader,
    getRule: getRule,
    getRuleWithoutAuthorizationHeader: getRuleWithoutAuthorizationHeader,
    createRule: createRule,
    createRuleWithoutAuthorizationHeader: createRuleWithoutAuthorizationHeader,
    updateCompletelyRule: updateCompletelyRule,
    updateCompletelyRuleWithoutAuthorizationHeader: updateCompletelyRuleWithoutAuthorizationHeader,
    deleteRule: deleteRule,
    deleteRuleWithoutAuthorizationHeader: deleteRuleWithoutAuthorizationHeader
};