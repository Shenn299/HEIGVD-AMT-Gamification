var env = require("../../env.local.json");
var apiURL = process.env.API_URL || env.default.API_URL;
var pointScales = require("./support/pointScales.js");
var applications = require("./support/applications.js");
var jwt = require('jsonwebtoken');
var chai = require("chai");
var Chance = require("chance");
var chance = new Chance();

chai.should();

// Server signature key for authentication token
const KEY = process.env.SIGNATURE_KEY_FOR_JWT || env.default.SIGNATURE_KEY_FOR_JWT;
// Bearer pattern
const BEARER = "Bearer ";

// API tests
// An unauthenticated user is a user that doesn't send a correct authentication token in the Authorization header
// An authenticated user is a user that send a correct authentication token in the Authorization header (signed and not expired)

// pointScale endpoint
describe("The /pointScales endpoint :", function () {

    // Success
    // GET
    describe("Test success for HTTP GET method :", function () {
        it("should allow an authenticated user to get the list of pointScales of the application\n", itShouldAllowAuthenticatedUserToGetTheListOfPointScalesOfTheApplication);

    });

    // Success
    // GET /id
    describe("Test success for HTTP GET /id method :", function () {
        it("should allow an authenticated user to get the desired pointScale of the application\n", itShouldAllowAuthenticatedUserToGetTheDesiredPointScaleOfTheApplication);
    });

    // Success
    // POST
    describe("Test success for HTTP POST method :", function () {
        it("should allow an authenticated user to create a new pointScale on this application\n", itShouldAllowAuthenticatedUserToCreatePointScaleOnThisApplication);
    });

    // Success
    // PUT /id
    describe("Test success for HTTP PUT /id method :", function () {
        it("should allow an authenticated user to completely update an existing pointScale on this application\n", itShouldAllowAuthenticatedUserToCompletelyUpdateExistingPointScaleOnThisApplication);
    });

    // Success
    // Delete /id
    describe("Test success for HTTP DELETE /id method :", function () {
        it("should allow an authenticated user to delete an existing pointScale on this application\n", itShouldAllowAuthenticatedUserToDeleteExistingPointScaleOnThisApplication);
    });

    // Failures
    // GET
    describe("Test failures for HTTP GET method :", function () {
        it("should refuse an unauthenticated user to get all pointScales of this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthorizationHeaderIsNotProvided);
        it("should refuse an unauthenticated user to get all pointScales of this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthenticationTokenIsEmpty);
        it("should refuse an unauthenticated user to get all pointScales of this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
        it("should refuse an unauthenticated user to get all pointScales of this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
        it("should refuse an unauthenticated user to get all pointScales of this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthenticationTokenIsExpired);
        it("should refuse an authenticated user to get all pointScales of an application that does not exist\n", itShouldRefuseAuthenticatedUserToGetAllPointScalesOfAnApplicationThatDoesNotExist);
    });

    // GET /id
    describe("Test failures for HTTP GET /id method :", function () {
        it("should refuse an unauthenticated user to get the desired pointScale of this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthorizationHeaderIsNotProvided);
        it("should refuse an unauthenticated user to get the desired pointScale of this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsEmpty);
        it("should refuse an unauthenticated user to get the desired pointScale of this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
        it("should refuse an unauthenticated user to get the desired pointScale of this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
        it("should refuse an unauthenticated user to get the desired pointScale of this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsExpired);
        it("should refuse an authenticated user to get the desired pointScale of this application if pointScale id provided does not exist", itShouldRefuseAuthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfPointScaleIdProvidedDoesNotExist);
        it("should refuse an authenticated user to get the desired pointScale of an application that does not exist\n", itSouldRefuseAuthenticatedUserToGetTheDesiredPointScaleOfAnApplicationThatDoesNotExist);
    });

    // POST
    describe("Test failures for HTTP POST method :", function () {
        it("should refuse an unauthenticated user to create new pointScale on this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToCreatePointScaleOnThisApplicationIfTheAuthorizationHeaderIsNotProvided);
        it("should refuse an unauthenticated user to create new pointScale on this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToCreateNewPointScaleOnThisApplicationIfTheAuthenticationTokenIsEmpty);
        it("should refuse an unauthenticated user to create new pointScale on this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToCreatePointScaleOnThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
        it("should refuse an unauthenticated user to create new pointScale on this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToCreatePointScaleOnThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
        it("should refuse an unauthenticated user to create new pointScale on this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToCreatePointScaleOnThisApplicationIfTheAuthenticationTokenIsExpired);
        it("should refuse an authenticated user to create new pointScale on this application if mandatory fields are not provided", itShouldRefuseAuthenticatedUserToCreatePointScaleIfMandatoryFieldsAreNotProvided);
        it("should refuse an authenticated user to create new pointScale on this application if mandatory fields are empty or contain only spaces", itShouldRefuseAuthenticatedUserToCreatePointScaleIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
        it("should refuse an authenticated user to create new pointScale on this application if name contains more than 80 characters", itShouldRefuseAuthenticatedUserToCreatePointScaleIfNameContainsMoreThan80Characters);
        it("should refuse an authenticated user to create new pointScale on this application if description contains more than 255 characters", itShouldRefuseAuthenticatedUserToCreatePointScaleIfDescriptionContainsMoreThan255Characters);
        it("should refuse an authenticated user to create new pointScale on this application if coefficient is greater than 1000 or smaller than 1", itShouldRefuseAuthenticatedUserToCreatePointScaleOnThisApplicationIfCoefficientIsGreaterThan1000OrSmallerThan1);
        it("should refuse an authenticated user to create new pointScale on this application if the pointScale name provided already exists in this application", itShouldRefuseAuthenticatedUserToCreatePointScaleIfThePointScaleNameProvidedAlreadyExistsInThisApplication);
        it("should refuse an authenticated user to create new pointScale on an application that does not exist\n", itShouldRefuseAuthenticatedUserToCreateNewPointScaleOnAnApplicationThatDoesNotExist);
    });

    // PUT /id
    describe("Test failures for HTTP PUT /id method :", function () {
        it("should refuse an unauthenticated user to completely update the desired pointScale of this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthorizationHeaderIsNotProvided);
        it("should refuse an unauthenticated user to completely update the desired pointScale of this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsEmpty);
        it("should refuse an unauthenticated user to completely update the desired pointScale of this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
        it("should refuse an unauthenticated user to completely update the desired pointScale of this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
        it("should refuse an unauthenticated user to completely update the desired pointScale of this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsExpired);
        it("should refuse an authenticated user to completely update an existing pointScale of this application if mandatory fields are not provided", itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfMandatoryFieldsAreNotProvided);
        it("should refuse an authenticated user to completely update an existing pointScale of this application if mandatory fields are empty or contain only spaces", itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
        it("should refuse an authenticated user to completely update an existing pointScale of this application if name contains more than 80 characters", itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfNameContainsMoreThan80Characters);
        it("should refuse an authenticated user to completely update an existing pointScale of this application if description contains more than 255 characters", itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfDescriptionContainsMoreThan255Characters);
        it("should refuse an authenticated user to completely update an existing pointScale of this application if coefficient is greater than 1000 or smaller than 1", itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleOfThisApplicationIfCoefficientIsGreaterThan1000OrSmallerThan1);
        it("should refuse an authenticated user to completely update an existing pointScale of this application if the pointScale name provided already exists", itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfThePointScaleNameProvidedAlreadyExists);
        it("should refuse an authenticated user to completely update an existing pointScale of this application if pointScale id provided does not exist", itShouldRefuseAuthenticatedUserToCompletelyUpdateAnExistingPointScaleIfPointScaleIdProvidedDoesNotExist);
        it("should refuse an authenticated user to completely update an existing pointScale of an application that does not exist\n", itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleOfAnApplicationThatDoesNotExist);
    });

    // Delete /id
    describe("Test failures for HTTP DELETE /id method :", function () {
        it("should refuse an unauthenticated user to delete the desired pointScale of this application if the authorization header is not provided", itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthorizationHeaderIsNotProvided);
        it("should refuse an unauthenticated user to delete the desired pointScale of this application if the authentication token is empty", itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsEmpty);
        it("should refuse an unauthenticated user to delete the desired pointScale of this application if the authentication token is not preceded by the Bearer pattern", itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern);
        it("should refuse an unauthenticated user to delete the desired pointScale of this application if the authentication token is not signed by the gamification API server", itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer);
        it("should refuse an unauthenticated user to delete the desired pointScale of this application if the authentication token is expired", itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsExpired);
        it("should refuse an authenticated user to delete the desired pointScale if pointScale id provided does not exist", itShouldRefuseAuthenticatedUserToDeleteTheDesiredPointScaleIfPointScaleIdProvidedDoesNotExist);
        it("should refuse an authenticated user to delete the desired pointScale of an application that does not exist\n", itShouldRefuseAuthenticatedUserToDeleteTheDesiredPointScaleOfAnApplicationThatDoesNotExist);
    });

});

// Success
// GET
function itShouldAllowAuthenticatedUserToGetTheListOfPointScalesOfTheApplication() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Get the pointScale of this application
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // HTTP response body should be an empty array
            var array = response.body;
            array.should.be.an("array");
            array.should.be.empty;

        })

}

// Success
// GET /id
function itShouldAllowAuthenticatedUserToGetTheDesiredPointScaleOfTheApplication() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // PointScale id to get
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new pointScale on this application
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Get the desired pointScale
            return pointScales.getPointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // The pointScale should contain these values
            var pointScale = response.body;
            pointScale.should.have.deep.property("pointScaleId", Number(pointScaleId));
            pointScale.should.have.deep.property("name", POINT_SCALE.name);
            pointScale.should.have.deep.property("description", POINT_SCALE.description);
            pointScale.should.have.deep.property("coefficient", POINT_SCALE.coefficient);

        });

}

// Success
// POST
function itShouldAllowAuthenticatedUserToCreatePointScaleOnThisApplication() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    // Location http header
    var location = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new pointScale on this application
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Saving of the Location HTTP header
            location = response.header['location'];

            // Get the pointScales
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            var pointScale = response.body[0];

            // HTTP Location header response from previous POST request should contain the URL to access the new pointScale created
            location.should.equal(apiURL + '/pointScales/' + pointScale.pointScaleId);

            // PointScale should contain these keys
            pointScale.should.include.all.keys("pointScaleId", "description", "name", "coefficient");

            // pointScaleId should be a positive number
            pointScale.pointScaleId.should.be.a("number");
            pointScale.pointScaleId.should.be.above(0);

            // pointScale should contain these values
            pointScale.should.have.deep.property("name", POINT_SCALE.name);
            pointScale.should.have.deep.property("description", POINT_SCALE.description);
            pointScale.should.have.deep.property("coefficient", POINT_SCALE.coefficient);

        });

}

// Success
// PUT /id
function itShouldAllowAuthenticatedUserToCompletelyUpdateExistingPointScaleOnThisApplication() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // PointScale updated
    const POINT_SCALE_UPDATED = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new pointScale on this application
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Update the pointScale
            return pointScales.updateCompletelyPointScale(pointScaleId, POINT_SCALE_UPDATED, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

            // The pointScale updated should contain the updated value
            // Get the pointScale updated
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            // Save the pointScale updated
            var pointScale = response.body[0];

            // pointScale should contain these values
            pointScale.should.have.deep.property("pointScaleId", Number(pointScaleId));
            pointScale.should.have.deep.property("name", POINT_SCALE_UPDATED.name);
            pointScale.should.have.deep.property("description", POINT_SCALE_UPDATED.description);
            pointScale.should.have.deep.property("coefficient", POINT_SCALE_UPDATED.coefficient);

        });

}

// Success
// DELETE /id
function itShouldAllowAuthenticatedUserToDeleteExistingPointScaleOnThisApplication() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // PointScale id to delete
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Create a new pointScale on this application
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Delete the pointScale
            return pointScales.deletePointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

            // There should be no pointScale
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            // HTTP response body should be an empty array
            var pointScales = response.body;
            pointScales.should.be.an("array");
            pointScales.should.be.empty;

        });
}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    // Try to get all pointScales of the application
    return pointScales.getPointScalesWithoutAuthorizationHeader()
        .then(function (response) {

            // HTTP response status should equal 400 BAD REQUEST
            response.status.should.equal(400);

        });

}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Empty authentication token
    var authenticationToken = "";
    // Try to get all pointScales of the application
    return pointScales.getPointScales(authenticationToken)
        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Try to get pointScales
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });

}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            id = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: id
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to get pointScales
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: id
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Get pointScales
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 200 OK
            response.status.should.equal(200);

        })
}

// Failure
// GET
function itShouldRefuseUnauthenticatedUserToGetAllPointScalesOfThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            id = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: id
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to get pointScales
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: id
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Update application
            return pointScales.getPointScales(authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 200 OK
            response.status.should.equal(200);

        })
}

