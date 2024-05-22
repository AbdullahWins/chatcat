// Controllers/PostController.js
const { asyncHandler } = require("../../middlewares/AsyncHandler");
const Post = require("../../models/Post/PostModel");
const {
  handleFileUpload,
} = require("../../services/fileHandlers/HandleFileUpload");
const { logger } = require("../../services/logHandlers/HandleWinston");
const {
  sendResponse,
} = require("../../services/responseHandlers/HandleResponse");
const {
  ObjectIdChecker,
} = require("../../services/validationHandlers/ObjectIdChecker");

//get all Post using mongoose
const getAllPosts = async (req, res) => {
  //perform query on database
  const posts = await Post.getAllPosts();
  logger.log("info", `Found ${posts?.length} posts`);
  return sendResponse(res, 200, "Fetched all posts", posts);
};

//get single Post using mongoose
const getOnePost = async (req, res) => {
  const postId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(postId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  //perform query on database
  const post = await Post.getPostByPostId(postId);
  logger.log("info", JSON.stringify(post, null, 2));
  return sendResponse(res, 200, "Post retrieved successfully", post);
};

//add new Post using mongoose
const addOnePost = async (req, res) => {
  const { userId, privacy, content, likes, comments } = JSON.parse(
    req?.body?.data
  );
  const { files } = req;
  if (!userId || !privacy || !content || !likes || !comments) {
    return sendResponse(res, 400, "Missing required field");
  }

  //validate authority from middleware authentication
  const auth = req?.auth;
  if (!auth) {
    return sendResponse(res, 401, "Unauthorized");
  }

  //create new post object
  let updatedData = {
    userId,
    privacy,
    content,
    likes,
    comments,
  };

  const folderName = "posts";
  if (files?.single) {
    const fileUrls = await handleFileUpload({
      req,
      files: files?.single,
      folderName,
    });
    const image = fileUrls[0];
    updatedData = { ...updatedData, image };
  }

  //add new post
  const result = await Post.createNewPost(updatedData);
  logger.log("info", `Added a new post: ${JSON.stringify(result, null, 2)}`);
  return sendResponse(res, 201, "Post added successfully", result);
};

// update One post content by id using mongoose
const updatePostContentById = async (req, res) => {
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
  logger.log("info", `Updated post: ${JSON.stringify(result, null, 2)}`);
  return res.json({ success: true, result });
};

// update One post content by id using mongoose
const updatePostPrivacyById = async (req, res) => {
  const postId = req?.params?.id;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { privacy } = data;
  //object id validation
  if (!ObjectIdChecker(postId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }
  if (!privacy) {
    return sendResponse(res, 400, "Missing required field");
  }
  const result = await Post.updatePostPrivacyById(postId, privacy);
  logger.log("info", `Updated post: ${JSON.stringify(result, null, 2)}`);
  return res.json({ success: true, result });
};

// update One post likes by id using mongoose
const updatePostLikesById = async (req, res) => {
  const postId = req?.params?.id;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { userId } = data;
  //object id validation
  if (!ObjectIdChecker(postId) || !ObjectIdChecker(userId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }

  const result = await Post.updatePostLikesById(postId, userId);
  logger.log("info", `Updated post: ${JSON.stringify(result, null, 2)}`);
  return res.json({ success: true, result });
};

// update One post comments by id using mongoose
const updatePostCommentsById = async (req, res) => {
  const postId = req?.params?.id;
  const data = req?.body?.data ? JSON.parse(req?.body?.data) : {};
  const { userId, repliedTo, content } = data;
  //object id validation
  if (!ObjectIdChecker(postId) || !ObjectIdChecker(userId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }
  if (!content) {
    return sendResponse(res, 400, "Missing required field");
  }
  const comment = { userId, repliedTo, content };
  const result = await Post.updatePostCommentsById(postId, comment);
  logger.log("info", `Updated post: ${JSON.stringify(result, null, 2)}`);
  return res.json({ success: true, result });
};

//delete one post
const deleteOnePostById = async (req, res) => {
  const postId = req?.params?.id;
  //object id validation
  if (!ObjectIdChecker(postId)) {
    return sendResponse(res, 400, "Invalid ObjectId");
  }
  //delete post
  const result = await Post.deletePostById(postId);
  logger.log(
    "info",
    `post deleted: ${result?.deletedCount} post with id:  ${postId}`
  );
  return sendResponse(res, 200, "Post deleted successfully");
};

module.exports = {
  getAllPosts: asyncHandler(getAllPosts),
  getOnePost: asyncHandler(getOnePost),
  addOnePost: asyncHandler(addOnePost),
  updatePostContentById: asyncHandler(updatePostContentById),
  updatePostPrivacyById: asyncHandler(updatePostPrivacyById),
  updatePostLikesById: asyncHandler(updatePostLikesById),
  updatePostCommentsById: asyncHandler(updatePostCommentsById),
  deleteOnePostById: asyncHandler(deleteOnePostById),
};
