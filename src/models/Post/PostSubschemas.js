const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");

//post like schema
const postLikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

//post comment schema
const postCommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  repliedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => Timekoto(),
  },
});

module.exports = { postLikeSchema, postCommentSchema };
