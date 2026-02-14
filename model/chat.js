const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
  ],
  latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  updatedAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports={
    Chat
}