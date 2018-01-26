import request from "supertest";
import test from 'tape-promise/tape'
import BaseTest from "../../../BaseTest";
import PasswordResetRequestAction from "../../../../src/Services/Authorization/Actions/PasswordResetRequest";
import Application from "../../../../src/Application";
import UsersCollection from "../../../../src/Services/Users/Collections/Users";

class PasswordResetRequest extends BaseTest {
  async run() {
    test("POST /password-reset-request - FAIL - email field missing", async test => {
      const response = await request(this.express)
        .post("/api/v1/password-reset-request");

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Field \"email\" is required");

      test.end();
    });

    test("POST /password-reset-request - FAIL - wrong email format", async test => {
      const response = await request(this.express)
        .post("/api/v1/password-reset-request")
        .send({
          email: "wrongEmail@wrongTest"
        });

      test.equal(response.statusCode, 400);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "Invalid email format.");

      test.end();
    });

    test("POST /password-change - FAIL - user does not exist", async test => {
      const response = await request(this.express)
        .post("/api/v1/password-reset-request")
        .send({
          email: this.getRandomEmail()
        });

      test.equal(response.statusCode, 404);
      test.equal(response.body.error, true);
      test.equal(response.body.errors[0], "User with provided email doesn't exist.");

      test.end();
    });

    test("POST /password-reset-request - Success", async test => {
      const { headers, user } = await this.registerTestUser();

      const response = await request(this.express)
        .post("/api/v1/password-reset-request")
        .send({
          email: user.email
        });

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false);

      /**
       * If password can be changed it means that passResetToken and passResetTime are set
       * with passwordResetRequest
       */
      const tryChangePassword = await request(this.express)
        .post("/api/v1/password-change")
        .set("Authorization", headers.authorization)
        .send({
          currentPassword: "aaaaaa0!",
          password: "aaaaaa1!",
          passwordRepeat: "aaaaaa1!"
        });

      test.equal(tryChangePassword.statusCode, 200);
      test.equal(tryChangePassword.body.error, false);

      test.end();
    });

    test("POST /password-reset-request - test if post hook is triggered - SUCCESS", async test => {
      const user = UsersCollection.create({
        firstName: this.getRandomizer().randomString(1),
        lastName: this.getRandomizer().randomString(1),
        email: this.getRandomEmail(),
        role: "admin",
        password: "aaaaaa0!"
      });
      await user.save();

      const app = new Application();

      const passwordResetUpdate = new PasswordResetRequestAction();
      passwordResetUpdate.setApplication(app);

      const resetPasswordResponse = await passwordResetUpdate.handle({
        email: user.email
      });

      test.equal(resetPasswordResponse.email, user.email);
      test.equal(resetPasswordResponse.firstName, user.firstName);
      test.equal(resetPasswordResponse.lastName, user.lastName);

      const triggeredHooks = app.getEventsRegistry().getAllTriggered();

      test.equal(triggeredHooks[0].eventName, "EVENT_ACTION_PASSWORD_RESET_REQUEST_POST");
      test.equal(triggeredHooks[0].listener, "SendPasswordResetLink");
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default PasswordResetRequest;
