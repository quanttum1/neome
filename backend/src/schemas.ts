import { z } from "zod";

export const RegisterLoginSchema = z.object({
  username: z.string()
  .min(3)
  .max(32)
  .regex(/^[A-Za-z0-9_]+$/, {
    message: "Username can only contain letters, numbers and underscores",
  }),

  password: z.string(),
});
export type RegisterLogin= z.infer<typeof RegisterLoginSchema>;

export const SyncSchema = z.object({
  lastSyncTime: z.optional(z.iso.datetime()),

  events: z.array(z.looseObject({
    id: z.uuid(),
    time: z.iso.datetime(),
  })),
});
export type Sync = z.infer<typeof SyncSchema>;
