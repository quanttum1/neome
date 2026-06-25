import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";
import "dotenv/config";
import { hashPassword } from "./auth";
import { verifyPassword } from "./auth";
import { generateToken } from "./auth";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.post("/register", async (req, res) => {
  if (!req.body) return res.status(400).json({ error: "No body" });
  if (!req.body.username || !req.body.password)
    return res.status(400).json({ error: "Missing fields" });

  const { username, password } = req.body;

  try {
    const passwordHash = await hashPassword(password);

    const token = generateToken();
    const user = await prisma.user.create({
      data: { username, passwordHash, token },
    });

    res.json({
      token: token,
    });
  } catch (err: any) {
    // username already exists
    return res.status(400).json({ error: "User already exists" });
  }
});

app.post("/login", async (req, res) => {
  if (!req.body) return res.status(400).json({ error: "No body" });
  if (!req.body.username || !req.body.password)
    return res.status(400).json({ error: "Missing fields" });

  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) return res.status(401).json({ error: "User with such username doesn't exist" });

  if (!await verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: "Invalid password" });

  return res.json({ token: user.token });
});

app.get("/me", async (req, res) => {
  const authorizationHeader = req.get("Authorization");
  if (authorizationHeader === undefined) return res.json({ error: "Authorization header is not provided" });

  const token = authorizationHeader.substring("Bearer ".length);

  const user = await prisma.user.findUnique({
    where: { token }
  });

  if (!user) return res.status(401).json({ error: "Invalid token" });

  return res.json({ username: user.username });
})

app.listen(3000, () => {
  console.log("Server running");
});