// Failure
// GET
function itShouldRefuseAuthenticatedUserToGetAllPointScalesOfAnApplicationThatDoesNotExist() {
    // Application id that doesn't exist
    var applicationId = 0

    // Creation of a valid authentication token for the application id = 0
    authenticationToken = BEARER + jwt.sign(
        {
            iss: applicationId
        },
        KEY,
        {
            expiresIn: '1h'
        }
    );

    // Try to get all pointScales
    return pointScales.getPointScales(authenticationToken)

        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        });
}

// Failure 
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    var pointScaleId = 0;

    // Try to get desired pointScale
    return pointScales.getPointScaleWithoutAuthorizationHeader(pointScaleId)
        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });

}

// Failure
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Empty authentication token
    var authenticationToken = "";
    var pointScaleId = 0;

    // Try to get the desired pointScale of the application
    return pointScales.getPointScale(pointScaleId, authenticationToken)
        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // PointScale id to get
    var pointScaleId = 0;
    // Authentication token for the application above without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken = response;

            // Create a new pointScale on this application
            return pointScales.getPointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });

}

// Failure
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // PointScale to get
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Create the pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to get pointScale
            return pointScales.getPointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Get pointScales
            return pointScales.getPointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 200 OK
            response.status.should.equal(200);

        })
}

