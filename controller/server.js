const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

let db;

console.log("Attempting to connect to MongoDB at database:27017...");
MongoClient.connect("mongodb://database:27017")
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

app.listen(port, () => {
  console.log(`ComputeNet frontend running on port ${port}`);
});
