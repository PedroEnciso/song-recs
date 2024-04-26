import request, { Response } from "supertest";
import { describe, expect, test } from "vitest";
import app from "../app";

const req = request(app);

describe("GET /api/admin/login", async () => {
  const res = await req.get("/api/admin/login");
  const redirectUrl = res.header.location;

  test("Response contains 16 character state", () => {
    const stringArray = redirectUrl.split("state=");
    const state = stringArray[1];
    expect(state.length).toBe(16);
  });

  test("Response contains playlist-modify-public scope", () => {
    expect(redirectUrl.includes("playlist-modify-public")).toBeTruthy();
  });

  test("Base redirect url is correct", () => {
    const urlArray = redirectUrl.split("?");
    const baseUrl = urlArray[0];
    expect(baseUrl).toBe("https://accounts.spotify.com/authorize");
  });
});

describe("GET /api/admin/authorize", async () => {
  const firstRes = await req.get("/api/admin/login");
  const stringArray = firstRes.header.location.split("state=");
  const state = stringArray[1];

  test("Should respond with 403 if given incorrect state or access code", async () => {
    const res = await req.get("/api/admin/authorize?code=abcstate=123");
    expect(res.status).toBe(403);
  });

  test("Should respond with 401 if given no access code", async () => {
    const res = await req.get("/api/admin/authorize?state=123");
    expect(res.status).toBe(401);
  });
});