// Failure
// GET /id
function itShouldRefuseUnauthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // PointScale to get
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Create the pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to get pointScale
            return pointScales.getPointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application but not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Get pointScales
            return pointScales.getPointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 200 OK
            response.status.should.equal(200);

        })
}

// Failure
// GET /id
function itSouldRefuseAuthenticatedUserToGetTheDesiredPointScaleOfAnApplicationThatDoesNotExist() {
    // Application id
    var applicationId = 0;
    // Creation of a valid authentication token but for an application that doesn't exist
    var authenticationToken = BEARER + jwt.sign(
        {
            iss: applicationId
        },
        KEY,
        {
            expiresIn: '1h'
        }
    );

    // Try to get pointScale
    var pointScaleId = 0;
    return pointScales.getPointScale(pointScaleId, authenticationToken)
        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        })
}

// Failure
// GET /id
function itShouldRefuseAuthenticatedUserToGetTheDesiredPointScaleOfThisApplicationIfPointScaleIdProvidedDoesNotExist() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received
            authenticationToken += response;

            // Try to get desired pointScale
            var pointScaleId = 0;
            return pointScales.getPointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 404 NOT FOUND
            response.status.should.equal(404);

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreatePointScaleOnThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Try to create pointScale
    return pointScales.createPointScaleWithoutAuthorizationHeader(POINT_SCALE)
        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateNewPointScaleOnThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Empty authentication token
    var authenticationToken = "";
    // Try to create pointScale
    return pointScales.createPointScale(POINT_SCALE, authenticationToken)
        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreatePointScaleOnThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken = response;

            // Try to create pointScale
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreatePointScaleOnThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to create pointScale
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Create pointScale
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 201 CREATED
            response.status.should.equal(201);

        })
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreatePointScaleOnThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to create pointScale
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application but not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Create pointScale
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 201 CREATED
            response.status.should.equal(201);

        })
}

