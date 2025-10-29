const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();

let port = 3000;
if (process.env.FRONTEND_PORT) {
  port = process.env.FRONTEND_PORT;
}

let database_url = "mongodb://database:27017";
if (process.env.DATABASE_URL) {
  database_url = process.env.DATABASE_URL;
}

let db;

console.log("Attempting to connect to MongoDB at", database_url);
MongoClient.connect(database_url)
  .then((client) => {
    db = client.db("computenet");
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.set("view engine", "pug");
app.disable("view cache");
app.use(express.json());
app.use(express.static("public"));

async function claimNextTask() {
  return await db
    .collection("tasks")
    .findOneAndUpdate(
      { status: "pending" },
      { $set: { status: "taken", takenAt: new Date() } },
      { sort: { number: 1 }, returnDocument: "after" }
    );
}

async function createTask(taskNumber, status = "pending") {
  const task = {
    number: taskNumber,
    status: status,
    createdAt: new Date(),
  };

  if (status === "taken") {
    task.takenAt = new Date();
  }

  return await db.collection("tasks").insertOne(task);
}

async function getNextTaskNumber() {
  const lastTask = await db
    .collection("tasks")
    .findOne({}, { sort: { number: -1 } });
  return lastTask ? lastTask.number + 1 : 1;
}

app.get("/", (req, res) => {
  console.log("GET / - Serving index page");
  res.render("index");
});

app.get("/api/task", async (req, res) => {
  console.log("GET /api/task - fetching a task");
  try {
    if (!db) {
      return res.json({ task: null });
    }
    console.log(res.ip);

    console.log("Fetching from database");
    const claimedTask = await claimNextTask();

    if (claimedTask && claimedTask.number) {
      console.log("Returning task:", claimedTask.number);
      const nextTaskNumber = await getNextTaskNumber();
      await createTask(nextTaskNumber);
      res.json({ task: claimedTask.number });
    } else {
      console.log("No pending tasks, creating first task");
      await createTask(1, "taken");
      await createTask(2);
      res.json({ task: 1 });
    }
  } catch (error) {
    console.log("Error when trying to fetch from database:", error.message);
    res.json({ task: null });
  }
});

app.get("/api/results", async (req, res) => {
  console.log("GET /api/results - fetch the last 5 results");
  try {
    if (!db) {
      return res.json({ results: [] });
    }

    const results = await db
      .collection("results")
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    res.json({ results });
  } catch (error) {
    console.log("Error fetching results:", error.message);
    res.json({ results: [] });
  }
});

app.post("/api/task/submit", async (req, res) => {
  console.log("POST /api/task/submit - submit the results of a task");
  try {
    if (
      !db ||
      !(typeof req.body.task !== "undefined") ||
      !(typeof req.body.result !== "undefined")
    ) {
      return res.json({ success: false });
    }
    console.log(
      "Task",
      req.body.task,
      "submitted with result",
      req.body.result
    );
    const result = {
      task: req.body.task,
      result: req.body.result,
      createdAt: new Date(),
      client: req.ip,
    };
    db.collection("results").insertOne(result);
    res.json({ success: true });
  } catch (error) {
    console.log("Error when trying to fetch from database:", error.message);
    res.json({ success: false });
  }
});

const server = app.listen(port, () => {
  console.log(`ComputeNet frontend running on port ${port}`);
});

module.exports = { app, server };
