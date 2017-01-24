var env = require('../../env.local.json');
var applications = require("../api/support/applications.js");
var authentications = require("../api/support/authentications.js");
var badges = require("../api/support/badges.js");
var pointScales = require("../api/support/pointScales.js");
var rules = require("../api/support/rules.js");
var events = require("../api/support/events.js");
var users = require("../api/support/users.js");

var chai = require("chai");
var jwt = require('jsonwebtoken');

var Chance = require("chance");
var chance = new Chance();

// Server signature key for authentication token
const KEY = process.env.SIGNATURE_KEY_FOR_JWT || env.default.SIGNATURE_KEY_FOR_JWT;
// Bearer pattern
const BEARER = "Bearer ";

chai.should();

// API tests with scenarios
describe("Scenarios :", function () {

    // Authentications & applications endpoints
    describe("Authentications & applications operation :", function () {
        it("should allow an unauthenticated user to create a new application, to authenticate itself and to get an authentication token\n", itShouldAllowUnauthenticatedUserToCreateApplicationToAuthenticateItselfAndToGetAuthenticationToken);
    });

    // The sending of an event must update the concerned user by applying the correct rule
    describe("The sending of an event must update the concerned user by applying the correct rule", function () {
        it("should allow an authenticated application to send an event and to see user badge update through the application of the correct rule", itShouldAllowAuthenticatedApplicationToSendEventAndToSeeUserBadgeUpdateThroughTheApplicationOfTheCorrectRule);
        it("should allow an authenticated application to send an event and to see user points update through the application of the correct rule", itShouldAllowAuthenticatedApplicationToSendEventAndToSeeUserPointsUpdateThroughTheApplicationOfTheCorrectRule);
        it("should allow an authenticated application to send an event and to see user badge and user points update through the application of the correct rule", itShouldAllowAuthenticatedApplicationToSendEventAndToSeeUserbadgeAndUserPointsUpdateThroughTheApplicationOfTheCorrectRule);
    });

});

// Authentications & applications endpoints
function itShouldAllowUnauthenticatedUserToCreateApplicationToAuthenticateItselfAndToGetAuthenticationToken() {
    // Generation of a new application
    var application = applications.generateApplication();

    // Creation of the application
    return applications.createApplication(application)
        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Creation of the authentication
            var authentication = {
                name: application.name,
                password: application.password
            }

            // Authentication
            return authentications.createAuthentication(authentication);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // Authentication token should be present in the response body and be a string
            authenticationToken = response.text;
            authenticationToken.should.not.be.empty;
            authenticationToken.should.be.a("string");

            // Authentication token should be signed by the API server and not expired
            // Otherwise, it generate a JsonWebToken error
            jwt.verify(authenticationToken, KEY).should.be.an("object");

        })

}

// The sending of an event must update the concerned user by applying the correct rule
function itShouldAllowAuthenticatedApplicationToSendEventAndToSeeUserBadgeUpdateThroughTheApplicationOfTheCorrectRule() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Rule to execute
    var rule = {
        "ruleName": "",
        "description": "",
        "badgeId": 0,
        "pointScaleId": 0,
        "points": 0,
        "eventType": ""
    }
    // Event to send
    var event = {
        name: "",
        description: "",
        userAppId: ""
    }
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new badge on this application
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Get the badge id from Location header
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Create a new rule on this application
            rule.ruleName = chance.word({ length: 8 });
            rule.description = chance.sentence();
            rule.badgeId = badgeId;
            rule.pointScaleId = 0;
            rule.points = 0;
            rule.eventType = chance.word({ length: 8 });
            return rules.createRule(rule, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Send an event that will be processed by the new rule created
            event.name = rule.eventType;
            event.description = chance.sentence();
            event.userAppId = chance.integer({ min: 1, max: 100 })
            return events.createEvent(event, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Get users info
            return users.getUsers(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // Response body should be an array
            var body = response.body;
            body.should.be.an("array");

            // Get the user who caused the event
            var targetUser;
            for (var i = 0; i < body.length; ++i) {
                if (body[i].userIdApp == event.userAppId) {
                    targetUser = body[i];
                    return;
                }
            }

            // Badge owned should be equal to the badge associated with the rule created
            targetUser.badgesOwned.should.be.an("array");
            targetUser.badgesOwned.length.should.equal(1);
            targetUser.badgesOwned[0].should.have.deep.property("name", BADGE.name);
            targetUser.badgesOwned[0].should.have.deep.property("imageURL", BADGE.imageURL);

            // User should have no point on pointScale
            targetUser.totalScores.should.be.equal(0);
            targetUser.pointScalesOwned.should.be.an("array");
            targetUser.pointScalesOwned.should.be.empty;

        })
}

