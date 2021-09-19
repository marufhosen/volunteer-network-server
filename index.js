const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvals.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const eventsCollection = client.db("VolunteerNetwork").collection("events");
  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    eventsCollection.insertOne(newEvent).then((result) => {
      console.log("InsertedCount", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/newEvents", (req, res) => {
    eventsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
