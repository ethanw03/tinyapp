const { assert } = require("chai");

const { findEmail } = require("../helpers.js");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("findEmail", function() {
  it("should return a user with valid email", function() {
    const user = findEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, testUsers.userRandomID);
  });

  it("should return undefined when passed a email that is not registered", function() {
    const user = findEmail("ethan@ethan.com", testUsers);
    assert.equal(user, undefined);
  });
});
