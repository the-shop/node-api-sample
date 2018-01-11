import request from "supertest";
import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";

class PostsBaseTest extends BaseTest {
  async createTestPost(headers) {
    const { authorization } = headers;
    const response = await request(this.express)
      .post("/api/v1/posts")
      .set("Authorization", authorization)
      .send({
        title: this.getRandomizer().randomHex(1),
        content: this.getRandomizer().randomHex(10),
      });

    return {
      response,
      headers: response.headers,
      post: response.body.model,
    }
  }

  validateModelResponseFields(responseModel) {
    test("Validate 'Post' model response properties", test => {
      test.equal(typeof responseModel.title, "string");
      test.equal(typeof responseModel.content, "string");

      test.end();
    });
  }
}

export default PostsBaseTest;
