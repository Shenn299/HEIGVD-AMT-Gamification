var chai = require("chai");
var badges = require("./support/badges.js");
var Chance = require("chance");
var chance = new Chance();

chai.should();

// API tests

// server
describe("The API application :", function () {
    it("The API should be accessible");
})

// badges endpoint
describe("The /badges endpoint :", function () {

    // GET success
    it("should allow an unauthenticated user to get the list of all badges", itShouldAllowUnauthenticatedUserToGetTheListOfAllBadges);
    
    // POST success
    it("should allow an unauthenticated user to create a new badges", itShouldAllowUnauthenticatedUserToCreateNewBadge);

    // POST failures
    it("should refuse an unauthenticated user to create a new badge if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to create a new badge if mandatory fields are empty or contain only spaces", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreEmptyOrContainOnlySpaces);
    it("should refuse an unauthenticated user to create a new badge if name contains more than 80 charcters", itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfNameContainsMoreThan80Charcters);
    it("should refuse an unauthenticated user to create a new badge if description or image URL contain more than 255 charcters", itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfDescriptionOrImageUrlContainMoreThan255Charcters);
    it("should refuse an unauthenticated user to create a new badge if the badge name provided already exists", itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfTheBadgeNameProvidedAlreadyExists);
    it("should refuse an unauthenticated user to create a new badge if image URL isn't accessible");

    // PUT success

    // PUT failures

    // PATCH success

    // PATCH failures

    // Delete success

    // Delete failures


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
    var badge = badges.generateBadge();
    return badges.createBadge(badge)
        .then(function (response) {

             // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // HTTP header response should contain the URL to access the new badge created
            response.headers.should.include.location.keys("string");

            return response;
        })
}

function itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided() {
    // Generation of a new badge as payload
    var payload = badges.generateBadge();
    // Creation of a string with the payload
    var original = JSON.stringify(payload);

    // Creation of wrong payloads
    // Each wrong payload have one mandatory field deleted
    var wrongPayloads = [];
    for (var i=0; i<3; ++i) {
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
        .then(function(responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r =>(r.status.should.equal(422)));
            
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
    for (var i=0; i<3; ++i) {
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
        .then(function(responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r =>(r.status.should.equal(422)));
            
        });
}

function itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfNameContainsMoreThan80Charcters() {
    // Generation of a new badge
    var badge = badges.generateBadge();
    // Change the length of the badge name to 81 characters
    badge.name = chance.word({length: 81});

    return badges.createBadge(badge)
        .then(function (response) {

             // HTTP response status should equal 422 UNPROCESSABLE ENTITY
            response.status.should.equal(422);

            return response;
        })
}

function itShouldRefuseAnUnauthenticatedUserToCreateBadgeIfDescriptionOrImageUrlContainMoreThan255Charcters() {
    // Generation of a new badge as payload
    var payload = badges.generateBadge();
    // Creation of a string with the payload
    var original = JSON.stringify(payload);

    // Creation of wrong payloads
    // Each wrong payload have description or imageURL that contain 256 characters
    var wrongPayloads = [];
    for (var i=0; i<2; ++i) {
        wrongPayloads.push(JSON.parse(original));
    }
    wrongPayloads[0].description = chance.word({length: 256});
    wrongPayloads[1].image = chance.word({length: 256});

    // Creation of an array of promise
    // Try to create new badge with each wrong payload
    var promises = wrongPayloads.map(p => (badges.createBadge(p)));

    // When all requests have provided a response
    return Promise.all(promises)
        .then(function(responses) {

            // Each HTTP responses status should equal 422 UNPROCESSABLE ENTITY
            responses.forEach(r =>(r.status.should.equal(422)));
            
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
