const MainRouter = require("express").Router();

//import routes
const DefaultRouter = require("./DefaultRoutes");
const AdminRouter = require("../Admin/AdminRoutes");
const UserRouter = require("../User/UserRoutes");
const PostRouter = require("../Post/PostRoutes");
const FlaggedPostRouter = require("../Post/FlaggedPostRoutes");


//routes with prefixes
MainRouter.use("/admins", AdminRouter);
MainRouter.use("/users", UserRouter);
MainRouter.use("/posts", PostRouter);
MainRouter.use("/flagged-posts", FlaggedPostRouter);

//routes
MainRouter.use(DefaultRouter);

module.exports = { MainRouter };
