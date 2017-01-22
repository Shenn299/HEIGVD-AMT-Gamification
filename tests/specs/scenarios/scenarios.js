var badges = require("../api/support/badges.js");
var applications = require("../api/support/applications.js");
var authentications = require("../api/support/authentications.js");
var rules = require("../api/support/rules.js");
var env = require('../../env.local.json');
var chai = require("chai");
var jwt = require('jsonwebtoken');

// Server signature key for authentication token
const KEY = process.env.SIGNATURE_KEY_FOR_JWT || env.default.SIGNATURE_KEY_FOR_JWT;
// Bearer pattern
const BEARER = "Bearer ";

chai.should();

// API tests with scenarios
describe("Scenarios :", function () {

    // Authentications & applications endpoints
    describe("Authentications & applications operation :", function () {
        it("should allow an unauthenticated user to create a new application, to authenticate itself and to get an authentication token", itShouldAllowUnauthenticatedUserToCreateApplicationToAuthenticateItselfAndToGetAuthenticationToken);
    });

    // The sending of an event must update the concerned user by applying the correct rule
    describe("The sending of an event must update the concerned user by applying the correct rule", function () {
        it("should allow an authenticated user to send an event and to see user badge update through the application of the correct rule", itShouldAllowAuthenticatedUserToSendEventAndToSeeUserBadgeUpdateThroughTheApplicationOfTheCorrectRule);
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
function itShouldAllowAuthenticatedUserToSendEventAndToSeeUserBadgeUpdateThroughTheApplicationOfTheCorrectRule() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new badge
    const BADGE = badges.generateBadge();
    // Rule to execute
    var rule = {
        name: ""
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

            // Create a new rule on this application
            


        })
}