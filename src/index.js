// Imports
const { configureApp } = require("../config/server/configure.config.js");
const { kickstartServer } = require("../config/server/kickstart.config.js");
const { MainRouter } = require("./routes/Main/MainRouter.js");
const {
  globalErrorHandler,
} = require("./services/responseHandlers/HandleResponse.js");

// Initialize Express app
const app = configureApp();

// Routes
app.use(MainRouter);

// Global Error Handling Middleware
app.use(globalErrorHandler);

// Start the server
kickstartServer(app);