// POST
function itShouldRefuseAuthenticatedUserToCreatePointScaleIfMandatoryFieldsAreNotProvided() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Generation of a new pointScale as payload
            var payload = pointScales.generatePointScale();
            // Creation of a string with the payload
            var original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have one mandatory field deleted
            var wrongPayloads = [];
            for (var i = 0; i < 3; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            delete wrongPayloads[0].name;
            delete wrongPayloads[1].description;
            delete wrongPayloads[2].coefficient;

            // Creation of an array of promise
            // Try to create new pointScale with each wrong payload
            var promises = wrongPayloads.map(p => (pointScales.createPointScale(p, authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });

}

// Failure
// POST
function itShouldRefuseAuthenticatedUserToCreatePointScaleIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Generation of a new pointScale as payload
            var payload = pointScales.generatePointScale();
            // Creation of a string with the payload
            var original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have one mandatory field that contains only two spaces
            var wrongPayloads = [];
            for (var i = 0; i < 3; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].name = "  ";
            wrongPayloads[1].description = "  ";
            wrongPayloads[2].coefficient = "  ";

            // Creation of an array of promise
            // Try to create new pointScale with each wrong payload
            var promises = wrongPayloads.map(p => (pointScales.createPointScale(p, authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });
}

// Failure
// POST
function itShouldRefuseAuthenticatedUserToCreatePointScaleIfNameContainsMoreThan80Characters() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Change the length of the pointScale name to 81 characters
            pointScale.name = chance.word({ length: 81 });

            return pointScales.createPointScale(pointScale, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the pointScale name to 80 characters
            pointScale.name = chance.word({ length: 80 });

            return pointScales.createPointScale(pointScale, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

        });

}

