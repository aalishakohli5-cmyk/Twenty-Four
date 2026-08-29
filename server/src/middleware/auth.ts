import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../lib/prisma";

export interface AuthedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

// Server-side Supabase client using the secret key — this can call
// supabase.auth.getUser() to validate any user's access token, which works
// regardless of whether the project uses legacy JWT secrets or the newer
// asymmetric (JWKS) signing keys. No manual JWT decoding needed.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
);

// Verifies the Supabase-issued access token sent from the client as
// "Authorization: Bearer <access_token>" and ensures a matching
// Profile row exists (created on first request).
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

    // Upsert a lightweight profile the first time we see this user.
    await prisma.profile.upsert({
      where: { id: data.user.id },
      update: {},
      create: {
        id: data.user.id,
        email: data.user.email ?? `${data.user.id}@unknown.local`,
        settings: { create: {} },
      },
    });

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
