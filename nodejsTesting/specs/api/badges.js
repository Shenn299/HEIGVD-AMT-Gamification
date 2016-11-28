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
    it("should allow an unauthenticated user to create a new badges", itShouldAllowUnauthenticatedUserToCreateNewBadge);

    // PUT
    it("should allow an unauthenticated user to completely update an existing badge", shouldAllowUnauthenticatedUserToCompletelyUpdateBadge);

    // PATCH
    it("should allow an unauthenticated user to partially update an existing badge", shouldAllowUnauthenticatedUserToPartiallyUpdateBadge);

    // Delete
    it("should allow an unauthenticated user to delete an existing badge", shoulAllowUnauthenticatedUserToDeleteBadge);

    // Failures
    // POST
    it("should refuse an unauthenticated user to create a new badge if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to create a new badge if mandatory fields are empty or contain only spaces", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to create a new badge if name contains more than 80 characters", itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfNameContainsMoreThan80Characters);
    it("should refuse an unauthenticated user to create a new badge if description or image URL contain more than 255 characters", itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfDescriptionOrImageUrlContainMoreThan255Characters);
    it("should refuse an unauthenticated user to create a new badge if the badge name provided already exists", itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfTheBadgeNameProvidedAlreadyExists);
    it("should refuse an unauthenticated user to create a new badge if image URL isn't accessible");

    // PUT
    it("should refuse an unauthenticated user to completely update an existing badge if mandatory fields are not provided");
    it("should refuse an unauthenticated user to completely update an existing badge if mandatory fields are empty or contain only spaces");
    it("should refuse an unauthenticated user to completely update an existing badge if name contains more than 80 characters");
    it("should refuse an unauthenticated user to completely update an existing badge if description or image URL contain more than 255 characters");
    it("should refuse an unauthenticated user to completely update an existing badge if the badge name provided already exists");
    it("should refuse an unauthenticated user to completely update an existing badge if image URL isn't accessible");
    it("should refuse an unauthenticated user to completely update an existing badge if badge id provided does not exist");

    // PATCH
    it("should refuse an unauthenticated user to partially update an existing badge if at least one field is not provided");
    it("should refuse an unauthenticated user to partially update an existing badge if fields provided are empty or contain only spaces");
    it("should refuse an unauthenticated user to partially update an existing badge if name is provided and contains more than 80 characters");
    it("should refuse an unauthenticated user to partially update an existing badge if description or image URL is provided and contain more than 255 characters");
    it("should refuse an unauthenticated user to partially update an existing badge if name is provided and it already exists");
    it("should refuse an unauthenticated user to partially update an existing badge if image URL is provided and it isn't accessible");
    it("should refuse an unauthenticated user to partially update an existing badge if badge id provided does not exist");

    // Delete
    it("should refuse an unauthenticated user to delete an existing badge if badge id provided does not exist");

});

// pointScales endpoint
describe("The /pointScales endpoint :", function () {
    it("should allow an unauthenticated user to get the list of all point scales");
});

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

function itShouldAllowUnauthenticatedUserToCreateNewBadge() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    return badges.createBadge(badge)
        .then(function (response) {

            // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // HTTP header response should contain the URL to access the new badge created in the location field
            response.header['location'].should.include('http://localhost:8080/badges')

            return response;
        })
}

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
                    var id = badge.id;

                    // Update completely an existing badge
                    return badges.updateCompletelyBadge(id, badge)
                        .then(function (response) {

                            // HTTP response status should equal 204 NO CONTENT
                            response.status.should.equal(204);

                        });

                });

        });

}

function shouldAllowUnauthenticatedUserToPartiallyUpdateBadge() {
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
                    var id = badge.id;

                    // Creation of three partial badge payloads
                    var partialBadge1 = {
                        name: chance.word()
                    }

                    var partialBadge2 = {
                        description: chance.sentence()
                    }

                    var partialBadge3 = {
                        image: chance.sentence()
                    }

                    var partialBadges = [];
                    partialBadges.push(partialBadge1);
                    partialBadges.push(partialBadge2);
                    partialBadges.push(partialBadge3);

                    // Creation of an array of promise
                    // Try to update partially badge with each payload
                    var promises = partialBadges.map(p => (badges.updatePartiallyBadge(p)));

                    // When all requests have provided a response
                    return Promise.all(promises)
                        .then(function (responses) {

                            // Each HTTP responses status should equal 204 NO CONTENT  
                            responses.forEach(r => (r.status.should.equal(204)));

                        });

                });

        });

}

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
                    var id = badge.id;

                    // Delete an existing badge
                    return badges.deleteBadge(id, badge)
                        .then(function (response) {

                            // HTTP response status should equal 204 NO CONTENT
                            response.status.should.equal(204);

                        });

                });

        });

}

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
    delete wrongPayloads[2].image;

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
    wrongPayloads[2].image = "  ";

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

function itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfNameContainsMoreThan80Characters() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Change the length of the badge name to 81 characters
    badge.name = chance.word({ length: 81 });

    return badges.createBadge(badge)
        .then(function (response) {

            // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            return response;
        })
}

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
    wrongPayloads[1].image = chance.word({ length: 256 });

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

function itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfTheBadgeNameProvidedAlreadyExists() {
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
