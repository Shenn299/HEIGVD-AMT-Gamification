var chai = require("chai");
var badges = require("../api/support/badges.js");

chai.should();

// API tests with scenarios
describe("Create a new badge workflow :", function () {

    // Success
    it("A new badge just created should be present in the list returned by GET request", aNewBadgeJustCreatedShouldBePresentInTheListReturnedByTheGetRequest);

});

function aNewBadgeJustCreatedShouldBePresentInTheListReturnedByTheGetRequest() {
    var badge = badges.generateBadge();
    return badges.createBadge(badge)
        .then(function (response) {
            return badges.getBadges();
            })
            .then(function (response) {
                var nbBadges = response.body.length;
                var arrayOfBadge = response.body[nbBadges-1];

                // HTTP response body should have all these properties
                arrayOfBadge.should.have.property("id");
                arrayOfBadge.should.have.property("name");
                arrayOfBadge.should.have.property("description");
                response.body[0].should.have.property("image");

            })
}
