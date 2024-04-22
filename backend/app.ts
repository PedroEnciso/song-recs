import express, { Express, Request, Response } from "express";
// configure env
import dotenv from "dotenv";
dotenv.config();
// cors
import cors from "cors";
// import routes
import recommendationsRouter from "./controllers/recommendations";
import songsRouter from "./controllers/songs";

export const app: Express = express();
app.use(express.json());
app.use(cors({ origin: true }));

// use routes
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/songs", songsRouter);

export default app;
