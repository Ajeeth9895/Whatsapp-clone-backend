const mongoose = require("mongoose");

//schema to visualize how a database should be structured
const messageSchema = new mongoose.Schema(
  {
    name: String,
    message: String,
    timestamp: String,
    uid: String,
    roomId: String,
  },
  {
    timestamps: true,
  }
);

//model provides an interface to the database for creating, querying, updating, deleting records, etc.
const Messages = mongoose.model("messages", messageSchema);
module.exports = Messages;
