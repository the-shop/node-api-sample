import request from "supertest";
import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import UsersCollection from "../../../../src/Services/Users/Collections/Users";
import config from "../../../../src/config";

class PasswordResetUpdate extends BaseTest {
  async run() {
    test("POST /password-reset - FAIL - token field missing", async test => {
      const response = await request(this.express)
        .post("/api/v1/password-reset");

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Field \"token\" is required.");

      test.end();
    });

    test("POST /password-reset - FAIL - password field missing", async test => {
      const response = await request(this.express)
        .post("/api/v1/password-reset")
        .send({
          token: "testToken"
        });

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Field \"password\" is required.");

      test.end();
    });

    test("POST /password-reset - FAIL - passwordConfirm field missing", async test => {
      const response = await request(this.express)
        .post("/api/v1/password-reset")
        .send({
          token: "testToken",
          password: "aaaaaa0!"
        });

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Field \"passwordConfirm\" is required.");

      test.end();
    });

    test("POST /password-rest - FAIL - passwords don't match", async test => {
      const { headers } = await this.registerTestUser();
      const response = await request(this.express)
        .post("/api/v1/password-reset")
        .set("Authorization", headers.authorization)
        .send({
          token: "testToken",
          password: "aaaaaa0!",
          passwordConfirm: "aaaaaaa1!"
        });

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Field \"password\" and \"passwordConfirm\" doesn't match.");

      test.end();
    });

    test("POST /password-reset - FAIL - token doesn't exist", async test => {
      const { headers } = await this.registerTestUser();

      const response = await request(this.express)
        .post("/api/v1/password-reset")
        .set("Authorization", headers.authorization)
        .send({
          password: "passwordChanged",
          passwordConfirm: "passwordChanged",
          token: this.getRandomizer().randomHex()
        });

      test.equal(response.statusCode, 404);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Token doesn't exist or has expired.");

      test.end();
    });

    test("POST /password-reset - FAIL - token expired", async test => {
      const user = UsersCollection.create({
        firstName: this.getRandomizer().randomString(1),
        lastName: this.getRandomizer().randomString(1),
        email: this.getRandomEmail(),
        role: "admin",
        password: "aaaaaa0!"
      });
      await user.save();

      const randomToken = this.getRandomizer().randomHex();
      user.passResetToken = randomToken;
      user.passResetTime = Math.round((new Date()).getTime() / 1000) - (config.password.resetTokenTimeoutSeconds + 100);
      await user.save();

      const response = await request(this.express)
        .post("/api/v1/password-reset")
        .send({
          token: randomToken,
          password: "passwordChanged",
          passwordConfirm: "passwordChanged"
        });

      test.equal(response.statusCode, 404);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Token doesn't exist or has expired.");

      test.end();
    });

    test("POST /password-reset - Success", async test => {
      const user = UsersCollection.create({
        firstName: this.getRandomizer().randomString(1),
        lastName: this.getRandomizer().randomString(1),
        email: this.getRandomEmail(),
        role: "admin",
        password: "aaaaaa0!"
      });
      await user.save();

      const randomToken = this.getRandomizer().randomHex();
      user.passResetToken = randomToken;
      user.passResetTime = Math.round((new Date()).getTime() / 1000);
      await user.save();

      const resetPasswordResponse = await request(this.express)
        .post("/api/v1/password-reset")
        .send({
          token: randomToken,
          password: "aaaaaa1!",
          passwordConfirm: "aaaaaa1!"
        });

      test.equal(resetPasswordResponse.statusCode, 200);
      test.equal(resetPasswordResponse.body.error, false);

      // Test login with new password - login successful
      const afterPasswordChangedLoginSuccess = await request(this.express)
        .post("/api/v1/login")
        .send({
          email: user.email,
          password: "aaaaaa1!"
        });

      test.equal(afterPasswordChangedLoginSuccess.statusCode, 200);
      test.equal(afterPasswordChangedLoginSuccess.body.error, false);
      test.equal(afterPasswordChangedLoginSuccess.body.model.email, user.email);
      test.equal(afterPasswordChangedLoginSuccess.body.model.firstName, user.firstName);
      test.equal(afterPasswordChangedLoginSuccess.body.model.lastName, user.lastName);

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default PasswordResetUpdate;
