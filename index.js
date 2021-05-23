const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const { env } = require("./src/config/const");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true,
};

app.get("/", (req, res) => {
  res.send("Welcome to my app");
});

app.use("/api/users", require("./src/routes/user.router"));
app.use("/api/houses", require("./src/routes/house.router"));
app.use("/api/search", require("./src/routes/search.router"));
app.use("/api/review", require("./src/routes/review.router"));

app.listen(env.PORT, () => console.log("Server is running on", env.PORT));

const connectToServer = () => {
  connect(env.MONGO_URL, options, (err) => {
    if (err) return console.log("Fail to connect database");
    console.log("Successfully connecting to database");
  });
};

connectToServer();
