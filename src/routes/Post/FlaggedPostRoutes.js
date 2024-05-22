const FlaggedPostRouter = require("express").Router();
const {
  authorizeAdmin,
  authorizeRequest,
} = require("../../middlewares/AuthorizeRequest");

const {
  getAllFlaggedPosts,
  addOneFlaggedPost,
} = require("../../controllers/Post/FlaggedPostController");

FlaggedPostRouter.get("/all", authorizeAdmin, getAllFlaggedPosts);
// FlaggedPostRouter.get("/find/:id", authorizeAdmin, getOnePost);
FlaggedPostRouter.post("/add", authorizeRequest, addOneFlaggedPost);
// FlaggedPostRouter.patch("/update-content/:id", authorizeAdmin, updatePostContentById);
// FlaggedPostRouter.patch("/update-privacy/:id", authorizeAdmin, updatePostPrivacyById);
// FlaggedPostRouter.patch("/update-likes/:id", authorizeAdmin, updatePostLikesById);
// FlaggedPostRouter.patch(
//   "/update-comments/:id",
//   authorizeAdmin,
//   updatePostCommentsById
// );
// FlaggedPostRouter.delete("/delete/:id", authorizeAdmin, deleteOnePostById);

module.exports = FlaggedPostRouter;
