import {
  beforeAll,
  describe,
  expect,
  expectTypeOf,
  test,
  afterAll,
  afterEach,
} from "vitest";
import request, { Response } from "supertest";
import app from "../app";
import mongoose from "../utils/mongoose";
import type {
  Recommendation as IRecommendation,
  RecommendationWithSong,
} from "../models/types";
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

  test("Should respond with an array of type RecommendationWithSong and length 1", () => {
    expectTypeOf(res.body).toMatchTypeOf<RecommendationWithSong[]>();
    expect(res.body.length).toBe(1);
  });

  afterAll(async () => {
    await Recommendation.deleteMany({});
  });
});

describe("POST api/recommendations", () => {
  afterEach(async () => {
    await Recommendation.deleteMany({});
  });

  test("Should respond with 201 from correct request.", async () => {
    const res = await req
      .post("/api/recommendations")
      .send(testRecommendation)
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
  });

  test("Should respond with type of Recommendation from correct request.", async () => {
    const res = await req
      .post("/api/recommendations")
      .send(testRecommendation)
      .set("Content-Type", "application/json");
    expectTypeOf(res.body).toMatchTypeOf<IRecommendation>();
  });

  test("Should respond with the created Recommendation from correct request.", async () => {
    const res = await req
      .post("/api/recommendations")
      .send(testRecommendation)
      .set("Content-Type", "application/json");
    expect(res.body.spotify_song_id).toBe(testRecommendation.spotify_song_id);
  });

  test("Should respond with 400 from missing spotify_song_id", async () => {
    const res = await req
      .post("/api/recommendations")
      .send({ ...testRecommendation, spotify_song_id: "" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Spotify song is not defined.");
  });

  test("Should respond with 400 from missing recommender", async () => {
    const res = await req
      .post("/api/recommendations")
      .send({ ...testRecommendation, recommender: "" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Recommender is not defined");
  });

  test("Should respond with 201 with missing comment", async () => {
    const res = await req
      .post("/api/recommendations")
      .send({ ...testRecommendation, comment: "" })
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body.spotify_song_id).toBe(testRecommendation.spotify_song_id);
    expect(res.body.comment).toBe("");
  });
});

// close mongoose connection after all tests are finished
afterAll(async () => {
  await mongoose.connection.close();
});
