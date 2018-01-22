import request from "supertest";
import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import UsersCollection from "../../../../src/Services/Users/Collections/Users";
import mongoose from "mongoose";

class PasswordChange extends BaseTest {
  async run() {
    test("POST /password-change - FAIL - password field missing", async test => {
      const { headers } = await this.registerTestUser();

      const response = await request(this.express)
        .post("/api/v1/password-change")
        .set("Authorization", headers.authorization);

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Field \"currentPassword\" is required");

      test.end();
    });

    test("POST /password-change - FAIL - passwordRepeat field is missing", async test => {
      const { headers } = await this.registerTestUser();
      const response = await request(this.express)
        .post("/api/v1/password-change")
        .set("Authorization", headers.authorization)
        .send({
          currentPassword: "aaaaaa0!",
          password: "aaaaaaa1!"
        });

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Field \"passwordRepeat\" is required");

      test.end();
    });

    test("POST /password-change - FAIL - passwords don't match", async test => {
      const { headers } = await this.registerTestUser();
      const response = await request(this.express)
        .post("/api/v1/password-change")
        .set("Authorization", headers.authorization)
        .send({
          currentPassword: "aaaaaa0!",
          password: "aaaaaaa1!",
          passwordRepeat: "aaaaaaa2!"
        });

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Passwords don't match");

      test.end();
    });

    test("POST /password-change - FAIL - current password doesn't match", async test => {
      const { headers } = await this.registerTestUser();
      const response = await request(this.express)
        .post("/api/v1/password-change")
        .set("Authorization", headers.authorization)
        .send({
          currentPassword: "password2",
          password: "aaaaaaa1!",
          passwordRepeat: "aaaaaaa1!"
        });

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Current password is not correct");

      test.end();
    });

    test("POST /password-change - Success", async test => {
      const email = this.getRandomEmail();
      const user = UsersCollection.create({
        firstName: this.getRandomizer().randomHex(1),
        lastName: this.getRandomizer().randomHex(1),
        email: email,
        role: "admin",
        timeCreated: new Date(),
        timeEdited: new Date(),
        owner:  mongoose.Types.ObjectId().toString(),
        password: "aaaaaa0!"
      });

      user.generatePasswordRestToken()
        .save();

      // Login user so we can get authorization header
      const loginResponse = await request(this.express)
        .post("/api/v1/login")
        .send({
          email,
          password: "aaaaaa0!"
        });

      const response = await request(this.express)
        .post("/api/v1/password-change")
        .set("Authorization", loginResponse.headers.authorization)
        .send({
          currentPassword: "aaaaaa0!",
          password: "aaaaaaa1!",
          passwordRepeat: "aaaaaaa1!"
        });

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false);

      // Test login with old password - login failed
      const afterPasswordChangedLoginFail = await request(this.express)
        .post("/api/v1/login")
        .send({
          email,
          password: "aaaaaa0!"
        });

      test.equal(afterPasswordChangedLoginFail.statusCode, 401);
      test.equal(afterPasswordChangedLoginFail.headers.authorization, undefined, 'Authorization header not defined');
      test.equal(afterPasswordChangedLoginFail.body.error, true, "Error occurred");
      test.equal(afterPasswordChangedLoginFail.body.errors[0], "Invalid login email or password");

      // Test login with new password - login successful
      const afterPasswordChangedLoginSuccess = await request(this.express)
        .post("/api/v1/login")
        .send({
          email,
          password: "aaaaaaa1!"
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

export default PasswordChange;
