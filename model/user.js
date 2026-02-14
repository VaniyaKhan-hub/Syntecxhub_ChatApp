const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: []
  }],

  sentRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: []
  }],

  receivedRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: []
  }],

  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    default: []
  }]

}, { timestamps: true });



const User = mongoose.model("Users", userSchema);

module.exports = {
    User
}
