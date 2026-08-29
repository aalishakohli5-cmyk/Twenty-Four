import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";
import { SIGNUP_BONUS } from "../utils/coins";

export interface AuthedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing bearer token" });
  }
  const token = header.slice(7);

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.userId = data.user.id;
    req.userEmail = data.user.email;

    const existing = await prisma.profile.findUnique({
      where: { id: data.user.id },
    });

    if (!existing) {
      await prisma.profile.create({
        data: {
          id: data.user.id,
          email: data.user.email ?? `${data.user.id}@unknown.local`,
          coinBalance: SIGNUP_BONUS,
          settings: { create: {} },
          transactions: {
            create: {
              type: "SIGNUP_BONUS",
              amount: SIGNUP_BONUS,
              note: "Welcome signup bonus",
            },
          },
        },
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
