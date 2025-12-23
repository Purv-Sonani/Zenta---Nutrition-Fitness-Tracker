import request from "supertest";
import { describe, it, expect, afterEach } from "@jest/globals";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma";

describe("Meal API Integration", () => {
  afterEach(async () => {
    await prisma.meal.deleteMany();
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
  // POST /api/meals
  // =================================================================

  it("should log a meal successfully", async () => {
    const cookie = await registerAndLogin("mealuser");

    const res = await request(app).post("/api/meals").set("Cookie", cookie).send({
      name: "Chicken Bowl",
      calories: 600,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Chicken Bowl");
  });

  it("should reject unauthenticated meal creation", async () => {
    const res = await request(app).post("/api/meals").send({
      name: "Ghost Meal",
      calories: 300,
    });

    expect(res.status).toBe(401);
  });

  it("should fail validation if calories missing", async () => {
    const cookie = await registerAndLogin("badmeal");

    const res = await request(app).post("/api/meals").set("Cookie", cookie).send({ name: "Broken Meal" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  // =================================================================
  // GET /api/meals
  // =================================================================

  it("should return all meals for logged-in user", async () => {
    const cookie = await registerAndLogin("meallist");

    await request(app).post("/api/meals").set("Cookie", cookie).send({
      name: "Breakfast",
      calories: 400,
    });

    await request(app).post("/api/meals").set("Cookie", cookie).send({
      name: "Lunch",
      calories: 700,
    });

    const res = await request(app).get("/api/meals").set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(2);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
