const PostRouter = require("express").Router();
const {
  authorizeAdmin,
  authorizeRequest,
} = require("../../middlewares/AuthorizeRequest");

const {
  getAllPosts,
  getOnePost,
  addOnePost,
  updatePostContentById,
  updatePostPrivacyById,
  updatePostLikesById,
  updatePostCommentsById,
  deleteOnePostById,
} = require("../../controllers/Post/PostController");

PostRouter.get("/all", authorizeAdmin, getAllPosts);
PostRouter.get("/find/:id", authorizeRequest, getOnePost);
PostRouter.post("/add", authorizeRequest, addOnePost);
PostRouter.patch(
  "/update-content/:id",
  authorizeRequest,
  updatePostContentById
);
PostRouter.patch(
  "/update-privacy/:id",
  authorizeRequest,
  updatePostPrivacyById
);
PostRouter.patch("/update-likes/:id", authorizeRequest, updatePostLikesById);
PostRouter.patch(
  "/update-comments/:id",
  authorizeRequest,
  updatePostCommentsById
);
PostRouter.delete("/delete/:id", authorizeRequest, deleteOnePostById);

module.exports = PostRouter;
