const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
const { env } = require("./config/const");

const app = express();

app.use(express.json());
app.use(cors());

connectToServer();

app.use("/api/users", require("./routes/user.router"));

app.listen(env.PORT, () => console.log("Server is running on", env.PORT));

function connectToServer() {
  connect(
    env.MONGO_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    (err) => {
      if (err) return console.log("Fail to connect database");
      console.log("Successfully connecting to database");
    }
  );
}
