import type { Request, Response, NextFunction } from "express";
import { rateLimitKey } from "../utils/cookieKeys";

export async function recommendationRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const last_recommendation_time = req.cookies
    ? req.cookies[rateLimitKey]
    : null;

  const time = Date.now();

  if (!last_recommendation_time) {
    // user can upload recommendation
    res.cookie(rateLimitKey, time, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 600000,
    });
    next();
  } else {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
}
