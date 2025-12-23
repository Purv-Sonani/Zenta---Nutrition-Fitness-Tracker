import request from "supertest";
import { describe, it, expect, afterAll } from "@jest/globals";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma";

// =================================================================
// TEST SUITE: PROGRESS API
// =================================================================

describe("Progress API Integration", () => {
  afterAll(async () => {
    await Promise.all([prisma.meal.deleteMany(), prisma.workout.deleteMany(), prisma.userGoal.deleteMany()]);
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // ------------------ helpers ------------------

  const makeUsername = (base: string) =>
    base
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 10);

  const generateSuffix = (length = 5) =>
    Math.random()
      .toString(36)
      .substring(2, 2 + length);

  const registerAndLogin = async (rawName: string) => {
    const username = makeUsername(rawName);
    const email = `${username}${generateSuffix()}@test.com`;
    const password = "Password123!";

    const registerRes = await request(app).post("/api/auth/register").send({
      username,
      email,
      password,
    });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    expect(loginRes.status).toBe(200);

    return {
      cookie: loginRes.headers["set-cookie"],
      userId: registerRes.body.data.id,
    };
  };

  // =================================================================
  // GET /api/progress/weekly-summary
  // =================================================================

  describe("GET /api/progress/weekly-summary", () => {
    it("should return weekly summary for authenticated user", async () => {
      const { cookie } = await registerAndLogin("progress_user");

      const res = await request(app).get("/api/progress/weekly-summary").set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("caloriesAdherencePercent");
      expect(res.body.data).toHaveProperty("proteinConsistencyDays");
      expect(res.body.data).toHaveProperty("workoutAdherencePercent");
    });
  });

  // =================================================================
  // GET /api/progress/trends
  // =================================================================

  describe("GET /api/progress/trends", () => {
    it("should return trend signals", async () => {
      const { cookie } = await registerAndLogin("trend_user");

      const res = await request(app).get("/api/progress/trends").set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      expect(res.body.data).toEqual(
        expect.objectContaining({
          caloriesTrend: expect.any(String),
          proteinTrend: expect.any(String),
          workoutTrend: expect.any(String),
        })
      );
    });

    it("should fail with invalid query params", async () => {
      const { cookie } = await registerAndLogin("trend_invalid");

      const res = await request(app).get("/api/progress/trends?window=yearly").set("Cookie", cookie);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });
  });

  // =================================================================
  // GET /api/progress/patterns
  // =================================================================

  describe("GET /api/progress/patterns", () => {
    it("should return insights array", async () => {
      const { cookie } = await registerAndLogin("pattern_user");

      const res = await request(app).get("/api/progress/patterns").set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      expect(res.body.data).toHaveProperty("insights");
      expect(Array.isArray(res.body.data.insights)).toBe(true);

      // If insights exist, validate structure
      if (res.body.data.insights.length > 0) {
        const insight = res.body.data.insights[0];
        expect(insight).toHaveProperty("type");
        expect(insight).toHaveProperty("title");
        expect(insight).toHaveProperty("description");
      }
    });
  });
});
