import crypto from "crypto";

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};
