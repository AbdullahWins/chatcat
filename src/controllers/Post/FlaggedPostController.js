// Controllers/PostController.js
const FlaggedPost = require("../../models/Post/FlaggedPostModel");
const {
  handleFileUpload,
} = require("../../services/fileHandlers/HandleFileUpload");
const { logger } = require("../../services/logHandlers/HandleWinston");
const {
  ObjectIdChecker,
} = require("../../services/validationHandlers/ObjectIdChecker");
const {
  sendResponse,
} = require("../../services/responseHandlers/HandleResponse");
const { asyncHandler } = require("../../middlewares/AsyncHandler");

//get all Post using mongoose
const getAllFlaggedPosts = async (req, res) => {
  //perform query on database
  const posts = await FlaggedPost.getAllFlaggedPosts();
  logger.log("info", `Found ${posts?.length} posts`);
  return sendResponse(res, 200, "Fetched all posts", posts);
};

//get single Post using mongoose
const getOneFlaggedPost = async (req, res) => {
  const postId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(postId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const post = await FlaggedPost.getPostByPostId(postId);
  logger.log("info", JSON.stringify(post, null, 2));
  return sendResponse(res, 200, "Post retrieved successfully", post);
};

//add new Post using mongoose
const addOneFlaggedPost = async (req, res) => {
  const { postId, flaggedBy, subject, description } = JSON.parse(
    req?.body?.data
  );
  if (!flaggedBy || !postId || !subject || !description) {
    sendResponse(res, 400, "Missing required field");
  }

  //validate authority from middleware authentication
  const auth = req?.auth;
  if (!auth) {
    return sendResponse(res, 401, "Unauthorized");
  }

  //create new post object
  let updatedData = {
    postId,
    flaggedBy,
    subject,
    description,
  };

  //add new post
  const result = await FlaggedPost.addOneFlaggedPost(updatedData);
  logger.log("info", `Flagged a post: ${JSON.stringify(result, null, 2)}`);
  return sendResponse(res, 201, "Post flagged successfully", result);
};

// update One post content by id using mongoose
const updateFlaggedPostById = async (req, res) => {
  try {
    const postId = req?.params?.id;
    const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
    const { files } = req;
    const { content } = data;
    //object id validation
    if (!ObjectIdChecker(postId)) {
      return sendResponse(res, 400, "Invalid ObjectId");
    }
    if (!content && !files?.single) {
      return sendResponse(res, 400, "Missing required field");
    }
    let updatedData = { content };
    const folderName = "posts";
    if (files?.single) {
      const fileUrls = await handleFileUpload({
        req,
        files: files?.single,
        folderName,
      });
      const image = fileUrls[0];
      updatedData = { content, image };
    }
    const result = await Post.updatePostContentById(postId, updatedData);

    if (result === null) {
      return sendResponse(res, 500, "Failed to update post");
    }
    logger.log("info", `Updated post: ${JSON.stringify(result, null, 2)}`);
    if (!result) {
      return sendResponse(res, 404, "No post found with this id");
    }
    return res.json({ success: true, result });
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return sendResponse(res, 500, "Failed to update post");
  }
};

//delete one post
const deleteOneFlaggedPostById = async (req, res) => {
  try {
    const postId = req?.params?.id;
    //object id validation
    if (!ObjectIdChecker(postId)) {
      return sendResponse(res, 400, "Invalid ObjectId");
    }

    //to perform multiple filters at once
    const filter = {
      _id: postId,
    };
    //delete post
    const result = await Post.deleteOne(filter);
    if (result?.deletedCount === 0) {
      logger.log("error", `No post found with this id: ${postId}`);
      return sendResponse(res, 404, `No post found with this id: ${postId}`);
    } else {
      logger.log("info", `post deleted: ${postId}`);
      return sendResponse(
        res,
        200,
        `Post deleted successfully with id: ${postId}`
      );
    }
  } catch (error) {
    logger.log("error", `Error: ${error?.message}`);
    return sendResponse(res, 500, "Failed to delete post");
  }
};

module.exports = {
  getAllFlaggedPosts: asyncHandler(getAllFlaggedPosts),
  getOneFlaggedPost: asyncHandler(getOneFlaggedPost),
  addOneFlaggedPost: asyncHandler(addOneFlaggedPost),
  updateFlaggedPostById: asyncHandler(updateFlaggedPostById),
  deleteOneFlaggedPostById: asyncHandler(deleteOneFlaggedPostById),
};
