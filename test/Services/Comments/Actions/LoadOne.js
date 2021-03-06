import request from "supertest";
import test from "tape-promise/tape";
import CommentsBaseTest from "../CommentsBaseTest";

class LoadOne extends CommentsBaseTest {
  async run() {
    // Test with authorization token - should be success
    test("LOAD-ONE /comments - SUCCESS", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const { comment } = await this.createTestComment(headers);

      const response = await request(this.express)
        .get("/api/v1/comments/" + comment.id)
        .set("Authorization", headers.authorization);

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");

      this.validateModelResponseFields(response.body.model);

      test.end();
    });

    // Test without authorization token - API should error out
    test("LOAD-ONE /comments - FAIL (unauthorized)", async test => {
      const response = await request(this.express)
        .get("/api/v1/comments/1234567890123");

      test.equal(response.statusCode, 401);
      test.equal(response.body.error, true, "Error occurred");
      test.equal(response.body.errors.length, 1, "One error returned");
      test.equal(response.body.errors[0], "No auth token", "Field 'errors' matches");
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default LoadOne;
