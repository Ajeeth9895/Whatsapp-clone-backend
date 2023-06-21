const express = require("express");
const mongoose = require("mongoose");
const Rooms = require("./dbRooms");
const Pusher = require("pusher");
const cors = require("cors");
const Messages = require("./dbMessages");

const app = express();
const port = process.env.PORT || 5000;

const pusher = new Pusher({
  appId: "1621763",
  key: "f0d22a2648acb2d53b94",
  secret: "710cd046bb747dd0799e",
  cluster: "ap2",
  useTLS: true
});

app.use(express.json());

app.use(cors());

const dbUrl =
  "mongodb+srv://ajeeth:Ajee12345@cluster0.gprm31v.mongodb.net/whatsapp-clone";

//to connect to db
mongoose.connect(dbUrl);

const db = mongoose.connection;

db.once("open", () => {
  //based on event change push a new group into db collection
  const roomCollection = db.collection("rooms");
  //A change stream that watches changes on all collections in the cluster.
  const changeStream = roomCollection.watch();
  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const roomDetails = change.fullDocument;
      //room is the channel name
      pusher.trigger("room", "inserted", roomDetails);
    } else {
      console.log("Not an expected event to trigger");
    }
  });


  //based on event change push a new message into db collection
  const msgCollection = db.collection("messages");
  const changeStream1 = msgCollection.watch();
  changeStream1.on("change", (change) => {

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      //messages is the channel name
      pusher.trigger("messages", "inserted", messageDetails);
    } else {
      console.log("Not a expected event to trigger");
    }
  });
});



//to get particular group based on id
app.get("/room/:id", (req, res) => {
  Rooms.find({ _id: req.params.id }, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data[0]);
    }
  });
});

//to get all the messages based on room id
app.get("/messages/:id", (req, res) => {
  Messages.find({ roomId: req.params.id }, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

//to create new message
app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;
  Messages.create(dbMessage, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(201).send(data);
    }
  });
});

//to create group
app.post("/group/create", (req, res) => {
  const name = req.body.groupName;
  Rooms.create({ name }, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(201).send(data);
    }
  });
});

//to get all groups
app.get("/all/rooms", (req, res) => {
  Rooms.find({}, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening to ${port}`);
});
