import { describe, test, expect, expectTypeOf } from "vitest";
import request, { Response } from "supertest";
import app from "../app";
import type { Song } from "../models/types";

const req = request(app);

describe("GET /api/songs", async () => {
  describe("A successful query", async () => {
    const res = await req.get("/api/songs?song=allnightparking");

    test("Should respond with 200 status", async () => {
      expect(res.status).toBe(200);
    });

    test("Should respond with an array of type Song", async () => {
      expectTypeOf(res.body).toMatchTypeOf<Song[]>();
    });

    test("Should respond with an array of length 5 or smaller", async () => {
      expect(res.body.length).toBeLessThanOrEqual(5);
    });
  });

  describe("An empty query", async () => {
    const res = await req.get("/api/songs?song=");

    test("Should respond with 400 status", async () => {
      expect(res.status).toBe(400);
    });

    test("Should respond with missing query message", async () => {
      expect(res.body.message).toBe("No query was defined");
    });
  });
});
