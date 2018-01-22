import request from "supertest";
import test from "tape-promise/tape";
import PostsBaseTest from "../PostsBaseTest";
import mongoose from "mongoose";

class Update extends PostsBaseTest {
  async run() {
    // Test with authorization token - should be success
    test("PUT /posts/:id - SUCCESS", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const { response, post } = await this.createTestPost(headers);

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");

      const responseObject = await request(this.express)
        .put("/api/v1/posts/" + post.id)
        .send({
          title: post.title,
          content: post.content,
        })
        .set("Authorization", headers.authorization);

      test.equal(responseObject.statusCode, 200);
      test.equal(responseObject.body.error, false);

      this.validateModelResponseFields(responseObject.body.model);

      test.end();
    });

    // Test without authorization token - API should error out
    test("PUT /posts/:id - FAIL (unauthorized)", async test => {
      const response = await request(this.express)
        .put("/api/v1/posts/1234567890123");

      test.equal(response.statusCode, 401);
      test.equal(response.body.error, true, "Error occurred");
      test.equal(response.body.errors.length, 1, "One error returned");
      test.equal(response.body.errors[0], "No auth token", "Field 'errors' matches");
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Update;
