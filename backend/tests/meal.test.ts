import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma";

describe("Meal API Integration", () => {
  afterAll(async () => {
    await Promise.all([prisma.meal.deleteMany(), prisma.workout.deleteMany()]);
    await prisma.user.deleteMany(), await prisma.$disconnect();
  });

  // ---------------- helpers ----------------

  const generateSuffix = (length = 5) =>
    Math.random()
      .toString(36)
      .substring(2, 2 + length);

  const makeUsername = (raw: string) =>
    raw
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 15);

  const registerAndLogin = async (rawName: string) => {
    const username = makeUsername(rawName);
    const email = `${username}${generateSuffix()}@test.com`;
    const password = "Password123!";

    // REGISTER
    const registerRes = await request(app).post("/api/auth/register").send({
      username,
      email,
      password,
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.data).toBeDefined();

    // LOGIN
    const loginRes = await request(app).post("/api/auth/login").send({ email, password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.headers["set-cookie"]).toBeDefined();

    return {
      cookie: loginRes.headers["set-cookie"],
      userId: registerRes.body.data.id,
    };
  };

  // =================================================================
  // TEST SUITE: POST /api/workouts
  // =================================================================

  describe("Workout API Integration", () => {
    describe("POST /api/workouts", () => {
      it("should log a new workout successfully", async () => {
        const { cookie } = await registerAndLogin("runner");

        const workoutData = {
          activity: "Running",
          duration: 30,
          caloriesBurned: 300,
          date: new Date().toISOString(),
        };

        const response = await request(app).post("/api/workouts").set("Cookie", cookie).send(workoutData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.activity).toBe("Running");

        const savedWorkout = await prisma.workout.findFirst({
          where: { id: response.body.data.id },
        });

        expect(savedWorkout).not.toBeNull();
      });

      it("should reject requests without authentication", async () => {
        const response = await request(app).post("/api/workouts").send({ activity: "Ghost Lifting", duration: 10 });

        expect(response.status).toBe(401);
      });

      it("should fail validation if required fields are missing", async () => {
        const { cookie } = await registerAndLogin("invalid");

        const response = await request(app).post("/api/workouts").set("Cookie", cookie).send({
          activity: "Yoga",
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();
      });

      it("should handle custom dates correctly", async () => {
        const { cookie } = await registerAndLogin("retro");

        const pastDate = "2023-01-01T10:00:00.000Z";

        const response = await request(app).post("/api/workouts").set("Cookie", cookie).send({
          activity: "Past Jog",
          duration: 15,
          caloriesBurned: 100,
          date: pastDate,
        });

        expect(response.status).toBe(201);
        expect(response.body.data.date).toBe(pastDate);
      });
    });

    // =================================================================
    // TEST SUITE: GET /api/workouts
    // =================================================================

    describe("GET /api/workouts", () => {
      it("should return all workouts for the logged-in user", async () => {
        const { cookie } = await registerAndLogin("power");

        await request(app).post("/api/workouts").set("Cookie", cookie).send({ activity: "Bench", duration: 45, caloriesBurned: 200 });

        await request(app).post("/api/workouts").set("Cookie", cookie).send({ activity: "Squats", duration: 30, caloriesBurned: 300 });

        const response = await request(app).get("/api/workouts").set("Cookie", cookie);

        expect(response.status).toBe(200);
        expect(response.body.count).toBe(2);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it("should enforce data isolation between users", async () => {
        const userA = await registerAndLogin("usera");
        const userB = await registerAndLogin("userb");

        await request(app).post("/api/workouts").set("Cookie", userA.cookie).send({ activity: "Secret Run", duration: 60, caloriesBurned: 500 });

        const response = await request(app).get("/api/workouts").set("Cookie", userB.cookie);

        expect(response.status).toBe(200);
        expect(response.body.count).toBe(0);
        expect(response.body.data).toHaveLength(0);
      });
    });
  });
});
