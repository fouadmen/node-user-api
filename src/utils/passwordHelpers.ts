import crypto from "crypto";

/**
 * Hashes a given password using PBKDF2 algorithm.
 * @param password The password to be hashed.
 * @returns The hashed password.
 */
const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = getPasswordHash(password, salt);
  return `${salt}:${hash}`;
};

/**
 * Compares a given plain password with a hashed password.
 * @param hashedPassword The hashed password to compare against.
 * @param password The plain password to be compared.
 * @returns True if passwords matche, otherwise false.
 */
const comparePasswords = (hashedPassword: string, password: string) => {
  const [salt, hash] = hashedPassword.split(":");
  const newHash = getPasswordHash(password, salt);
  return newHash === hash;
};

const getPasswordHash = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
};
export { hashPassword, comparePasswords };
