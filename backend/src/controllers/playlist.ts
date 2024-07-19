import { Router, Request, Response } from "express";

const playlistRouter = Router();

playlistRouter.get(
  "playlists/:id",
  (req: Request<{ id: number }>, res: Response) => {}
);

export default playlistRouter;
