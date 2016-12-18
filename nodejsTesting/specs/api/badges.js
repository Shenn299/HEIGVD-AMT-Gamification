var apiURL = process.env.API_URL || require('../../env.json').default.API_URL;
var chai = require("chai");
var badges = require("./support/badges.js");
var Chance = require("chance");
var chance = new Chance();

chai.should();

// API tests

// badges endpoint
describe("The /badges endpoint :", function () {

    // Success
    // GET
    it("should allow an unauthenticated user to get the list of all badges", itShouldAllowUnauthenticatedUserToGetTheListOfAllBadges);

    // POST
    it("should allow an unauthenticated user to create a new badge", itShouldAllowUnauthenticatedUserToCreateNewBadge);

    // PUT
    it("should allow an unauthenticated user to completely update an existing badge", shouldAllowUnauthenticatedUserToCompletelyUpdateBadge);

    // Delete
    it("should allow an unauthenticated user to delete an existing badge", shoulAllowUnauthenticatedUserToDeleteBadge);

    // Failures
    // POST
    it("should refuse an unauthenticated user to create a new badge if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to create a new badge if mandatory fields are empty or contain only spaces", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to create a new badge if name contains more than 80 characters", itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfNameContainsMoreThan80Characters);
    it("should refuse an unauthenticated user to create a new badge if description or image URL contain more than 255 characters", itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfDescriptionOrImageUrlContainMoreThan255Characters);
    it("should refuse an unauthenticated user to create a new badge if the badge name provided already exists in this application");

    // PUT
    it("should refuse an unauthenticated user to completely update an existing badge if mandatory fields are not provided", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to completely update an existing badge if mandatory fields are empty or contain only spaces", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to completely update an existing badge if name contains more than 80 characters", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfNameContainsMoreThan80Characters);
    it("should refuse an unauthenticated user to completely update an existing badge if description or image URL contain more than 255 characters", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfDescriptionOrImageUrlContainMoreThan255Characters);
    it("should refuse an unauthenticated user to completely update an existing badge if the badge name provided already exists");
    it("should refuse an unauthenticated user to completely update an existing badge if badge id provided does not exist", itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfBadgeIdProvidedDoesNotExist);

    // Delete
    it("should refuse an unauthenticated user to delete an existing badge if badge id provided does not exist", itShouldRefuseAnUnauthenticatedUserToDeleteAnExistingBadgeIfBadgeIdProvidedDoesNotExist);

});

// Success
// GET
function itShouldAllowUnauthenticatedUserToGetTheListOfAllBadges() {
    return badges.getBadges()
        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // HTTP response body should be an array
            response.body.should.be.an("array");

            return response;
        })
}

// Success
// POST
function itShouldAllowUnauthenticatedUserToCreateNewBadge() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    return badges.createBadge(badge)
        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // Saving of the HTTP header
            var location = response.header['location'];

            // Get all created badges
            return badges.getBadges()
                .then(function (response) {
                    var nbBadges = response.body.length;
                    var badge = response.body[nbBadges - 1];
                    var id = badge.badgeId;

                    // HTTP Location header response should contain the URL to access the new badge created
                    location.should.equal(apiURL + '/badges/' + id);

                })

        })
}

// Success
// PUT
function shouldAllowUnauthenticatedUserToCompletelyUpdateBadge() {
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

                    // Update completely an existing badge
                    return badges.updateCompletelyBadge(id, badge)
                        .then(function (response) {

                            // HTTP response status should equal 204 NO CONTENT
                            response.status.should.equal(204);

                        });

                });

        });

}

// Success
// DELETE
function shoulAllowUnauthenticatedUserToDeleteBadge() {
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

                    // Delete an existing badge
                    return badges.deleteBadge(id)
                        .then(function (response) {

                            // HTTP response status should equal 204 NO CONTENT
                            response.status.should.equal(204);

                        });

                });

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided() {
    // Generation of a new badge as payload
    var payload = badges.generateBadge();
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
    delete wrongPayloads[2].imageURL;

    // Creation of an array of promise
    // Try to create new badge with each wrong payload
    var promises = wrongPayloads.map(p => (badges.createBadge(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });

}

// Failure
// POST
function itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces() {
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
    // Try to create new badge with each wrong payload
    var promises = wrongPayloads.map(p => (badges.createBadge(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

        });
}

// Failure
// POST
function itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfNameContainsMoreThan80Characters() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Change the length of the badge name to 81 characters
    badge.name = chance.word({ length: 81 });

    return badges.createBadge(badge)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            // Change the length of the badge name to 80 characters
            badge.name = chance.word({ length: 80 });

            return badges.createBadge(badge);
        })
        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

        });

}

// Failure
// POST
function itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfDescriptionOrImageUrlContainMoreThan255Characters() {
    // Generation of a new badge as payload
    var payload = badges.generateBadge();
    // Creation of a string with the payload
    var original = JSON.stringify(payload);

    // Creation of wrong payloads
    // Each wrong payload have description or imageURL that contain 256 characters
    var wrongPayloads = [];
    for (var i = 0; i < 2; ++i) {
        wrongPayloads.push(JSON.parse(original));
    }
    wrongPayloads[0].description = chance.word({ length: 256 });
    wrongPayloads[1].imageURL = chance.word({ length: 256 });

    // Creation of an array of promise
    // Try to create new badge with each wrong payload
    var promises = wrongPayloads.map(p => (badges.createBadge(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function (responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r => (r.status.should.equal(422)));

            // Creation of correct payloads
            // Each correct payload have description or imageURL that contain 255 characters
            for (var i = 0; i < 2; ++i) {
                wrongPayloads.push(JSON.parse(original));
            }
            wrongPayloads[0].description = chance.word({ length: 255 });
            wrongPayloads[1].imageURL = chance.word({ length: 255 });

            // Creation of an array of promise
            // Try to create new badge with each correct payload
            var promises = wrongPayloads.map(p => (badges.createBadge(p)));

            // When all requests have provided a response
            return Promise.all(promises)
                .then(function (responses) {

                    // Each HTTP responses status should equal 201 CREATED
                    responses.forEach(r => (r.status.should.equal(201)));

                });

        });
}

/*
// Failure
// POST
function itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfTheBadgeNameProvidedAlreadyExistsInThisApplication() {
    // Generation of a new badge
    var badge = badges.generateBadge();

    // Creation of the badge
    return badges.createBadge(badge)
        .then(function (response) {

            // Creation of the same badge
            return badges.createBadge(badge)
                .then(function (response) {

                    // HTTP response status should equal 422 UNPROCESSABLE ENTITY
                    response.status.should.equal(422);
                });

        });

}
*/

// Failure 
// PUT
function itShouldRefuseAnUnauthenticatedUserToCompletelyUpdateAnExistingBadgeIfMandatoryFieldsAreNotProvided() {
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
                    // Each wrong payload have one mandatory field deleted
                    var wrongPayloads = [];
                    for (var i = 0; i < 3; ++i) {
                        wrongPayloads.push(JSON.parse(original));
                    }
                    delete wrongPayloads[0].name;
                    delete wrongPayloads[1].description;
                    delete wrongPayloads[2].imageURL;

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