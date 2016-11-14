var Chance = require("chance");
var chance = new Chance();
var badges = require("./support/badges.js");
var chai = require("chai");
chai.should();

describe("The /badges endpoint", function () {
    it("should allow an unauthenticated user to get the list of all badges", itShouldAllowUnauthenticatedUserToGetTheListOfAllBadges);
});


function itShouldAllowUnauthenticatedUserToGetTheListOfAllBadges() {
    return badges.getBadges()
    .then(function(response) {
        response.status.should.equal(200);
        response.body.should.be.an("array");
        return response;
    })
}