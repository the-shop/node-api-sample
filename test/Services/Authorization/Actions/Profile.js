import request from "supertest";
import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";

class Profile extends BaseTest {
  async run() {
    test("GET /profile - SUCCESS", async test => {
      const { user, headers } = await this.registerTestUser();

      const response = await request(this.express)
        .get("/api/v1/profile")
        .set("Authorization", headers.authorization);

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");
      test.equal(response.body.model.email, user.email, "Field 'email' matches");
      test.equal(response.body.model.role, user.role, "Field 'role' matches");
      test.equal(response.body.model.firstName, user.firstName, "Field 'firstName' matches");
      test.equal(response.body.model.lastName, user.lastName, "Field 'lastName' matches");

      test.end();
    });

    test("GET /profile - FAIL - not authorized", async test => {
      const response = await request(this.express)
        .get("/api/v1/profile");

      test.equal(response.statusCode, 401);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Not logged in");
      test.equal(response.headers.authorization, undefined, 'Authorization header not defined');

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Profile;
