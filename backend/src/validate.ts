import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import type { Sync } from "./schemas";

export default function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.issues,
      });
    }

    req.body = result.data;
    next();
  };
}
