const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const { env } = require("./config/const");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true,
};

// connectToServer();

app.use("/api/users", require("./routes/user.router"));
app.use("/api/houses", require("./routes/houses.router"));
app.use("/api/search", require("./routes/search.router"));
app.use("/api/feat", require("./routes/feat.router"));

app.listen(env.PORT, () => console.log("Server is running on", env.PORT));

function connectToServer() {
  connect(env.MONGO_URL, options, (err) => {
    if (err) return console.log("Fail to connect database");
    console.log("Successfully connecting to database");
  });
}
