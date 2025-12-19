// tests/auth.test.ts
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

// We instantiate a separate Prisma client for the test runner
// This ensures we can clean up data independent of the app's internal connection

describe("Authentication API", () => {
  // Teardown: Disconnect to prevent Jest "Open Handle" errors
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Helper to generate unique emails so tests don't clash on re-runs
  const generateUser = () => {
    const uniqueId = Date.now().toString();
    return {
      email: `test_${uniqueId}@example.com`,
      password: "Password123!",
      username: "Test User",
    };
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user and return 201", async () => {
      const newUser = generateUser();

      const response = await request(app)
        .post("/api/auth/register") // Adjust this path to match your routes
        .send(newUser);

      // Validation
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(newUser.email);

      // Optional: Verify password is NOT returned
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should block duplicate emails", async () => {
      const user = generateUser();

      // First request: Success
      await request(app).post("/api/auth/register").send(user);

      // Second request: Fail
      const response = await request(app).post("/api/auth/register").send(user);

      expect(response.status).toBe(409); // or 400, depending on your controller logic
    });
  });

  describe("POST /api/auth/login", () => {
    it("should authenticate valid user and return JWT", async () => {
      // 1. Create a user specifically for this test
      const user = generateUser();
      await request(app).post("/api/auth/register").send(user);

      // 2. Attempt login
      const response = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: user.password,
      });

      // 3. Verify Token
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token"); // or 'accessToken'
      expect(typeof response.body.token).toBe("string");
    });

    it("should reject invalid passwords", async () => {
      const user = generateUser();
      await request(app).post("/api/auth/register").send(user);

      const response = await request(app).post("/api/auth/login").send({
        email: user.email,
        password: "WrongPassword!!!",
      });

      expect(response.status).toBe(401); // Unauthorized
    });
  });
});
