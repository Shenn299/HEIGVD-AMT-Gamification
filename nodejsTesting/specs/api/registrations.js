var apiURL = process.env.API_URL || require('../../env.json').default.API_URL;
var chai = require("chai");
var registrations = require("./support/registrations.js");
var Chance = require("chance");
var chance = new Chance();

chai.should();

// API tests

// registrations endpoint
describe("The /registrations endpoint :", function () {

    // Success
    // GET
    it("should allow an unauthenticated user to get the list of all registrations", itShouldAllowUnauthenticatedUserToGetTheListOfAllRegistrations);

    // POST
    it("should allow an unauthenticated user to create a new registration", itShouldAllowUnauthenticatedUserToCreateRegistration);

    // PUT
    // See workflow

    // Delete
    // See workflow

    // Failures
    // POST
    it("should refuse an unauthenticated user to create a new registration if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToCreateRegistrationIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to create a new registration if mandatory fields are empty or contain only spaces", itShouldRefuseUnauthenticatedUserToCreateRegistrationIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to create a new registration if name or password contain more than 80 characters", itShouldRefuseUnauthenticatedUserToCreateRegistrationIfNameOrPasswordContainMoreThan80Characters);
    it("should refuse an unauthenticated user to create a new registration if description contains more than 255 characters", itShouldRefuseUnauthenticatedUserToCreateRegistrationIfDescriptionContainsMoreThan255Characters);
    it("should refuse an unauthenticated user to create a new registration if password contains less than 7 characters", itShouldRefuseUnauthenticatedUserToCreateRegistrationIfPasswordContainsLessThan7Characters);
    it("should refuse an unauthenticated user to create a new registration if registration name provided already exists");

    // PUT
    it("should refuse an unauthenticated user to completely update an existing registration if mandatory fields are not provided");
    it("should refuse an unauthenticated user to completely update an existing registration if mandatory fields are empty or contain only spaces");
    it("should refuse an unauthenticated user to completely update an existing registration if name contains more than 80 characters");
    it("should refuse an unauthenticated user to completely update an existing registration if description or image URL contain more than 255 characters");
    it("should refuse an unauthenticated user to completely update an existing registration if the registration name provided already exists");
    it("should refuse an unauthenticated user to completely update an existing registration if registration id provided does not exist");

    // Delete
    it("should refuse an unauthenticated user to delete an existing badge if badge id provided does not exist");

});

// Success
// GET
function itShouldAllowUnauthenticatedUserToGetTheListOfAllRegistrations() {
    return registrations.getRegistrations()
        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // HTTP response body should be an array
            response.body.should.be.an("array");

        })
}

