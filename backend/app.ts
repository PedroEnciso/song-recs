import express, { Express, Request, Response } from "express";
// configure env
import dotenv from "dotenv";
dotenv.config();
// cors
import cors from "cors";
// cookies
import cookieParser from "cookie-parser";
// import routes
import recommendationsRouter from "./src/controllers/recommendations";
import songsRouter from "./src/controllers/songs";
import creatorRouter from "./src/controllers/creator";

export const app: Express = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
// use routes
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/songs", songsRouter);
app.use("/api/creator", creatorRouter);

export default app;
