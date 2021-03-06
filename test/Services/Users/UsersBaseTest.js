import request from "supertest";
import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import moment from "moment";

class UsersBaseTest extends BaseTest {
  async createTestUser(headers) {
    const { authorization } = headers;
    const response = await request(this.express)
      .post("/api/v1/users")
      .set("Authorization", authorization)
      .send({
        firstName: this.getRandomizer().randomString(1),
        lastName: this.getRandomizer().randomString(1),
        email: this.getRandomEmail(),
        role:  "admin",
      });

    return {
      response,
      headers: response.headers,
      user: response.body.model,
    };
  }

  validateModelResponseFields(responseModel) {
    test("Validate 'User' model response properties", test => {
      test.equal(typeof responseModel.firstName, "string");
      test.equal(typeof responseModel.lastName, "string");
      test.equal(typeof responseModel.email, "string");
      test.equal(typeof responseModel.role, "string");
      test.equal(typeof responseModel.timeCreated, "string");
      test.equal(moment(responseModel.timeCreated, moment.ISO_8601).isValid(), true);
      test.equal(typeof responseModel.timeEdited, "string");
      test.equal(moment(responseModel.timeEdited, moment.ISO_8601).isValid(), true);
      test.equal(typeof responseModel.owner, "string");

      test.end();
    });
  }
}

export default UsersBaseTest;