// Success
// POST
function itShouldAllowUnauthenticatedUserToCreateRegistration() {
    // Generation of a new registration
    var registration = registrations.generateRegistration();
    return registrations.createRegistration(registration)
        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Saving of the HTTP Location header
            var location = response.header['location'];

            // Get all created registrations
            return registrations.getRegistrations()
                .then(function (response) {
                    var nbRegistrations = response.body.length;
                    var registration = response.body[nbRegistrations - 1];
                    var id = registration.registrationId;

                    // HTTP Location header response should contain the URL to access the new registration created
                    location.should.equal(apiURL + '/registrations/' + id);

                })

        })
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateRegistrationIfMandatoryFieldsAreNotProvided() {
    // Generation of a new registration as payload
    var payload = registrations.generateRegistration();
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
    delete wrongPayloads[2].password;

    // Creation of an array of promise
    // Try to create new registration with each wrong payload
    var promises = wrongPayloads.map(p => (registrations.createRegistration(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateRegistrationIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new registration as payload
    var payload = registrations.generateRegistration();
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
    wrongPayloads[2].password = "  ";

    // Creation of an array of promise
    // Try to create new badge with each wrong payload
    var promises = wrongPayloads.map(p => (registrations.createRegistration(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });
}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateRegistrationIfNameOrPasswordContainMoreThan80Characters() {
    // Generation of a new registration
    var registration = registrations.generateRegistration();
    // Change the length of the registration name to 81 characters
    registration.name = chance.word({ length: 81 });

    return registrations.createRegistration(registration)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the registration name to 80 characters
            registration.name = chance.word({ length: 80 });

            return registrations.createRegistration(registration)
                .then(function (response) {

                    // HTTP response status should equal 201 CREATED
                    response.status.should.equal(201);

                    // Change the length of the registration password to 80 characters
                    registration.password = chance.word({ length: 81 });
                    // We need to change the name too because it already exists now
                    registration.name = chance.word();

                    return registrations.createRegistration(registration)
                        .then(function (response) {

                            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                            response.status.should.equal(422);

                            // Change the length of the registration password to 80 characters
                            registration.password = chance.word({ length: 80 });

                            return registrations.createRegistration(registration)
                                .then(function (response) {

                                    // HTTP response status should equal 201 CREATED
                                    response.status.should.equal(201);

                                });

                        });

                });

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateRegistrationIfDescriptionContainsMoreThan255Characters() {
    // Generation of a new registration
    var registration = registrations.generateRegistration();

    // Change the length of the registration description to 256 characters
    registration.description = chance.word({ length: 256 });

    return registrations.createRegistration(registration)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the registration description to 255 characters
            registration.description = chance.word({ length: 255 });

            return registrations.createRegistration(registration);
        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

        });

}

// Failure 
// PUT
function itShouldRefuseUnauthenticatedUserToCreateRegistrationIfPasswordContainsLessThan7Characters() {
    // Generation of a new registration
    var registration = registrations.generateRegistration();

    // Change the length of the registration password to 6 characters
    registration.password = chance.word({ length: 6 });

    return registrations.createRegistration(registration)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the registration description to 255 characters
            registration.password = chance.word({ length: 7 });

            return registrations.createRegistration(registration);
        })

        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

        });

}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Creation of the new badge
    return badges.createBadge(badge)
        .then(function (response) {

            // Get all created badges
            return badges.getBadges()
                .then(function (response) {
                    var nbBadges = response.body.length;
                    var badge = response.body[nbBadges - 1];
                    var id = badge.badgeId;

                    // Update completely an existing badge with wrong payloads
                    // Generation of a new badge as payload
                    var payload = badges.generateBadge();
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
                    wrongPayloads[2].imageURL = "  ";

                    // Creation of an array of promise
                    // Try to completely update badge with each wrong payload
                    var promises = wrongPayloads.map(p => (badges.updateCompletelyBadge(id, p)));

                    // When all requests have provided a response
                    return Promise.all(promises)
                        .then(function (responses) {

                            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
                            responses.forEach(r => (r.status.should.equal(422)));

                        });

                });

        });
}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfNameContainsMoreThan80Characters() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Creation of the new badge
    return badges.createBadge(badge)
        .then(function (response) {

            // Get all created badges
            return badges.getBadges()
                .then(function (response) {
                    var nbBadges = response.body.length;
                    var badge = response.body[nbBadges - 1];
                    var id = badge.badgeId;

                    // Change the length of the badge name to 81 characters
                    badge.name = chance.word({ length: 81 });

                    return badges.updateCompletelyBadge(id, badge)
                        .then(function (response) {

                            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                            response.status.should.equal(422);

                            // Change the length of the badge name to 80 characters
                            badge.name = chance.word({ length: 80 });
                            return badges.updateCompletelyBadge(id, badge)
                                .then(function (response) {

                                    // HTTP response status should equal 204 NO CONTENT
                                    response.status.should.equal(204);

                                });

                        });

                });

        });

}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfDescriptionOrImageUrlContainMoreThan255Characters() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Creation of the new badge
    return badges.createBadge(badge)
        .then(function (response) {

            // Get all created badges
            return badges.getBadges()
                .then(function (response) {
                    var nbBadges = response.body.length;
                    var badge = response.body[nbBadges - 1];
                    var id = badge.badgeId;

                    // Update completely an existing badge with wrong payloads
                    // Generation of a new badge as payload
                    var payload = badges.generateBadge();
                    // Creation of a string with the payload
                    var original = JSON.stringify(payload);

                    // Creation of wrong payloads
                    // Each wrong payload have description or imageURL that contains 256 characters
                    var wrongPayloads = [];
                    for (var i = 0; i < 2; ++i) {
                        wrongPayloads.push(JSON.parse(original));
                    }
                    wrongPayloads[0].description = chance.word({ length: 256 });
                    wrongPayloads[1].imageURL = chance.word({ length: 256 });

                    // Creation of an array of promise
                    // Try to completely update badge with each wrong payload
                    var promises = wrongPayloads.map(p => (badges.updateCompletelyBadge(id, p)));

                    // When all requests have provided a response
                    return Promise.all(promises)
                        .then(function (responses) {

                            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
                            responses.forEach(r => (r.status.should.equal(422)));

                            // Creation of correct payloads
                            // Each correct payload have description or imageURL that contains 255 characters
                            for (var i = 0; i < 2; ++i) {
                                wrongPayloads.push(JSON.parse(original));
                            }
                            wrongPayloads[0].description = chance.word({ length: 255 });
                            wrongPayloads[1].imageURL = chance.word({ legth: 255 });

                            // Creation of an array of promise
                            // Try to completely update badge with each correct payload
                            var promises = wrongPayloads.map(p => (badges.updateCompletelyBadge(id, p)));

                            // When all requests have provided a response
                            return Promise.all(promises)
                                .then(function (responses) {

                                    // Each HTTP responses status should equal 204 NO CONTENT
                                    responses.forEach(r => (r.status.should.equal(204)));

                                });


                        });

                });

        });
}

// Failure
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfBadgeIdProvidedDoesNotExist() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Update a badge that doesn't exist
    return badges.updateCompletelyBadge(0, badge)
        .then(function (response) {

            // HTTP response status should equal 404 NOT FOUND
            response.status.should.equal(404);

        });

}

// Failure
// Delete
function itShouldRefuseAnUnauthenticatedUserToDeleteAnExistingBadgeIfBadgeIdProvidedDoesNotExist() {
    // Delete a badge that doesn't exist
    return badges.deleteBadge(0)
        .then(function (response) {

            // HTTP response status should equal 404 NOT FOUND
            response.status.should.equal(404);

        });
}