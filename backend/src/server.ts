import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "./generated/client";
import "dotenv/config";
import { hashPassword } from "./auth";
import { verifyPassword } from "./auth";
import { generateToken } from "./auth";
import { authorise } from "./auth";
import cors from "cors";
import validate from "./validate";
import { RegisterLoginSchema, SyncSchema } from './schemas';
import type { RegisterLogin, Sync } from './schemas';

const app = express();
app.use(express.json());
app.use(cors());

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

app.post("/register", validate(RegisterLoginSchema),
  async (req, res) => {
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

app.post("/login", validate(RegisterLoginSchema),
  async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ error: "User with such username doesn't exist" });

    if (!await verifyPassword(password, user.passwordHash)) return res.status(401).json({ error: "Invalid password" });

    return res.json({ token: user.token });
});

const userLocks = new Set<number>();

// Accepts lastSyncTime (optionally) and new events (can be empty)
// Pushes the new events, and returns all the events that have `pushTime > lastSyncTime`
// except that it shouldn't return the events that the user provided in `events`
// Also returns newSyncTime that should be equal to the the highest pushTime among
// both just inserted and returned events
app.post("/sync", [validate(SyncSchema), authorise(prisma)],
  async (req: any, res: any) => {
    function maxStr(a: string, b: string) { return a > b ? a : b; } // Math.max doesn't work with strings

    const { user } = req;
    while (userLocks.has(user.id)) await new Promise(r => setTimeout(r, 10));
    userLocks.add(user.id);

    try {
      const { lastSyncTime, events } = req.body;
      let newSyncTime = lastSyncTime ?? "";
      const clientIds: Set<string> = new Set(events.map((e: { id: string }) => e.id));

      const newEvents = (await prisma.event.findMany({
        where: {
          pushTime: lastSyncTime ? { gt: new Date(lastSyncTime) } : undefined,
          NOT: {
            id: { in: [...clientIds] },
          },
          userId: user.id,
        },
      }))
        .map((e: { id: string, time: Date, pushTime: Date, data: any }) => {
          newSyncTime = maxStr(newSyncTime, e.pushTime.toISOString());
          return {
            ...e.data,
            time: e.time,
            id: e.id,
          };
        });

      for (const e of events) {
        const { id, time, ...data } = e;
        try {
          const event = await prisma.event.create({
            data: { id, time: new Date(time), data, userId: req.user.id },
            select: { pushTime: true },
          });

          newSyncTime = maxStr(newSyncTime, event.pushTime.toISOString());
        } catch (error) {
          // If we DO get this error, that means that there is already an event with this id. We can handle it, so
          // if the error is anything else, we throw it (note that little `!`)
          if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) throw error;

          const event = await prisma.event.findUnique({
            where: { id },
            select: { pushTime: true },
          });

          if (!event) throw new Error("Unreachable");
          newSyncTime = maxStr(newSyncTime, event.pushTime.toISOString());
        }
      }

      return res.json({ newSyncTime, newEvents });
    } catch (error) {
      console.error(error);
      return res.status(500);
    } finally {
      userLocks.delete(user.id);
    }
});

app.listen(3000, () => {
  console.log("Server running");
});
