import express from "express";
import userRoutes from "./api/userRoute.js";
import reportRoutes from "./api/reportRoute.js";
import categoryRoute from "./api/categoryRoute.js";
import cors from "cors";
import { env } from "./env.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRoutes, reportRoutes, categoryRoute);

const PORT = env.PORT;
const HOST = env.HOST;

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
