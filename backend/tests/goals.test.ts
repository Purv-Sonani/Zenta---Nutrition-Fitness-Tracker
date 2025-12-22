import request from "supertest";
import { describe, it, expect, afterAll } from "@jest/globals";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma";

// =================================================================
// TEST SUITE: GOALS API
// =================================================================

describe("Goals API Integration", () => {
  afterAll(async () => {
    await prisma.userGoal.deleteMany();
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
    };
  };

  // =================================================================
  // GET /api/goals
  // =================================================================

  describe("GET /api/goals", () => {
    it("should return null if user has no goal yet", async () => {
      const { cookie } = await registerAndLogin("goal_reader");

      const res = await request(app).get("/api/goals").set("Cookie", cookie);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeNull();
    });
  });

  // =================================================================
  // POST /api/goals
  // =================================================================

  describe("POST /api/goals", () => {
    it("should create or update user goals", async () => {
      const { cookie } = await registerAndLogin("goal_writer");

      const goalData = {
        dailyCaloriesTarget: 2200,
        dailyProteinTarget: 140,
        weeklyWorkoutTarget: 5,
      };

      const res = await request(app).post("/api/goals").set("Cookie", cookie).send(goalData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dailyCaloriesTarget).toBe(2200);
    });

    it("should fail with 400 if validation fails", async () => {
      const { cookie } = await registerAndLogin("goal_invalid");

      const res = await request(app).post("/api/goals").set("Cookie", cookie).send({
        dailyCaloriesTarget: -100,
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should fail with 401 if not authenticated", async () => {
      const res = await request(app).post("/api/goals").send({
        dailyCaloriesTarget: 2000,
        dailyProteinTarget: 120,
        weeklyWorkoutTarget: 4,
      });

      expect(res.status).toBe(401);
    });
  });
});
