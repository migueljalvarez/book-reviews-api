import cors from "cors";
import express from "express";

import router from "./routers/index.ts";
import { errorHandler } from "./middleware/error.handler.ts";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);
export default app;
