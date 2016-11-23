var chai = require("chai");
var badges = require("./support/badges.js");

chai.should();

// API tests
// /badges endpoint
describe("The /badges endpoint :", function () {

    // Success
    it("should allow an unauthenticated user to get the list of all badges", itShouldAllowUnauthenticatedUserToGetTheListOfAllBadges);
    it("should allow an unauthenticated user to create a new badges", itShouldAllowUnauthenticatedUserToCreateNewBadge);

    // Failures
    it("should refuse an unauthenticated user to create a new badge if mandatory fields are not provided", itShouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided);
    it("should refuse an unauthenticated user to create a new badge if mandatory fields don't contain at least 1 character", shouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsDoNotContainAtLeast1Character);
    it("should refuse an unauthenticated user to create a new badge if mandatory fields contain more than 45 characters");
    it("should refuse an unauthenticated user to create a new badge if the badge name provided already exists");

});

// /pointScales endpoint
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

function shouldRefuseUnauthenticatedUserToCreateBadgeIfMandatoryFieldsDoNotContainAtLeast1Character() {
    // Generation of a new badge as payload
    var payload = badges.generateBadge();
    // Creation of a string with the payload
    var original = JSON.stringify(payload);

    // Creation of wrong payloads
    // Each wrong payload have one mandatory field that is empty
    var wrongPayloads = [];
    for (var i=0; i<3; ++i) {
        wrongPayloads.push(JSON.parse(original));
    }
    wrongPayloads[0].name = "";
    wrongPayloads[1].description = "";
    wrongPayloads[2].image = "";

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

function itSouldAllowUnauthenticatedUserToGetTheListOfAllPointScales() {

}