// Failure
// POST
function itShouldRefuseAuthenticatedUserToCreatePointScaleIfDescriptionContainsMoreThan255Characters() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Creation of wrong payloads
            // Description contains 256 characters
            pointScale.description = chance.word({ length: 256 });

            // Try to create pointScale
            return pointScales.createPointScale(pointScale, authenticationToken);

        })

        .then(function (response) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Creation of correct payloads
            pointScale.description = chance.word({ length: 255 });

            // Create pointScale
            return pointScales.createPointScale(pointScale, authenticationToken);

        })

        .then(function (response) {

            // Each HTTP responses status should equal 201 CREATED
            response.status.should.equal(201);

        })

}

// Failure
// POST
function itShouldRefuseAuthenticatedUserToCreatePointScaleOnThisApplicationIfCoefficientIsGreaterThan1000OrSmallerThan1() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Original pointScale
    var original;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken += response;

            // Generation of a new pointScale as payload
            var payload = pointScales.generatePointScale();
            // Creation of a string with the payload
            original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have an incorrect coefficient
            var wrongPayloads = [];
            for (var i = 0; i < 2; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].coefficient = 0;
            wrongPayloads[1].coefficient = 1001;

            // Creation of an array of promise
            // Try to create new pointScale with each wrong payload
            var promises = wrongPayloads.map(p => (pointScales.createPointScale(p, authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

            // Creation of correct payloads
            // Each wrong payload have a correct coefficient
            var wrongPayloads = [];
            for (var i = 0; i < 2; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].coefficient = 1;
            wrongPayloads[1].coefficient = 1000;

            // Change the name too for the second pointScale
            wrongPayloads[1].name = chance.word({ length: 10 });

            // Creation of an array of promise
            // Try to create new pointScale with each wrong payload
            var promises = wrongPayloads.map(p => (pointScales.createPointScale(p, authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 201 CREATED
            responses.forEach(r => (r.status.should.equal(201)));

        });

}

// Failure
// POST
function itShouldRefuseAuthenticatedUserToCreatePointScaleIfThePointScaleNameProvidedAlreadyExistsInThisApplication() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken += response;

            // Creation of the new pointScale
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // Try to create the same pointScale a second time
            return pointScales.createPointScale(POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

        });

}

// Failure 
// POST
function itShouldRefuseAuthenticatedUserToCreateNewPointScaleOnAnApplicationThatDoesNotExist() {
    const POINT_SCALE = pointScales.generatePointScale();
    // Application id
    var applicationId = 0;
    // Creation of a valid authentication token but for an application that doesn't exist
    var authenticationToken = BEARER + jwt.sign(
        {
            iss: applicationId
        },
        KEY,
        {
            expiresIn: '1h'
        }
    );

    // Try to create pointScale
    return pointScales.createPointScale(POINT_SCALE, authenticationToken)
        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        })
}

