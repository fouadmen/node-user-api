import { hashPassword, comparePasswords } from "../../src/utils";

describe("Password Utils", () => {
  describe("hashPassword", () => {
    it("should hash the password correctly", () => {
      const password = "mysecretpassword";
      const hashedPassword = hashPassword(password);
      const [salt, hash] = hashedPassword.split(":");

      expect(salt.length).toBeGreaterThan(0);
      expect(hash.length).toBeGreaterThan(0);

      expect(comparePasswords(hashedPassword, password)).toBe(true);
    });
  });

  describe("comparePasswords", () => {
    it("should return true when passwords match", () => {
      const password = "mysecretpassword";
      const hashedPassword = hashPassword(password);
      
      expect(comparePasswords(hashedPassword, password)).toBe(true);
    });

    it("should return false when passwords don't match", () => {
      const password = "mysecretpassword";
      const wrongPassword = "wrongpassword";
      const hashedPassword = hashPassword(password);
      
      expect(comparePasswords(hashedPassword, wrongPassword)).toBe(false);
    });
  });
});
