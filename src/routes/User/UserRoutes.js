const {
  authorizeAdmin,
  authorizeRequest,
  isUserAccessingOwnData,
} = require("../../middlewares/AuthorizeRequest");
const UserRouter = require("express").Router();

const {
  getOneUser,
  getAllUsers,
  loginUser,
  registerUser,
  updateUserById,
  sendPasswordResetOTP,
  validatePasswordResetOTP,
  updateUserPasswordByOTP,
  updateUserPasswordByOldPassword,
  deleteUserById,
} = require("../../controllers/User/UserController");
const { loginRateLimiter } = require("../../middlewares/RateLimiters");

UserRouter.get("/find/:id", authorizeRequest, getOneUser);
UserRouter.get("/all", authorizeRequest, getAllUsers);
UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginRateLimiter, loginUser);
UserRouter.post("/send-otp", sendPasswordResetOTP);
UserRouter.post("/validate-otp", validatePasswordResetOTP);
UserRouter.patch("/reset", updateUserPasswordByOTP);
UserRouter.patch(
  "/update/:id",
  authorizeRequest,
  isUserAccessingOwnData,
  updateUserById
);
UserRouter.patch("/resetpassword/:email", updateUserPasswordByOldPassword);
UserRouter.delete(
  "/delete/:id",
  authorizeRequest,
  isUserAccessingOwnData,
  deleteUserById
);

module.exports = UserRouter;
