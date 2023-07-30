import { FindUserConditions } from "../types/userTypes";
import * as db from "../database";
import crypto from "crypto";
import AppError from "../AppError";
import { statusCodes } from "../utils";
import config from "../config";

// Query parameters used for pagination
type QueryParams = {
  limit?: number;
  page?: number;
};

export default class User {
  id?: string;
  name: string;
  email: string;
  password?: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }
  /**
   * Retrieve list of users from the database based on the provided query params.
   * @param queryParams An object containing the pagination config
   * @returns A promise that resolves to the found array of users.
   */
  static async findAll(queryParams: QueryParams): Promise<User[]> {
    try {
      const { page = 0, limit = config.pagination.defaultLimit } = queryParams;
      const users = await db.query(
        "SELECT id, email, name FROM users LIMIT $1 OFFSET $2;",
        [limit, page]
      );
      return users.rows;
    } catch (error) {
      throw new Error("Failed to fetch all users: " + error.message);
    }
  }

  /**
   * Retrieve a single user from the database based on the provided conditions.
   * @param conditions An object containing the conditions to search for a user to be used in where clause.
   * @returns A promise that resolves to the found user as a User object, or null if no user is found.
   */
  static async findOne(conditions: FindUserConditions): Promise<User> {
    try {
      const conditionKeys = Object.keys(
        conditions
      ) as (keyof FindUserConditions)[];
      const whereClauses = Object.keys(conditions).map((key, index) => {
        const placeholder = `$${index + 1}`;
        return `${key} = ${placeholder}`;
      });

      const values = conditionKeys.map((key) => conditions[key]);
      const query = `SELECT * FROM users WHERE ${whereClauses.join(" AND ")};`;

      const result = await db.query(query, values);
      if (result.rows.length > 0) {
        return new User(result.rows[0]);
      } else {
        return null;
      }
    } catch (error) {
      throw new AppError({
        statusCode: statusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  /**
   * Insert a new user record into the database.
   * @param user The user object to be inserted.
   * @returns A promise that resolves to the newly inserted User object.
   */
  static async insert(user: User): Promise<User> {
    try {
      const userId = crypto.randomUUID();
      const result = await db.query(
        "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, email, name",
        [userId, user.name, user.email, user.password]
      );
      return new User(result.rows[0]);
    } catch (error) {
      throw new AppError({
        statusCode: statusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  /**
   * Update an existing user record in the database.
   * @param id The ID of the user to be updated.
   * @param data The updated user data to be used in the UPDATE query.
   * @returns A promise that resolves to the updated User object.
   */
  static async update(id: string, data: User): Promise<User> {
    try {
      const result = await db.query(
        "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4  RETURNING id, email, name",
        [data.name, data.email, data.password, id]
      );
      return new User(result.rows[0]);
    } catch (error) {
      throw new AppError({
        statusCode: statusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }

  /**
   * Delete a user record from the database based on the provided ID.
   * @param id The ID of the user to be deleted.
   * @returns A promise that resolves to a boolean indicating if the deletion was successful.
   */
  static async delete(id: string): Promise<boolean> {
    try {
      await db.query("DELETE FROM users WHERE id = $1 OR email = $1", [id]);
      return true;
    } catch (error) {
      throw new AppError({
        statusCode: statusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
}
