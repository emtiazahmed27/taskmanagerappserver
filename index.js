//dependencies

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { response } = require("express");
require("dotenv").config();

//express initialization

const app = express();
const port = 3001;

//middleware

app.use(cors());
app.use(express.json());

//mongodb initialization

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.hwi4qsm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//default server homepage

app.get("/", (req, res) => {
  res.send("welcome to Todo App server");
});

//mongodb run function

async function run() {
  try {
    const database = client.db("todoserver");
    const usersCollection = database.collection("users");
    const todolistCollection = database.collection("todolist");

    // <<<<<<<<<<<<<<<<<<<<<usercollection>>>>>>>>>>>>>>>>>>>>

    //get user info

    app.get("/users", async (req, res) => {
      let query = {};
      const id = req.query.id;
      const email = req.query.email;
      const name = req.query.name;

      if (id) query = { _id: ObjectId(id) };
      if (email) query = { email: email };
      if (name) query = { name: name };

      const cursor = usersCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    //create a new user

    app.post("/users", async (req, res) => {
      const user = req.body;

      usersCollection.insertOne(user);

      res.send(user);
    });

    // <<<<<<<<<<<<<<<<<<<<<todocollection>>>>>>>>>>>>>>>>>>>>

    //get todolistCollection

    app.get("/todolist", async (req, res) => {
      const query = {};
      const tag = req.query.tag;

      const email = req.query.email;
      const completed = req.query.category;

      if (email) query.email = email;
      if (completed) query.completed = completed;
      if (tag) query.tag = tag;

      const cursor = todolistCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //create todolistCollection

    app.post("/todolist", async (req, res) => {
      const body = req.body;

      todolistCollection.insertOne(body);

      res.send(body);
    });

    // update todo

    app.patch("/todolist/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      todolistCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { ...body } }
      );
      res.send(body);
    });

    //delete todolist

    app.delete("/todolist/:id", async (req, res) => {
      const id = req.params.id;
      const item = { _id: ObjectId(id) };
      await todolistCollection.deleteOne(item);
      res.send("Item deleteted successfully.");
    });
  } catch {
    console.log(error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log("server listening on port " + port);
});
