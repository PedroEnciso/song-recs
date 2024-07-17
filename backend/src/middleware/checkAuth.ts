import type { Request, Response, NextFunction } from "express";
import { accessTokenKey, refreshTokenKey } from "../utils/cookieKeys";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const access_token = req.cookies ? req.cookies[accessTokenKey] : null;
  const refresh_token = req.cookies ? req.cookies[refreshTokenKey] : null;
  if (!access_token || !refresh_token) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
}
