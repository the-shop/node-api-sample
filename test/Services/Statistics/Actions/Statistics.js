import request from "supertest";
import test from "tape-promise/tape";
import BaseTest from "../../../BaseTest";
import UsersCollection from "../../../../src/Services/Users/Collections/Users";
import PostsCollection from "../../../../src/Services/Posts/Collections/Posts";
import CommentsCollection from "../../../../src/Services/Comments/Collections/Comments";
import mongoose from "mongoose";

class Statistics extends BaseTest {
  async run() {
    test("GET /statistics/counts - success", async test => {
      // Authorize request
      const { headers } = await this.registerTestUser();

      const usersCount = await UsersCollection.count();
      const filteredUsersAdminCount = await UsersCollection.count({ role: "admin" });
      const filteredUsersUserCount = await UsersCollection.count({ role: "user" });
      const postsCount = await PostsCollection.count();
      const commentsCount = await CommentsCollection.count();
      const user = UsersCollection.create({
        firstName: this.getRandomizer().randomHex(1),
        lastName: this.getRandomizer().randomHex(1),
        email: this.getRandomEmail(),
        role:  "admin",
      });
      await user.save();

      const post = PostsCollection.create({
        title: this.getRandomizer().randomHex(1),
        content: this.getRandomizer().randomHex(10),
      });
      await post.save();

      const comment = CommentsCollection.create({
        ownerId:  mongoose.Types.ObjectId().toString(),
        content: this.getRandomizer().randomHex(10),
      });
      await comment.save();


      const response = await request(this.express)
        .get("/api/v1/statistics/counts")
        .set("Authorization", headers.authorization);

      test.equal(response.body.error, false);
      test.equal(response.body.model.totals.users, usersCount + 1);
      test.equal(response.body.model.filtered.users.admin, filteredUsersAdminCount + 1);
      test.equal(response.body.model.filtered.users.user, filteredUsersUserCount);
      test.equal(response.body.model.totals.posts, postsCount + 1);
      test.equal(response.body.model.totals.comments, commentsCount + 1);
      test.end();
    });

    test.onFinish(() => process.exit(0)); // eslint-disable-line
  }
}

export default Statistics;
