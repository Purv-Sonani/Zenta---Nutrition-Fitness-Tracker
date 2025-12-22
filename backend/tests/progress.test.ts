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

    it("should fail with 401 if not authenticated", async () => {
      const res = await request(app).get("/api/progress/weekly-summary");

      expect(res.status).toBe(401);
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
      expect(res.body.data).toHaveProperty("caloriesTrend");
      expect(res.body.data).toHaveProperty("proteinTrend");
      expect(res.body.data).toHaveProperty("workoutTrend");
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
    it("should return warnings array", async () => {
      const { cookie } = await registerAndLogin("pattern_user");

      const res = await request(app).get("/api/progress/patterns").set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("warnings");
      expect(Array.isArray(res.body.data.warnings)).toBe(true);
    });
  });
});
