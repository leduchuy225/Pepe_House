const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");

// require("./src/utils/redis");

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true,
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Welcome to my app");
});

app.use("/api/users", require("./src/routes/user.router"));
app.use("/api/houses", require("./src/routes/house.router"));
app.use("/api/review", require("./src/routes/review.router"));
app.use("/api/notifications", require("./src/routes/notification.router"));

app.listen(process.env.PORT, () =>
  console.log("Server is running on", process.env.PORT)
);

function connectToMongoDB() {
  connect(process.env.MONGO_URL, options, (err) => {
    if (err) return console.log("Fail to connect Mongo DB");
    console.log("Connecting to Mongo DB");
  });
}
