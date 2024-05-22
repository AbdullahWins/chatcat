//Post DTOs

const { UserPostDTO } = require("./UserDTO");

class PostDTO {
  constructor(post) {
    this._id = post?._id || null;
    this.userId = post?.userId ? new UserPostDTO(post.userId) : null;
    this.content = post?.content || "";
    this.privacy = post?.privacy || "";
    this.createdAt = post?.createdAt || "";
  }
}

class PostLikeDTO {
  constructor(like) {
    this.userId = like?.userId ? new UserPostDTO(like.userId) : null;
  }
}

class PostCommentDTO {
  constructor(comment) {
    this.userId = comment?.userId ? new UserPostDTO(comment.userId) : null;
    this.repliedTo = comment?.repliedTo
      ? new UserPostDTO(comment.userId)
      : null;
    this.content = comment?.content || "";
    this.createdAt = comment?.createdAt || "";
  }
}

class FlaggedPostDTO {
  constructor(post) {
    this._id = post?._id || null;
    this.postId = post?.postId ? new PostDTO(post.postId) : null;
    this.flaggedBy = post?.flaggedBy ? new UserPostDTO(post.flaggedBy) : null;
    this.subject = post?.subject || "";
    this.description = post?.description || "";
    this.createdAt = post?.createdAt || "";
  }
}

module.exports = { PostLikeDTO, PostCommentDTO, FlaggedPostDTO };
