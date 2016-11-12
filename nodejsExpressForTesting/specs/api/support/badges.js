var apiPrefix = "http://localhost:9090/amtBootcampApp-1.0/api";
var api = require("supertest-as-promised")(apiPrefix);

function getBadges() {
    return api
    .get("/users")
    .set("Accept", "application/json")
    .send()
    .then(function (response) {
        return response
    });
}

module.exports = {
  getBadges: getBadges
};