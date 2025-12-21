import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma";

describe("Meal API Integration", () => {
  afterAll(async () => {
    await Promise.all([prisma.meal.deleteMany(), prisma.workout.deleteMany()]);
    await prisma.user.deleteMany(), await prisma.$disconnect();
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
      username, // ✅ matches schema
      email,
      password,
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data).toBeDefined();

    const loginRes = await request(app).post("/api/auth/login").send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    return {
      cookie: loginRes.headers["set-cookie"],
      userId: registerRes.body.data.id,
    };
  };

  // =================================================================
  // TEST SUITE: WORKOUT API
  // =================================================================

  describe("Workout API Integration", () => {
    describe("POST /api/workouts", () => {
      it("should create a workout when authenticated", async () => {
        const { cookie } = await registerAndLogin("workout_user");

        const workoutData = {
          activity: "Chest Day",
          duration: 60,
          caloriesBurned: 500,
          date: new Date().toISOString(),
        };

        const res = await request(app).post("/api/workouts").set("Cookie", cookie).send(workoutData);

        console.log("res erorrrrrr", res);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.activity).toBe("Chest Day");
      });

      it("should fail with 401 if not authenticated", async () => {
        const res = await request(app).post("/api/workouts").send({
          name: "Unauthorized Workout",
          duration: 30,
        });

        expect(res.status).toBe(401);
      });

      it("should fail with 400 if validation fails", async () => {
        const { cookie } = await registerAndLogin("invalid_workout");

        const res = await request(app).post("/api/workouts").set("Cookie", cookie).send({
          // missing required fields
          name: "Bad Workout",
        });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
      });
    });

    describe("GET /api/workouts", () => {
      it("should return workouts for the logged-in user only", async () => {
        const userA = await registerAndLogin("userA");
        const userB = await registerAndLogin("userB");

        await request(app).post("/api/workouts").set("Cookie", userA.cookie).send({
          name: "User A Workout",
          duration: 45,
        });

        const res = await request(app).get("/api/workouts").set("Cookie", userB.cookie);

        expect(res.status).toBe(200);
        expect(res.body.count).toBe(0);
        expect(res.body.data).toHaveLength(0);
      });
    });
  });
});