// Failure
// PUT /id
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    // PointScale id to update
    var pointScaleId = 0;
    // Try to update pointScale
    return pointScales.updateCompletelyPointScaleWithoutAuthorizationHeader(pointScaleId)
        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });
}

// Failure
// PUT /id
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // PointScale id to update
    var pointScaleId = 0;
    // Empty authentication token
    var authenticationToken = "";
    // Try to update pointScale
    return pointScales.updateCompletelyPointScale(pointScaleId, POINT_SCALE, authenticationToken)
        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// PUT /id
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // PointScale id to update
    var pointScaleId = 0;
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken = response;

            // Try to update pointScale
            return pointScales.updateCompletelyPointScale(pointScaleId, POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure 
// PUT /id
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Create a pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to update pointScale
            return pointScales.updateCompletelyPointScale(pointScaleId, POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Update the pointScale
            return pointScales.updateCompletelyPointScale(pointScaleId, POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure
// PUT /id
function itShouldRefuseUnauthenticatedUserToCompletelyUpdateTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Create a pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to update pointScale
            return pointScales.updateCompletelyPointScale(pointScaleId, POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application but not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Update pointScale
            return pointScales.updateCompletelyPointScale(pointScaleId, POINT_SCALE, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure 
// PUT /id
function itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfMandatoryFieldsAreNotProvided() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of the new pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Update completely an existing pointScale with wrong payloads
            // Generation of a new pointScale as payload
            var payload = pointScales.generatePointScale();
            // Creation of a string with the payload
            var original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have one mandatory field deleted
            var wrongPayloads = [];
            for (var i = 0; i < 3; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            delete wrongPayloads[0].name;
            delete wrongPayloads[1].description;
            delete wrongPayloads[2].coefficient;

            // Creation of an array of promise
            // Try to completely update pointScale with each wrong payload
            var promises = wrongPayloads.map(p => (pointScales.updateCompletelyPointScale(pointScaleId, p, BEARER + authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises)
                .then(function (responses) {

                    // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
                    responses.forEach(r => (r.status.should.equal(422)));

                });

        });

}

// Failure
// PUT /id
function itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of the new pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Update completely an existing pointScale with wrong payloads
            // Generation of a new pointScale as payload
            var payload = pointScales.generatePointScale();
            // Creation of a string with the payload
            var original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have one mandatory field that contains only two spaces
            var wrongPayloads = [];
            for (var i = 0; i < 3; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].name = "  ";
            wrongPayloads[1].description = "  ";
            wrongPayloads[2].coefficient = "  ";

            // Creation of an array of promise
            // Try to completely update pointScale with each wrong payload
            var promises = wrongPayloads.map(p => (pointScales.updateCompletelyPointScale(pointScaleId, p, BEARER + authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });

}

// Failure
// PUT /id
function itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfNameContainsMoreThan80Characters() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Application id
    var applicationId;
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of the new pointScale
            return pointScales.createPointScale(pointScale, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Change the length of the pointScale name to 81 characters
            pointScale.name = chance.word({ length: 81 });

            // Try to completely update
            return pointScales.updateCompletelyPointScale(pointScaleId, pointScale, BEARER + authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the pointScale name to 80 characters
            pointScale.name = chance.word({ length: 80 });

            // Update completely pointScale
            return pointScales.updateCompletelyPointScale(pointScaleId, pointScale, BEARER + authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 204 NO CONTENT
            response.status.should.equal(204);

        });

}

// Failure
// PUT /id
function itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfDescriptionContainsMoreThan255Characters() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new pointScale
    var pointScale = pointScales.generatePointScale();
    // Application id
    var applicationId;
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of the new pointScale
            return pointScales.createPointScale(pointScale, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Creation of wrong payloads
            pointScale.description = chance.word({ length: 256 });

            // Try to completely update pointScale with wrong payload
            return pointScales.updateCompletelyPointScale(pointScaleId, pointScale, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Each HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Creation of correct payloads
            // Each correct payload have description or coefficient that contains 255 characters
            pointScale.description = chance.word({ length: 255 });

            // Update pointScale with correct payload
            return pointScales.updateCompletelyPointScale(pointScaleId, pointScale, BEARER + authenticationToken);

        })


        .then(function (response) {

            // Each HTTP responses status should equal 204 NO CONTENT
            response.status.should.equal(204);

        });

}

// Failure
// PUT /id
function itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleOfThisApplicationIfCoefficientIsGreaterThan1000OrSmallerThan1() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Original pointScale
    var original;
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of the new pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Generation of a new pointScale as payload
            var payload = pointScales.generatePointScale();
            // Creation of a string with the payload
            original = JSON.stringify(payload);

            // Creation of wrong payloads
            // Each wrong payload have an incorrect coefficient
            var wrongPayloads = [];
            for (var i = 0; i < 2; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].coefficient = 0;
            wrongPayloads[1].coefficient = 1001;

            // Creation of an array of promise
            // Try to completely update pointScale with each wrong payload
            var promises = wrongPayloads.map(p => (pointScales.updateCompletelyPointScale(pointScaleId, p, BEARER + authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

            // Creation of correct payloads
            // Each wrong payload have a correct coefficient
            var wrongPayloads = [];
            for (var i = 0; i < 2; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].coefficient = 1;
            wrongPayloads[1].coefficient = 1000;

            // Change the name too for the second pointScale
            wrongPayloads[1].name = chance.word({ length: 10 });

            // Creation of an array of promise
            // Try to create new pointScale with each wrong payload
            var promises = wrongPayloads.map(p => (pointScales.updateCompletelyPointScale(pointScaleId, p, BEARER + authenticationToken)));

            // When all requests have provided a response
            return Promise.all(promises);

        })

        .then(function (responses) {

            // Each HTTP responses status should equal 204 NO CONTENT
            responses.forEach(r => (r.status.should.equal(204)));

        });
}

// Failure
// PUT /id
function itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleIfThePointScaleNameProvidedAlreadyExists() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Generation of a first pointScale
    const POINT_SCALE_1 = pointScales.generatePointScale();
    // Generation of a second pointScale
    const POINT_SCALE_2 = pointScales.generatePointScale();
    // Application id
    var applicationId;
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of the first pointScale
            return pointScales.createPointScale(POINT_SCALE_1, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Creation of the second pointScale
            return pointScales.createPointScale(POINT_SCALE_2, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id of the second pointScale created from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Try to update pointScale with the same value of POINT_SCALE_1
            return pointScales.updateCompletelyPointScale(pointScaleId, POINT_SCALE_1, BEARER + authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

        });
}

// Failure
// PUT /id
function itShouldRefuseAuthenticatedUserToCompletelyUpdateAnExistingPointScaleIfPointScaleIdProvidedDoesNotExist() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Generation of a new pointScale
            var pointScale = pointScales.generatePointScale();
            // Update a pointScale that doesn't exist
            return pointScales.updateCompletelyPointScale(0, pointScale, BEARER + authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 404 NOT FOUND
            response.status.should.equal(404);

        });

}

// Failure 
// Put /id
function itShouldRefuseAuthenticatedUserToCompletelyUpdateExistingPointScaleOfAnApplicationThatDoesNotExist() {
    const POINT_SCALE = pointScales.generatePointScale();
    // Application id
    var applicationId = 0;
    // Creation of a valid authentication token but for an application that doesn't exist
    var authenticationToken = BEARER + jwt.sign(
        {
            iss: applicationId
        },
        KEY,
        {
            expiresIn: '1h'
        }
    );

    // Try to update pointScale
    return pointScales.updateCompletelyPointScale(0, POINT_SCALE, authenticationToken)
        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        })

}

