import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}
