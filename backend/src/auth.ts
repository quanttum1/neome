import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import type { PrismaClient } from "./generated/client";

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

export function authorise(prisma: PrismaClient) {
  return async (req: any, res: any, next: NextFunction) => {
    const authorisationHeader = req.get("Authorization");
    if (authorisationHeader === undefined) return res.status(400).json({ error: "Authorisation header not provided" });

    if (!authorisationHeader.startsWith("Bearer "))
      return res.status(400).json({ error: "Authorisation header should start with `Bearer `" });

    const token = authorisationHeader.substring("Bearer ".length);
    const user = await prisma.user.findUnique({
      where: { token }
    });

    if (!user) return res.status(401).json({ error: "Invalid token" });
    req.user = { username: user.username, id: user.id };
    next()
  };
}
