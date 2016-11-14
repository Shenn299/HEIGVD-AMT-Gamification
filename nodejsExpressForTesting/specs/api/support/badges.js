var apiPrefix = "http://localhost:7070/v1/rfpsapi";
var api = require("supertest-as-promised")(apiPrefix);

function getBadges() {
    return api
    .get("/badges")
    .set("Accept", "application/json")
    .send()
    .then(function (response) {
        return response
    });
}

function createBadge(badge) {
    return api
    .post("/badges")
    .set("Content-type", "application/json")
    .send(badge)
    .then(function (response) {
        return response
    });
}

module.exports = {
  getBadges: getBadges,
  createBadge: createBadge
};