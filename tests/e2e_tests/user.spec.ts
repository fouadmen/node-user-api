import request from "supertest";
import app from "../../src/app";
import User from "../../src/models/user.module";

const basePath = "/api/v1";
let access_token: string;
let savedUsers: User[];

// Test data
const users = [
  {
    name: "peter",
    email: "peter@example.com",
    password: "123456",
  },
  {
    name: "stewie",
    email: "stewie@example.com",
    password: "1234567",
  },
  {
    name: "glenn",
    email: "glenn@example.com",
    password: "123456",
  },
];

const testUser = {
  name: "admin",
  email: "admin@example.com",
  password: "123456",
};

const expectedUserStructure = {
  id: expect.any(String),
  name: expect.any(String),
  email: expect.any(String),
};

const clearDatabase = async () => {
  return await Promise.all(
    [...users, testUser].map((user) => User.delete(user.email))
  );
};

beforeAll(async () => {
  await clearDatabase();
  await Promise.all(users.map((user) => User.insert(user)));
  const response = await request(app)
    .post(`${basePath}/auth/register`)
    .send(testUser)
    .expect(201);
  access_token = response.body.access_token;
});

afterAll(async () => {
  await clearDatabase();
});

describe("User fetching", () => {
  it("should not get users without authorization", async () => {
    const response = await request(app).get(`${basePath}/users`);
    expect(response.status).toBe(401);
  });

  it("should get sanitized users with valid access_token", async () => {
    const response = await request(app)
      .get(`${basePath}/users`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.every((user: User) =>
      expect(user).toMatchObject(expectedUserStructure)
    );
    savedUsers = response.body;
  });

  it("should not get data without permission", async () => {
    // Mock the findAll function to return an array of users
    const differentUser = savedUsers.find(
      (user) => user.email !== testUser.email
    );
    const response = await request(app)
      .get(`${basePath}/users/${differentUser?.id}`)
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(403);
  });
});

describe("User updating", () => {
  it("should update user name successfully", async () => {
    const currentUser = savedUsers.find(
      (user) => user.email === testUser.email
    );
    const response = await request(app)
      .put(`${basePath}/users/${currentUser?.id}`)
      .send({ name: "admin_name_changed" })
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: "admin_name_changed" });
  });

  it("should update user password successfully", async () => {
    const currentUser = savedUsers.find(
      (user) => user.email === testUser.email
    );

    const response = await request(app)
      .put(`${basePath}/users/${currentUser?.id}`)
      .send({ password: "new_password" })
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(expectedUserStructure);
  });

  it("should not update user password if it's under 6 characters", async () => {
    const currentUser = savedUsers.find(
      (user) => user.email === testUser.email
    );
    const response = await request(app)
      .put(`${basePath}/users/${currentUser?.id}`)
      .send({ password: "12345" })
      .set("Authorization", `Bearer ${access_token}`);
    console.log(response.body.error);

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual(
      'Invalid Input Error : "password" length must be at least 6 characters long'
    );
  });
});
