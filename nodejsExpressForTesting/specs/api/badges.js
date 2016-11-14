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
    .then(function(response) {
        response.status.should.equal(200);
        response.body.should.be.an("array");
        // We have to inspect the array content too
        return response;
    })
}

function itShouldAllowUnauthenticatedUserToCreateNewBadge() {
    var badge = {
        name: "Java Expert",
        description: "This badge reward people who proposed at least 50 approuved solutions",
        image: "http://fake-url.com"
    }
    return badges.createBadge(badge)
    .then(function(response) {
        response.status.should.equal(201);
        response.body.should.be.an("string");
        return response;
    })
}
