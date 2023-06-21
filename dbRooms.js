const mongoose = require("mongoose");

//schema to visualize how a database should be structured
const roomSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);
//model provides an interface to the database for creating, querying, updating, deleting records, etc.
const Rooms = mongoose.model("rooms", roomSchema);
module.exports = Rooms;
