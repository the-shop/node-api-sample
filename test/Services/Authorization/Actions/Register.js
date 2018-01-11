import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";

class Register extends BaseTest {
  async run() {
    test("POST /register", async test => {
      const { user, response } = await this.registerTestUser();

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");
      test.equal(response.body.model.email, user.email, "Field 'email' matches");
      test.equal(response.body.model.firstName, user.firstName, "Field 'firstName' matches");
      test.equal(response.body.model.lastName, user.lastName, "Field 'lastName' matches");

      test.end();
    });

    test("POST /register - invalid password, missing one number and one special character - FAIL #1", async test => {
      const { response } = await this.registerTestUser(
        this.getRandomizer().randomHex(1),
        this.getRandomizer().randomHex(1),
        this.getRandomEmail(),
        "admin",
        "password"
      );

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(
      response.body.errors[0],
      "Password must be at least 8 characters long and must contain at least one number and one special character!"
      );

      test.end();
    });

    test("POST /register - invalid password missing at least one special character - FAIL #2", async test => {
      const { response } = await this.registerTestUser(
        this.getRandomizer().randomHex(1),
        this.getRandomizer().randomHex(1),
        this.getRandomEmail(),
        "admin",
        "password0"
      );

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(
      response.body.errors[0],
      "Password must be at least 8 characters long and must contain at least one number and one special character!"
      );

      test.end();
    });

    test("POST /register - invalid password missing at least one number - FAIL #2", async test => {
      const { response } = await this.registerTestUser(
        this.getRandomizer().randomHex(1),
        this.getRandomizer().randomHex(1),
        this.getRandomEmail(),
        "admin",
        "password!"
      );

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(
      response.body.errors[0],
      "Password must be at least 8 characters long and must contain at least one number and one special character!"
      );

      test.end();
    });

    test("POST /register - invalid password not at least 8 characters long - FAIL #3", async test => {
      const { response } = await this.registerTestUser(
        this.getRandomizer().randomHex(1),
        this.getRandomizer().randomHex(1),
        this.getRandomEmail(),
        "admin",
        "pass0!#"
      );

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(
      response.body.errors[0],
      "Password must be at least 8 characters long and must contain at least one number and one special character!"
      );

      test.end();
    });

    test("POST /register - malformed email format - FAIL", async test => {
      const { response } = await this.registerTestUser(
        this.getRandomizer().randomHex(1),
        this.getRandomizer().randomHex(1),
        "testWrongEmail",
        "admin",
        "pass0!#"
      );

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(
      response.body.errors[0],
      "Invalid email format."
      );

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Register;
