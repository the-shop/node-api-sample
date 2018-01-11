import request from "supertest";
import test from "tape-promise/tape";
import UsersBaseTest from "../UsersBaseTest";

class Load extends UsersBaseTest {
  async run() {
    // Test with authorization token - should be success
    test("LOAD /users - SUCCESS", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const { user } = await this.createTestUser(headers);

      const response = await request(this.express)
        .get("/api/v1/users")
        .set("Authorization", headers.authorization)
        .query({
          query: JSON.stringify({
            firstName: user.firstName,
            email: user.email,
          }),
          search: JSON.stringify({
            lastName: user.lastName,
            role: user.role,
          }),
        });

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");
      test.equal(Array.isArray(response.body.models), true, "Field type 'models' is array");

      response.body.models.map(one => this.validateModelResponseFields(one));

      const testSimplifiedSearchResponse = await request(this.express)
        .get("/api/v1/users")
        .set("Authorization", headers.authorization)
        .query({
          search: "test" 
        });

      test.equal(testSimplifiedSearchResponse.statusCode, 200);
      test.equal(testSimplifiedSearchResponse.body.error, false, "No error");
      test.equal(Array.isArray(testSimplifiedSearchResponse.body.models), true, "Field type 'models' is array");

      testSimplifiedSearchResponse.body.models.map(one => this.validateModelResponseFields(one));

      test.end();
    });

    // Test without authorization token - API should error out
    test("LOAD /users - FAIL (unauthorized)", async test => {
      const response = await request(this.express)
        .get("/api/v1/users");

      test.equal(response.statusCode, 401);
      test.equal(response.body.error, true, "Error occurred");
      test.equal(response.body.errors.length, 1, "One error returned");
      test.equal(response.body.errors[0], "No auth token", "Field 'errors' matches");

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Load;
