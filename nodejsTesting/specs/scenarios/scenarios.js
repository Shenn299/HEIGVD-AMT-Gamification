var chai = require("chai");
var badges = require("../api/support/badges.js");

chai.should();

// API tests with workflow
describe("Workflows :", function () {

    // CRUD operations on badges endpoint
    describe("CRUD operation on badges endpoint :", function () {
        it("A new badge created should be present in the list returned by GET request and should contain all provided fields", aNewBadgeCreatedShouldBePresentInTheListReturnedByTheGetRequestAndShouldContainAllPostedFields);
        it("An existing badge that is completely updated should be present in the list returned by GET request and should contain all updated fields");
        it("An existing badge that is partially updated should be present in the list returned by GET request and should contain updated fields");
        it("An existing badge that is deleted should not be present in the list returned by GET request");

    });

});

function aNewBadgeCreatedShouldBePresentInTheListReturnedByTheGetRequestAndShouldContainAllPostedFields() {
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

                    // HTTP response body should contain the new badge created with all posted fields
                    badge.should.have.property("badgeId");
                    badge.should.have.property("name", badge.name);
                    badge.should.have.property("description", badge.description);
                    badge.should.have.property("imageURL", badge.image);

                });

        });
}

