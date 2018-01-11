import request from "supertest";
import test from "tape-promise/tape";
import UsersBaseTest from "../UsersBaseTest";

class Create extends UsersBaseTest {
  async run() {
    // Test with authorization token - should be success
    test("CREATE /users - SUCCESS", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const { response, user } = await this.createTestUser(headers);

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");

      const responseObject = await request(this.express)
        .get("/api/v1/users/" + user.id)
        .set("Authorization", headers.authorization);

      test.equal(responseObject.statusCode, 200);
      test.equal(responseObject.body.error, false);

      this.validateModelResponseFields(responseObject.body.model);

      test.end();
    });

    // Test without authorization token - API should error out
    test("CREATE /users - FAIL (unauthorized)", async test => {
      const response = await request(this.express)
        .post("/api/v1/users");

      test.equal(response.statusCode, 401);
      test.equal(response.body.error, true, "Error occurred");
      test.equal(response.body.errors.length, 1, "One error returned");
      test.equal(response.body.errors[0], "No auth token", "Field 'errors' matches");
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Create;
