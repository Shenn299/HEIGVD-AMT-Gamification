var Chance = require("chance");
var chance = new Chance();
var badges = require("./support/badges.js");
var chai = require("chai");
chai.should();

describe("The /badges endpoint", function () {
    it("should allow an unauthenticated user to get the list of all badges", itShouldAllowUnauthenticatedUserToGetTheListOfAllBadges);
    it("should allow an unauthenticated user to create a new badges", itShouldAllowUnauthenticatedUserToCreateNewBadge);
});

function itShouldAllowUnauthenticatedUserToGetTheListOfAllBadges() {
    return badges.getBadges()
        .then(function (response) {
            response.status.should.equal(200);

            response.body.should.be.an("array");

            response.body.sould.have.property("name");
            response.body.sould.have.property("description");
            response.body.sould.have.property("image");

            return response;
        })
}

function itShouldAllowUnauthenticatedUserToCreateNewBadge() {
    var badge = generateBadge();
    return badges.createBadge(badge)
        .then(function (response) {
            response.status.should.equal(201);
            // Response must contain the URL to access the new badge created
            response.body.should.be.an("string");
            return response;
        })
}
