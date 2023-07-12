const express = require("express");
const userRoutes = require("./api/userRoute");
const reportRoutes = require("./api/reportRoute");
const categoryRoute = require("./api/categoryRoute")
const config = require("./config/default");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes, reportRoutes, categoryRoute);

const PORT = config.server.port;
const HOST = config.server.host;

const server = app.listen(PORT, HOST, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server is running on ${HOST}:${server.address().port}`);
});
