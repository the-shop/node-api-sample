import request from "supertest";
import test from "tape-promise/tape";
import UsersBaseTest from "../UsersBaseTest";

class Delete extends UsersBaseTest {
  async run() {
    // Test delete endpoint - wrong ID
    test("DELETE/ users/:id - FAIL", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const response = await request(this.express)
        .delete("/api/v1/users/123456789012")
        .set("Authorization", headers.authorization);

      test.equal(response.statusCode, 404);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "User model not found.");
      test.end();
    });

    test("DELETE/ users/:id - SUCCESS", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const { user } = await this.createTestUser(headers);

      const response = await request(this.express)
        .delete("/api/v1/users/" + user.id)
        .set("Authorization", headers.authorization);

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false);

      this.validateModelResponseFields(response.body.model);

      test.end();

      const secondResponse = await request(this.express)
        .get("/api/v1/users/" + user.id)
        .set("Authorization", headers.authorization);

      test.equal(secondResponse.body.error, true);
      test.equal(secondResponse.statusCode, 404);
      test.equal(secondResponse.body.errors[0], "User model not found.");
    });

    // Test without authorization token - API should error out
    test("DELETE /users/:id - FAIL (unauthorized)", async test => {
      const response = await request(this.express)
        .delete("/api/v1/users/1234567890123");

      test.equal(response.statusCode, 401);
      test.equal(response.body.error, true, "Error occurred");
      test.equal(response.body.errors.length, 1, "One error returned");
      test.equal(response.body.errors[0], "No auth token", "Field 'errors' matches");
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Delete;
