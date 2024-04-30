import type { Request, Response, NextFunction } from "express";
import { accessTokenKey, refreshTokenKey } from "../controllers/admin";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("checking auth");
  const access_token = req.cookies ? req.cookies[accessTokenKey] : null;
  const refresh_token = req.cookies ? req.cookies[refreshTokenKey] : null;
  if (!access_token || !refresh_token) {
    console.log("not authorized");
    res.status(401).json({ error: "Unauthorized" });
  } else {
    console.log("authorized");
    next();
  }
}
