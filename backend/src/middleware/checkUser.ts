import type { Request, Response, NextFunction } from "express";
import { userIdKey } from "../utils/cookieKeys";
import generateRandomString from "../utils/generateRandomString";

export async function checkUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let user_id = req.cookies ? req.cookies[userIdKey] : null;

  if (!user_id) {
    // user has not been created yet
    user_id = generateRandomString();
    res.cookie(userIdKey, user_id, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  req.body.user_id = user_id;
  next();
}
