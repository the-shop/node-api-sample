import request from "supertest";
import test from "tape-promise/tape";
import UsersBaseTest from "../UsersBaseTest";
import mongoose from "mongoose";

class Update extends UsersBaseTest {
  async run() {
    // Test with authorization token - should be success
    test("PUT /users/:id - SUCCESS", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const { response, user } = await this.createTestUser(headers);

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");

      const responseObject = await request(this.express)
        .put("/api/v1/users/" + user.id)
        .send({
          firstName: user.firstName,
          lastName: user.lastName,
          email: this.getRandomizer().randomHex(10),
          role: user.role,
        })
        .set("Authorization", headers.authorization);

      test.equal(responseObject.statusCode, 200);
      test.equal(responseObject.body.error, false);

      this.validateModelResponseFields(responseObject.body.model);

      test.end();
    });

    // Test without authorization token - API should error out
    test("PUT /users/:id - FAIL (unauthorized)", async test => {
      const response = await request(this.express)
        .put("/api/v1/users/1234567890123");

      test.equal(response.statusCode, 401);
      test.equal(response.body.error, true, "Error occurred");
      test.equal(response.body.errors.length, 1, "One error returned");
      test.equal(response.body.errors[0], "No auth token", "Field 'errors' matches");
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Update;
