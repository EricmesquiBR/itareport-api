import express from "express";
import userRoutes from "./api/userRoute.js";
import reportRoutes from "./api/reportRoute.js";
import categoryRoute from "./api/categoryRoute.js";
import config from "./config/default.js";
import cors from "cors";

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
