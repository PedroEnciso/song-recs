import {
  beforeAll,
  describe,
  expect,
  expectTypeOf,
  test,
  afterAll,
} from "vitest";
import request, { Response } from "supertest";
import app from "../app";
import mongoose from "../utils/mongoose";
import type { RecommendationWithSong } from "../models/types";
import Recommendation from "../models/Recommendation";
import { testRecommendation } from "./helpers/testRecommendation.test.helper";

const BEFORE_ALL_TIMEOUT = 30000; // 30 sec
const req = request(app);

describe("GET /api/recommendations", () => {
  let res: Response;
  beforeAll(async () => {
    await Recommendation.create(testRecommendation);
    res = await req.get("/api/recommendations");
  }, BEFORE_ALL_TIMEOUT);

  test("Should have response status 200", () => {
    expect(res.status).toBe(200);
  });

  test("Should have content-type", () => {
    expect(res.type).toBe("application/json");
  });

  test("Should respond with an array of type RecommendationWithSong", () => {
    expectTypeOf(res.body).toMatchTypeOf<RecommendationWithSong[]>();
  });

  afterAll(async () => {
    await Recommendation.deleteMany({});
    await mongoose.connection.close();
  });
});
