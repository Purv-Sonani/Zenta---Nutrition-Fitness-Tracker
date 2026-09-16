import request from "supertest";
import { describe, it, expect, afterAll, beforeEach, jest } from "@jest/globals";

// =================================================================
// TEST SUITE: AI API
//
// Gemini is mocked at the module boundary so these tests never make a
// billable call. Every case below is expected to be rejected by auth or
// validation *before* the model would be reached, and the assertions on
// `generateContent` prove exactly that.
// =================================================================

const generateContent = jest.fn<() => Promise<{ response: { text: () => string } }>>();

jest.unstable_mockModule("@google/generative-ai", () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return { generateContent };
    }
  },
  SchemaType: {
    STRING: "string",
    NUMBER: "number",
    INTEGER: "integer",
    BOOLEAN: "boolean",
    ARRAY: "array",
    OBJECT: "object",
  },
}));

const { default: app } = await import("../src/app.js");
const { prisma } = await import("../src/lib/prisma.js");

describe("AI API Integration", () => {
  beforeEach(() => {
    generateContent.mockReset();
    generateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ analysis: "Needs protein", suggestions: [] }),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // ---------------- helpers ----------------

  const suffix = () => Math.random().toString(36).substring(2, 7);

  const registerAndLogin = async (name: string) => {
    const email = `${name}${suffix()}@test.com`;
    const password = "Password123!";

    await request(app)
      .post("/api/auth/register")
      .send({ username: `${name}${suffix()}`, email, password });

    const login = await request(app).post("/api/auth/login").send({ email, password });

    return login.headers["set-cookie"];
  };

  // =================================================================
  // POST /api/ai/balance — authentication
  // =================================================================

  it("should reject an unauthenticated balance request with 401", async () => {
    const res = await request(app).post("/api/ai/balance").send({ mealText: "Dal and rice" });

    expect(res.status).toBe(401);
    // The point of the fix: no cookie means no call to a paid API.
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("should reject an unauthenticated nutrition-insight request with 401", async () => {
    const res = await request(app).get("/api/ai/nutrition-insight");

    expect(res.status).toBe(401);
    expect(generateContent).not.toHaveBeenCalled();
  });

  // =================================================================
  // POST /api/ai/balance — input validation
  // =================================================================

  it("should reject an oversized mealText with 400", async () => {
    const cookie = await registerAndLogin("aibig");

    const res = await request(app)
      .post("/api/ai/balance")
      .set("Cookie", cookie)
      .send({ mealText: "a".repeat(501) });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("should reject an empty mealText with 400", async () => {
    const cookie = await registerAndLogin("aiempty");

    const res = await request(app).post("/api/ai/balance").set("Cookie", cookie).send({ mealText: "" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("should reject a whitespace-only mealText with 400", async () => {
    const cookie = await registerAndLogin("aiblank");

    const res = await request(app).post("/api/ai/balance").set("Cookie", cookie).send({ mealText: "     " });

    expect(res.status).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("should reject a missing mealText with 400", async () => {
    const cookie = await registerAndLogin("aimissing");

    const res = await request(app).post("/api/ai/balance").set("Cookie", cookie).send({});

    expect(res.status).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  // =================================================================
  // POST /api/ai/balance — happy path and upstream failure
  // =================================================================

  it("should return balancer suggestions for a valid authenticated request", async () => {
    const cookie = await registerAndLogin("aiok");

    generateContent.mockResolvedValue({
      response: {
        text: () =>
          JSON.stringify({
            analysis: "Good energy, light on protein.",
            suggestions: [{ category: "Protein", item: "A small bowl of curd", reason: "Adds protein naturally" }],
          }),
      },
    });

    const res = await request(app).post("/api/ai/balance").set("Cookie", cookie).send({ mealText: "Dal and rice" });

    expect(res.status).toBe(200);
    expect(res.body.analysis).toBe("Good energy, light on protein.");
    expect(res.body.suggestions).toHaveLength(1);
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it("should not leak model output when the response fails validation", async () => {
    const cookie = await registerAndLogin("aibad");

    generateContent.mockResolvedValue({
      response: {
        text: () => JSON.stringify({ analysis: "", suggestions: [{ category: "Vitamins", item: "x", reason: "y" }] }),
      },
    });

    const res = await request(app).post("/api/ai/balance").set("Cookie", cookie).send({ mealText: "Dal and rice" });

    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
    // Internals stay server-side: no raw output, no Zod issue tree.
    expect(JSON.stringify(res.body)).not.toContain("Vitamins");
    expect(res.body).not.toHaveProperty("issues");
    expect(res.body).not.toHaveProperty("raw");
    expect(res.body).not.toHaveProperty("normalized");
  });
});
