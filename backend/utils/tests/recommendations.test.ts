import { beforeAll, describe, expect, expectTypeOf, test } from "vitest";
import request, { Response } from "supertest";
import app from "../../app";
import type { RecommendationWithSong } from "../../models/types";

const BEFORE_ALL_TIMEOUT = 30000; // 30 sec
const req = request(app);

describe("GET /api/recommendations", () => {
  let res: Response;
  beforeAll(async () => {
    res = await req.get("/api/recommendations");
  }, BEFORE_ALL_TIMEOUT);

  test("Should have response status 200", () => {
    console.log("status is ", res.status);
    expect(res.status).toBe(200);
  });

  test("Should have content-type", () => {
    expect(res.type).toBe("application/json");
  });

  test("Should respond with an array of type RecommendationWithSong", () => {
    expectTypeOf(res.body).toMatchTypeOf<RecommendationWithSong[]>();
  });
});
