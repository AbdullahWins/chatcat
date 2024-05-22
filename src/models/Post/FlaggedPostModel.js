// flagged post model
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { FlaggedPostDTO } = require("../../dtos/PostDTO");
const {
  CustomError,
} = require("../../services/responseHandlers/HandleResponse");

const flaggedPostSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => Timekoto(),
  },
});

//get all flagged posts with user populated and filtered with dto
flaggedPostSchema.statics.getAllFlaggedPosts = async function () {
  try {
    // Find all posts and populate the userId field while excluding the password field
    const flaggedPosts = await this.find()
      .populate({
        path: "postId",
        // model: "User",
        // select: "-password",
        options: { lean: true },
      })
      .populate({
        path: "flaggedBy",
        // model: "User",
        // select: "-password",
        options: { lean: true },
      });

    if (flaggedPosts?.length === 0) {
      throw new CustomError(404, "No flagged posts found");
    }

    // Transform user objects into DTO format for each post
    const transformedPosts = flaggedPosts.map((flaggedPost) => {
      const flaggedPostDTO = new FlaggedPostDTO(flaggedPost);
      return flaggedPostDTO;
    });

    // Return transformed posts
    return transformedPosts;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//add new flagged post with user and post populated and dto
flaggedPostSchema.statics.addOneFlaggedPost = async function (data) {
  try {
    const { postId, flaggedBy, subject, description } = data;
    const flaggedPost = new this({
      postId,
      flaggedBy,
      subject,
      description,
    });

    // Save flagged post
    const result = await flaggedPost.save();

    if (!result) {
      throw new CustomError(500, "Failed to flag post");
    }

    // Populate the postId field
    await this.populate(result, {
      path: "postId",
      select: "-password", // Exclude fields you don't want to return
      options: { lean: true },
    });

    // Populate the flaggedBy field
    await this.populate(result, {
      path: "flaggedBy",
      select: "-password", // Exclude fields you don't want to return
      options: { lean: true },
    });

    // Transform flagged post object into DTO format
    const flaggedPostDTO = new FlaggedPostDTO(result);

    // Return transformed flagged post
    return flaggedPostDTO;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const FlaggedPost = mongoose.model("FlaggedPost", flaggedPostSchema);

module.exports = FlaggedPost;
