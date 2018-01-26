import request from "supertest";
import test from "tape-promise/tape";
import BaseTest from "../../BaseTest";
import moment from "moment";

class PostsBaseTest extends BaseTest {
  async createTestPost(headers) {
    const { authorization } = headers;
    const response = await request(this.express)
      .post("/api/v1/posts")
      .set("Authorization", authorization)
      .send({
        title: this.getRandomizer().randomString(1),
        content: this.getRandomizer().randomString(1000),
      });

    return {
      response,
      headers: response.headers,
      post: response.body.model,
    };
  }

  validateModelResponseFields(responseModel) {
    test("Validate 'Post' model response properties", test => {
      test.equal(typeof responseModel.title, "string");
      test.equal(typeof responseModel.content, "string");
      test.equal(typeof responseModel.timeCreated, "string");
      test.equal(moment(responseModel.timeCreated, moment.ISO_8601).isValid(), true);
      test.equal(typeof responseModel.timeEdited, "string");
      test.equal(moment(responseModel.timeEdited, moment.ISO_8601).isValid(), true);
      test.equal(typeof responseModel.owner, "string");

      test.end();
    });
  }
}

export default PostsBaseTest;