// The sending of an event must update the concerned user by applying the correct rule
function itShouldAllowAuthenticatedApplicationToSendEventAndToSeeUserPointsUpdateThroughTheApplicationOfTheCorrectRule() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new pointScale
    const POINTSCALE = pointScales.generatePointScale();
    // Rule to execute
    var rule = {
        "ruleName": "",
        "description": "",
        "badgeId": 0,
        "pointScaleId": 0,
        "points": 0,
        "eventType": ""
    }
    // Event to send
    var event = {
        name: "",
        description: "",
        userAppId: ""
    }
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new pointScale on this application
            return pointScales.createPointScale(POINTSCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Create a new rule on this application
            rule.ruleName = chance.word({ length: 8 });
            rule.description = chance.sentence();
            rule.pointScaleId = pointScaleId;
            rule.badgeId = 0;
            rule.points = chance.integer({ min: 1, max: 1000 });
            rule.eventType = chance.word({ length: 8 });
            return rules.createRule(rule, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Send an event that will be processed by the new rule created
            event.name = rule.eventType;
            event.description = chance.sentence();
            event.userAppId = chance.integer({ min: 1, max: 100 })
            return events.createEvent(event, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Get users info
            return users.getUsers(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // Response body should be an array
            var body = response.body;
            body.should.be.an("array");

            // Get the user who caused the event
            var targetUser;
            for (var i = 0; i < body.length; ++i) {
                if (body[i].userIdApp == event.userAppId) {
                    targetUser = body[i];
                    return;
                }
            }

            // PointScale owned should be equal to the pointScale associated with the rule created
            targetUser.pointScalesOwned.should.be.an("array");
            targetUser.pointScalesOwned.length.should.equal(1);
            targetUser.pointScalesOwned[0].should.have.deep.property("name", POINTSCALE.name);
            targetUser.pointScalesOwned[0].should.have.deep.property("coefficient", POINTSCALE.coefficient);

            // User should have the correct number of points
            targetUser.totalScores.should.equal(rule.points * POINTSCALE.coefficient);

            // User should have no badges
            targetUser.badgesOwned.should.be.an("array");
            targetUser.badgesOwned.should.be.empty;

        })
}

// The sending of an event must update the concerned user by applying the correct rule
function itShouldAllowAuthenticatedApplicationToSendEventAndToSeeUserbadgeAndUserPointsUpdateThroughTheApplicationOfTheCorrectRule() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    var badgeId;
    // Generation of a new pointScale
    const POINTSCALE = pointScales.generatePointScale();
    var pointScaleId;
    // Rule to execute
    var rule = {
        "ruleName": "",
        "description": "",
        "badgeId": 0,
        "pointScaleId": 0,
        "points": 0,
        "eventType": ""
    }
    // Event to send
    var event = {
        name: "",
        description: "",
        userAppId: ""
    }
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new badge on this application
            return badges.createBadge(BADGE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Get the badge id from Location header
            var location = response.header["location"];
            badgeId = location.substring(location.lastIndexOf("/") + 1);

            // Create a new pointScale on this application
            return pointScales.createPointScale(POINTSCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Create a new rule on this application
            rule.ruleName = chance.word({ length: 8 });
            rule.description = chance.sentence();
            rule.pointScaleId = pointScaleId;
            rule.badgeId = badgeId;
            rule.points = chance.integer({ min: 1, max: 1000 });
            rule.eventType = chance.word({ length: 8 });
            return rules.createRule(rule, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Send an event that will be processed by the new rule created
            event.name = rule.eventType;
            event.description = chance.sentence();
            event.userAppId = chance.integer({ min: 1, max: 100 })
            return events.createEvent(event, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Get users info
            return users.getUsers(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // Response body should be an array
            var body = response.body;
            body.should.be.an("array");

            // Get the user who caused the event
            var targetUser;
            for (var i = 0; i < body.length; ++i) {
                if (body[i].userIdApp == event.userAppId) {
                    targetUser = body[i];
                    return;
                }
            }

            // Badge owned should be equal to the badge associated with the rule created
            targetUser.badgesOwned.should.be.an("array");
            targetUser.badgesOwned.length.should.equal(1);
            targetUser.badgesOwned[0].should.have.deep.property("name", BADGE.name);
            targetUser.badgesOwned[0].should.have.deep.property("imageURL", BADGE.imageURL);

            // PointScale owned should be equal to the pointScale associated with the rule created
            targetUser.pointScalesOwned.should.be.an("array");
            targetUser.pointScalesOwned.length.should.equal(1);
            targetUser.pointScalesOwned[0].should.have.deep.property("name", POINTSCALE.name);
            targetUser.pointScalesOwned[0].should.have.deep.property("coefficient", POINTSCALE.coefficient);

            // User should have the correct number of points
            targetUser.totalScores.should.equal(rule.points * POINTSCALE.coefficient);

        })
}