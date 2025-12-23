import request from "supertest";
import { describe, it, expect, afterEach } from "@jest/globals";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma";

describe("Workout API Integration", () => {
  afterEach(async () => {
    await prisma.workout.deleteMany();
    await prisma.user.deleteMany();
  });

  // ---------------- helpers ----------------

  const suffix = () => Math.random().toString(36).substring(2, 7);

  const registerAndLogin = async (name: string) => {
    const email = `${name}${suffix()}@test.com`;
    const password = "Password123!";

    await request(app).post("/api/auth/register").send({
      username: name,
      email,
      password,
    });

    const login = await request(app).post("/api/auth/login").send({ email, password });

    return login.headers["set-cookie"];
  };

  // =================================================================
  // POST /api/workouts
  // =================================================================

  it("should create a workout", async () => {
    const cookie = await registerAndLogin("workoutuser");

    const res = await request(app).post("/api/workouts").set("Cookie", cookie).send({
      activity: "Running",
      duration: 30,
      caloriesBurned: 300,
    });

    expect(res.status).toBe(201);
    expect(res.body.data.activity).toBe("Running");
  });

  it("should reject unauthenticated workout creation", async () => {
    const res = await request(app).post("/api/workouts").send({
      activity: "Ghost Lift",
      duration: 20,
      caloriesBurned: 200,
    });

    expect(res.status).toBe(401);
  });

  it("should fail validation if duration missing", async () => {
    const cookie = await registerAndLogin("badworkout");

    const res = await request(app).post("/api/workouts").set("Cookie", cookie).send({ activity: "Yoga" });

    expect(res.status).toBe(400);
  });

  // =================================================================
  // GET /api/workouts
  // =================================================================

  it("should count unique workout days", async () => {
    const cookie = await registerAndLogin("uniquedays");

    const today = new Date().toISOString();

    await request(app).post("/api/workouts").set("Cookie", cookie).send({
      activity: "Bench",
      duration: 40,
      caloriesBurned: 250,
      date: today,
    });

    await request(app).post("/api/workouts").set("Cookie", cookie).send({
      activity: "Squats",
      duration: 35,
      caloriesBurned: 300,
      date: today,
    });

    const res = await request(app).get("/api/workouts").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1); // SAME DAY
    expect(res.body.data.length).toBe(2);
  });

  it("should isolate workouts per user", async () => {
    const cookieA = await registerAndLogin("userA");
    const cookieB = await registerAndLogin("userB");

    await request(app).post("/api/workouts").set("Cookie", cookieA).send({
      activity: "Secret Run",
      duration: 60,
      caloriesBurned: 500,
    });

    const res = await request(app).get("/api/workouts").set("Cookie", cookieB);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.data).toHaveLength(0);
  });
});
