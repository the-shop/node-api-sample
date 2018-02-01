import test from "tape-promise/tape";
import request from "supertest";
import BaseTest from "../BaseTest";
import DummyResponseOutputListener from "../DummyListeners/DummyResponseOutputListener";
import ApiResponseOutput from "../../src/Listeners/ApiResponseOutput";
import UsersCollection from "../../src/Services/Users/Collections/Users";

class ResponseOutputListener extends BaseTest {
  async run() {
    test("ResponseOutputListener - modify output - SUCCESS", async test => {
      const listener = new DummyResponseOutputListener();
      const outData = {
        error: false,
        model: {
          test: "testing",
          foo: "bar"
        }
      };

      const response = await listener.handle(outData);

      test.deepEqual({
        modifiedOutput: {
          test: "testing",
          foo: "bar"
        }
      }, response);
      test.end();
    });

    test("ResponseOutputListener - functional test - SUCCESS", async test => {
      const app = this.getApplication();
      const listener = new DummyResponseOutputListener();
      listener.setApplication(app);

      app.getEventsRegistry().listen(
        ApiResponseOutput.EVENT_API_RESPONSE_OUTPUT_PRE, listener
      );

      const user = UsersCollection.create({
        firstName: this.getRandomizer().randomString(1),
        lastName: this.getRandomizer().randomString(1),
        email: this.getRandomEmail(),
        role:  "admin",
      });
      await UsersCollection.save(user);

      const { headers } = await this.registerTestUser();

      const response = await request(this.express)
        .get("/api/v1/users/" + user.id)
        .set("Authorization", headers.authorization);

      test.equal(response.status, 200);
      test.equal(response.body.model, undefined);
      test.equal(response.body.error, undefined);
      test.equal(response.body.modifiedOutput.firstName, user.firstName);
      test.equal(response.body.modifiedOutput.lastName, user.lastName);
      test.equal(response.body.modifiedOutput.email, user.email);
      test.equal(response.body.modifiedOutput.role, user.role);

      const registeredListeners = app.getEventsRegistry().getAllRegistered();
      registeredListeners[ApiResponseOutput.EVENT_API_RESPONSE_OUTPUT_PRE] = [];

      test.end();
    });


    test.onFinish(() => process.exit(0)); // eslint-disable-line*/
  }
}

export default ResponseOutputListener;
