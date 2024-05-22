// models/Post.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { ENUM_POST_PRIVACY } = require("../../constants/PostConstants");
const { postLikeSchema, postCommentSchema } = require("./PostSubschemas");
const { PostCommentDTO, PostLikeDTO } = require("../../dtos/PostDTO");
const { UserPostDTO } = require("../../dtos/UserDTO");
const {
  CustomError,
} = require("../../services/responseHandlers/HandleResponse");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  privacy: {
    type: String,
    enum: ENUM_POST_PRIVACY,
    default: "public",
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  likes: {
    type: [postLikeSchema],
    default: [],
  },
  comments: {
    type: [postCommentSchema],
    default: [],
  },
  createdAt: {
    type: String,
    default: () => Timekoto(),
  },
});

// Define a static method to get all posts
postSchema.statics.getAllPosts = async function () {
  try {
    // Find all posts and populate the userId field while excluding the password field
    const posts = await this.find()
      .populate({
        path: "userId",
        // model: "User",
        // select: "-password",
        options: { lean: true },
      })
      .populate({
        path: "likes.userId",
        options: { lean: true },
      })
      .populate({
        path: "comments.userId",
        options: { lean: true },
      });

    if (posts?.length === 0) {
      throw new CustomError(404, "No posts found");
    }

    // Transform user objects into DTO format for each post
    const transformedPosts = posts.map((post) => {
      const userDTO = new UserPostDTO(post?.userId);
      // Transform likes array into DTO format
      const likesDTO = post.likes.map((like) => new PostLikeDTO(like));
      // Transform comments array into DTO format
      const commentsDTO = post.comments.map(
        (comment) => new PostCommentDTO(comment)
      );
      const populatedPost = {
        ...post.toObject(),
        userId: userDTO,
        likes: likesDTO,
        comments: commentsDTO,
      };

      return populatedPost;
    });
    // Return transformed posts
    return transformedPosts;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//get post by id
postSchema.statics.getPostByPostId = async function (postId) {
  try {
    // Populate the userId field and exclude the password field
    const post = await this.findById(postId)
      .populate({
        path: "userId",
        options: { lean: true },
      })
      .populate({
        path: "likes.userId",
        options: { lean: true },
      })
      .populate({
        path: "comments.userId",
        options: { lean: true },
      });

    if (!post) {
      throw new CustomError(404, "Post not found");
    }

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(post?.userId);

    // Transform likes array into DTO format
    const likesDTO = post?.likes?.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = post.comments.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...post.toObject(),
      userId: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//create a new student
postSchema.statics.createNewPost = async function (post) {
  try {
    const newPost = new this(post);
    const savedPost = await newPost.save();
    // Populate the userId field for the saved post
    await savedPost.populate("userId");

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(savedPost?.userId);

    // Return the saved post with transformed userId

    const finalResponse = {
      ...savedPost.toObject(),
      userId: userDTO,
    };
    return finalResponse;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//update post content by id
postSchema.statics.updatePostContentById = async function (postId, post) {
  try {
    const { content, image } = post;
    // Construct update object with available fields
    const updateData = {};
    if (content) {
      updateData.content = content;
    }
    if (image) {
      updateData.image = image;
    }
    // Find and update the post by id
    const updatedPost = await this.findByIdAndUpdate(
      postId,
      { $set: updateData },
      { new: true }
    )
      .populate({
        path: "userId",
        options: { lean: true },
      })
      .populate({
        path: "likes.userId",
        options: { lean: true },
      })
      .populate({
        path: "comments.userId",
        options: { lean: true },
      });

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(updatedPost?.userId);

    // Transform likes array into DTO format
    const likesDTO = updatedPost.likes.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = updatedPost.comments.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...updatedPost.toObject(),
      userId: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//update post content by id
postSchema.statics.updatePostPrivacyById = async function (postId, privacy) {
  try {
    //check if the privacy value valid
    if (ENUM_POST_PRIVACY[privacy] === undefined) {
      throw new CustomError(400, "Invalid privacy value");
    }
    //check if the post exists
    const post = await this.findById(postId);
    if (!post) {
      throw new CustomError(404, "Post not found");
    }
    // Find and update the post by id
    const updatedPost = await this.findByIdAndUpdate(
      postId,
      { $set: { privacy } },
      { new: true }
    )
      .populate({
        path: "userId",
        options: { lean: true },
      })
      .populate({
        path: "likes.userId",
        options: { lean: true },
      })
      .populate({
        path: "comments.userId",
        options: { lean: true },
      });

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(updatedPost?.userId);

    // Transform likes array into DTO format
    const likesDTO = updatedPost?.likes?.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = updatedPost?.comments?.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...updatedPost?.toObject(),
      userId: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//update post likes by id
postSchema.statics.updatePostLikesById = async function (postId, userId) {
  try {
    // Check if the user has already liked the post
    const post = await this.findById(postId);
    if (!post) {
      throw new CustomError(404, "Post not found");
    }
    const likedIndex = post?.likes?.findIndex((like) =>
      like?.userId?.equals(userId)
    );

    // Find the post by id and update the likes array
    let updatedPost;
    if (likedIndex !== -1) {
      // User has already liked the post, so remove the like
      updatedPost = await this.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: { userId } },
        },
        { new: true }
      );
    } else {
      // User hasn't liked the post, so add the like
      updatedPost = await this.findByIdAndUpdate(
        postId,
        {
          $addToSet: { likes: { userId } },
        },
        { new: true }
      );
    }

    // Populate the updated post
    updatedPost = await this.findById(postId)
      .populate({
        path: "userId",
        options: { lean: true },
      })
      .populate({
        path: "likes.userId",
        options: { lean: true },
      })
      .populate({
        path: "comments.userId",
        options: { lean: true },
      });

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(updatedPost?.userId);

    // Transform likes array into DTO format
    const likesDTO = updatedPost?.likes?.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = updatedPost?.comments?.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...updatedPost?.toObject(),
      userId: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//update post comments by id
postSchema.statics.updatePostCommentsById = async function (postId, comment) {
  try {
    //check if the post exists
    const post = await this.findById(postId);
    if (!post) {
      throw new CustomError(404, "Post not found");
    }
    // Find and update the post by id
    const updatedPost = await this.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate({
        path: "userId",
        options: { lean: true },
      })
      .populate({
        path: "likes.userId",
        options: { lean: true },
      })
      .populate({
        path: "comments.userId",
        options: { lean: true },
      });

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(updatedPost?.userId);

    // Transform likes array into DTO format
    const likesDTO = updatedPost.likes.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = updatedPost.comments.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...updatedPost.toObject(),
      userId: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//delete post by id
postSchema.statics.deletePostById = async function (postId) {
  try {
    //to perform multiple filters at once
    const filter = {
      _id: postId,
    };
    // Find and delete the post by id
    const deletedPost = await this.findByIdAndDelete(filter);
    if (!deletedPost) {
      throw new CustomError(404, "Post not found");
    }
    return deletedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