// Failure 
// Delete /id
function itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthorizationHeaderIsNotProvided() {
    // PointScale id to delete
    var pointScaleId = 0;
    // Try to delete pointScale
    return pointScales.deletePointScaleWithoutAuthorizationHeader(pointScaleId)
        .then(function (response) {

            // HTTP response status should be 400 BAD REQUEST
            response.status.should.equal(400);

        });
}

// Failure
// Delete /id
function itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsEmpty() {
    // Authentication token for the application above
    var authenticationToken = "";
    // PointScale id to delete
    var pointScaleId = 0;
    // Try to delete pointScale
    return pointScales.deletePointScale(pointScaleId, authenticationToken)
        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// Delete /id
function itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotPrecededByTheBearerPattern() {
    // PointScale id to update
    var pointScaleId = 0;
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Authentication token for the application above without Bearer pattern
    var authenticationToken = "";
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Valid authentication token received
            authenticationToken = response;

            // Try to delete pointScale
            return pointScales.deletePointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 401 UNAUTHORIZED
            response.status.should.equal(401);

        });
}

// Failure
// Delete /id
function itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsNotSignedByTheGamificationAPIServer() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // PointScale id to update
    var pointScaleId;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Create a pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Creation of a valid authentication token for this application but not signed with the server signature key
            const WRONG_KEY = KEY + 1;
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                WRONG_KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Try to delete pointScale
            return pointScales.deletePointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application signed with the server signature key
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Delete the pointScale
            return pointScales.deletePointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure
