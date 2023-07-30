import request from "supertest";
import app from "../../src/app";
import User from "../../src/models/user.module";

// Test data
const testData = {
  name: "John Doe",
  email: "john@example.com",
  password: "123456",
};

const basePath = '/api/v1';

beforeAll(async () => {
  // Clean up test data before starting
  await User.delete(testData.email);
});

afterAll(async () => {
  // Clean up test data after all tests
  await User.delete(testData.email);
});

describe("User Registration and Login", () => {
  it("should register a user successfully", async () => {
    const response = await request(app)
      .post(`${basePath}/auth/register`)
      .send(testData)
      .expect(201);

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toEqual(testData.name);
    expect(response.body.user.email).toEqual(testData.email);
    expect(response.body).toHaveProperty("access_token");
  });

  it("should not allow registration with the same email", async () => {
    const response = await request(app)
      .post(`${basePath}/auth/register`)
      .send(testData)
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("User already exists.");
  });

  it("should not allow registration with password less than 6 characters", async () => {
    const response = await request(app)
      .post(`${basePath}/auth/register`)
      .send(testData)
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("User already exists.");
  });

  it("should not allow registration without user name", async () => {
    const response = await request(app)
      .post(`${basePath}/auth/register`)
      .send(testData)
      .expect(400);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("User already exists.");
  });

  it("should login the user successfully", async () => {
    const response = await request(app)
      .post(`${basePath}/auth/login`)
      .send({ email: testData.email, password: testData.password })
      .expect(201);

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.name).toEqual(testData.name);
    expect(response.body.user.email).toEqual(testData.email);
    expect(response.body).toHaveProperty("access_token");
  });

  it("should not allow login with incorrect credentials", async () => {
    const response = await request(app)
      .post(`${basePath}/auth/login`)
      .send({ email: testData.email, password: "wrongpassword" })
      .expect(401);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Invalid password.");
  });

  it("should not log in a non-existing user", async () => {
    const response = await request(app)
      .post(`${basePath}/auth/login`)
      .send({ email: "nonexist@email.com", password: "nonexistPassword" });
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("User not found.");
  });
});
