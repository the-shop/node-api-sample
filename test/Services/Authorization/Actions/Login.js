import request from "supertest";
import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";

class Login extends BaseTest {
  async run() {
    test("POST /login - SUCCESS", async test => {
      const { user } = await this.registerTestUser();
      const response = await request(this.express)
        .post("/api/v1/login")
        .send({
          email: user.email,
          password: "aaaaaa0!"
        });

      test.notEqual(response.headers.authorization, undefined, 'Authorization header not undefined');
      test.notEqual(response.headers.authorization, null, 'Authorization header not null');
      test.equal(response.headers.authorization.substring(0, 7), 'Bearer ', 'Has Bearer authorization header');
      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");
      test.equal(response.body.model.email, user.email, "Field 'email' matches");
      test.equal(response.body.model.firstName, user.firstName, "Field 'firstName' matches");
      test.equal(response.body.model.lastName, user.lastName, "Field 'lastName' matches");

      test.end();
    });

    test("POST /login - NOT REGISTERED", async test => {
      const email = this.getRandomEmail();
      const response = await request(this.express)
        .post("/api/v1/login")
        .send({
          email,
          password: "aaaaaa0!"
        });

      test.equal(response.statusCode, 404);
      test.equal(response.headers.authorization, undefined, 'Authorization header not defined');
      test.equal(response.body.error, true, "Error occurred");
      test.equal(response.body.errors[0], "User not found", "Field 'errors' matches");

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Login;
