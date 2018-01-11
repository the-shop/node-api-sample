import request from "supertest";
import test from "tape-promise/tape";
import PostsBaseTest from "../PostsBaseTest";

class Load extends PostsBaseTest {
  async run() {
    // Test with authorization token - should be success
    test("LOAD /posts - SUCCESS", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const { post } = await this.createTestPost(headers);

      const response = await request(this.express)
        .get("/api/v1/posts")
        .set("Authorization", headers.authorization)
        .query({
          query: JSON.stringify({
            title: post.title,
          }),
          search: JSON.stringify({
            content: post.content,
          }),
        });

      test.equal(response.statusCode, 200);
      test.equal(response.body.error, false, "No error");
      test.equal(Array.isArray(response.body.models), true, "Field type 'models' is array");

      response.body.models.map(one => this.validateModelResponseFields(one));

      const testSimplifiedSearchResponse = await request(this.express)
        .get("/api/v1/posts")
        .set("Authorization", headers.authorization)
        .query({
          search: "test" 
        });

      test.equal(testSimplifiedSearchResponse.statusCode, 200);
      test.equal(testSimplifiedSearchResponse.body.error, false, "No error");
      test.equal(Array.isArray(testSimplifiedSearchResponse.body.models), true, "Field type 'models' is array");

      testSimplifiedSearchResponse.body.models.map(one => this.validateModelResponseFields(one));

      test.end();
    });

    // Test without authorization token - API should error out
    test("LOAD /posts - FAIL (unauthorized)", async test => {
      const response = await request(this.express)
        .get("/api/v1/posts");

      test.equal(response.statusCode, 401);
      test.equal(response.body.error, true, "Error occurred");
      test.equal(response.body.errors.length, 1, "One error returned");
      test.equal(response.body.errors[0], "No auth token", "Field 'errors' matches");

      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Load;
