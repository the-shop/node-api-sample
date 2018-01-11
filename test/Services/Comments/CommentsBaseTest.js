import request from "supertest";
import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";

class CommentsBaseTest extends BaseTest {
  async createTestComment(headers) {
    const { authorization } = headers;
    const response = await request(this.express)
      .post("/api/v1/comments")
      .set("Authorization", authorization)
      .send({
        owner: this.getRandomizer().randomHex(10),
        content: this.getRandomizer().randomHex(10),
      });

    return {
      response,
      headers: response.headers,
      comment: response.body.model,
    }
  }

  validateModelResponseFields(responseModel) {
    test("Validate 'Comment' model response properties", test => {
      test.equal(typeof responseModel.owner, "string");
      test.equal(typeof responseModel.content, "string");

      test.end();
    });
  }
}

export default CommentsBaseTest;
