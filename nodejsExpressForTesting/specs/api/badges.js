var chai = require("chai");
var badges = require("./support/badges.js");

chai.should();

// API tests
// /badges endpoint
describe("The /badges endpoint", function () {
    it("should allow an authenticated user to get the list of all badges", itShouldAllowAuthenticatedUserToGetTheListOfAllBadges);
    it("should allow an authenticated user to create a new badges", itShouldAllowAuthenticatedUserToCreateNewBadge);
    it("should refuse an authenticated user to create a new badge if mandatory fields are not provided", itSouldRefuseAuthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided);
});

// /pointScales endpoint
describe("", function () {
    it("should allow an authenticated user to get the list of all point scales");
});

function itShouldAllowAuthenticatedUserToGetTheListOfAllBadges() {
    return badges.getBadges()
        .then(function (response) {

            // HTTP response status should equal 200 OK
            response.status.should.equal(200);

            // HTTP response body should be an array
            response.body.should.be.an("array");

            // HTTP response body should have all these properties
            response.body.should.have.property("badge_id");
            response.body.should.have.property("name");
            response.body.should.have.property("description");
            response.body.should.have.property("image");

            return response;
        })
}

function itShouldAllowAuthenticatedUserToCreateNewBadge() {
    var badge = badges.generateBadge();
    return badges.createBadge(badge)
        .then(function (response) {

             // HTTP response status should equal 201 CREATED
            response.status.should.equal(201);

            // HTTP header response should contain the URL to access the new badge created
            response.location.should.an("string");

            return response;
        })
}

function itSouldRefuseAuthenticatedUserToCreateBadgeIfMandatoryFieldsAreNotProvided() {
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

function itSouldAllowAuthenticatedUserToGetTheListOfAllPointScales() {

}
