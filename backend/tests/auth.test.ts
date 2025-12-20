import request from "supertest";
import { describe, it, expect, beforeAll, afterAll, beforeEach } from "@jest/globals";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Authentication API", () => {
  beforeEach(async () => {
    // HARD RESET — REQUIRED
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const generateUser = () => ({
    username: "testuser_" + Date.now(),
    email: `test_${Date.now()}@example.com`,
    password: "Password123!",
  });

  describe("POST /api/auth/register", () => {
    it("registers a new user", async () => {
      const user = generateUser();

      const res = await request(app).post("/api/auth/register").send(user);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(user.email);
      expect(res.body.data).not.toHaveProperty("password");
    });

    it("blocks duplicate users", async () => {
      const user = generateUser();

      await request(app).post("/api/auth/register").send(user);
      const res = await request(app).post("/api/auth/register").send(user);

      expect(res.status).toBe(400); // OR 409 if you change controller
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in valid user and sets JWT cookie", async () => {
      const user = generateUser();
      await request(app).post("/api/auth/register").send(user);

      const res = await request(app).post("/api/auth/login").send({ email: user.email, password: user.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const cookies = res.headers["set-cookie"];

      expect(Array.isArray(cookies)).toBe(true);

      if (Array.isArray(cookies)) {
        expect(cookies.some((c) => c.includes("jwt="))).toBe(true);
      }
    });

    it("rejects invalid password", async () => {
      const user = generateUser();
      await request(app).post("/api/auth/register").send(user);

      const res = await request(app).post("/api/auth/login").send({ email: user.email, password: "wrong" });

      expect(res.status).toBe(401);
    });
  });
});
