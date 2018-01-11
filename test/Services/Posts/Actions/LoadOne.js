import request from "supertest";
import test from "tape-promise/tape";
import PostsBaseTest from "../PostsBaseTest";

class LoadOne extends PostsBaseTest {
  async run() {
    // Test with authorization token - should be success
    test("LOAD-ONE /posts - SUCCESS", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const { post } = await this.createTestPost(headers);

      const response = await request(this.express)
        .get("/api/v1/posts/" + post.id)
        .set("Authorization", headers.authorization);

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");

      this.validateModelResponseFields(response.body.model);

      test.end();
    });

    // Test without authorization token - API should error out
    test("LOAD-ONE /posts - FAIL (unauthorized)", async test => {
      const response = await request(this.express)
        .get("/api/v1/posts/1234567890123");

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