// Delete /id
function itShouldRefuseUnauthenticatedUserToDeleteTheDesiredPointScaleOfThisApplicationIfTheAuthenticationTokenIsExpired() {
    // Generation of a new pointScale
    const POINT_SCALE = pointScales.generatePointScale();
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // Application id
    var applicationId;
    // PointScale id to delete
    var pointScaleId = 0;
    // Authentication token for the application above
    var authenticationToken;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received without the Bearer pattern
            authenticationToken = response;

            // Save the application id from the JWT
            applicationId = jwt.verify(authenticationToken, KEY).iss;

            // Creation of the second pointScale
            return pointScales.createPointScale(POINT_SCALE, BEARER + authenticationToken);

        })

        .then(function (response) {

            // Get the pointScale id of the second pointScale created from Location header
            var location = response.header["location"];
            pointScaleId = location.substring(location.lastIndexOf("/") + 1);

            // Creation of a valid authentication token for this application but expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: 0
                }
            );

            // Try to delete pointScale
            return pointScales.deletePointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 401 UNAUTHORIZED
            response.status.should.equal(401);

            // Creation of a valid authentication token for this application but not expired
            authenticationToken = BEARER + jwt.sign(
                {
                    iss: applicationId
                },
                KEY,
                {
                    expiresIn: '1h'
                }
            );

            // Delete pointScale
            return pointScales.deletePointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should be 204 NO CONTENT
            response.status.should.equal(204);

        })
}

// Failure
// Delete /id
function itShouldRefuseAuthenticatedUserToDeleteTheDesiredPointScaleIfPointScaleIdProvidedDoesNotExist() {
    // Generation of a new application
    const APPLICATION = applications.generateApplication();
    // PointScale id to delete
    var pointScaleId = 0;
    // Authentication token for the application above
    var authenticationToken = BEARER;
    return applications.createApplicationAuthenticateApplicationAndReturnAuthenticationTokenReceived(APPLICATION)
        .then(function (response) {
            // Authentication token received
            authenticationToken += response;

            // Delete a pointScale that doesn't exist
            return pointScales.deletePointScale(pointScaleId, authenticationToken);

        })

        .then(function (response) {

            // HTTP response status should equal 404 NOT FOUND
            response.status.should.equal(404);

        });
}

// Failure
// Delete /id
function itShouldRefuseAuthenticatedUserToDeleteTheDesiredPointScaleOfAnApplicationThatDoesNotExist() {
    // Application id
    var applicationId = 0;
    // Creation of a valid authentication token but for an application that doesn't exist
    var authenticationToken = BEARER + jwt.sign(
        {
            iss: applicationId
        },
        KEY,
        {
            expiresIn: '1h'
        }
    );

    // Try to delete pointScale
    var pointScaleId = 0;
    return pointScales.deletePointScale(pointScaleId, authenticationToken)
        .then(function (response) {

            // HTTP response status should be 410 GONE
            response.status.should.equal(410);

        })

}