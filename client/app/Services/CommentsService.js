import store from "../store.js";
import Comment from "../Models/Comment.js";
import CommentsController from "../Controllers/CommentsController.js";

// @ts-ignore
const _basicApi = axios.create({
  baseURL: "/api",
  timout: 8000
});
// @ts-ignore
const _commentApi = axios.create({
  baseURL: "/api/comments",
  timeout: 8000
});
class CommentsService {
  async downVote(commentId, postId) {
    let comment = store.State.comments.find(c => c.id == commentId);
    comment.downCount += 1;
    console.log(comment);
    let res = await _commentApi.put(comment.id, comment);
    console.log(res.data);
    this.getCommentsAsync(postId);
  }
  async upVote(commentId, postId) {
    let comment = store.State.comments.find(c => c.id == commentId);
    comment.upCount += 1;
    console.log(comment);
    let res = await _commentApi.put(comment.id, comment);
    console.log(res.data);
    this.getCommentsAsync(postId);
    //let comments = store.State.comments.forEach(c => new Comment(c));
    //store.commit("comments", comments);
  }
  async editCommentAsync(update) {
    //NOTE Check that update.commentId is what you think it is
    let comment = store.State.comments.find(c => c.id == update.commentId);
    console.log(update);
    //NOTE How do you make sure only creator can edit?
    let res = await _commentApi.put(update.commentId, update);
    console.log(res);
    //store.commit("activeComment", {});
    this.getCommentsAsync(update.postId);
  }
  async removeCommentAsync(commentId, postId) {
    console.log(commentId, postId);
    let res = await _commentApi.delete(commentId);
    this.getCommentsAsync(postId);
  }
  async addCommentAsync(comment) {
    console.log(comment);

    let res = await _basicApi.post("comments", comment);
    console.log("From add CommentAsync", res);
    this.getCommentsAsync(comment.postId);
  }
  async getCommentsAsync(postId) {
    let res = await _basicApi.get("posts/" + postId + "/comments");
    //NOTE res.data path may be wrong
    let comments = res.data.map(c => new Comment(c));
    //store.commit("activeComment", new Comment(res.data));
    store.commit("comments", comments);
  }
}

const commentsService = new CommentsService();
export default commentsService;
