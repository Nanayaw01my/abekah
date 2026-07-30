import bcrypt from "bcryptjs";
import User from "@/models/User";

// Runs once per server process — Render keeps the process alive between
// requests, so this is effectively a boot-time seed.
let seeded = false;

/**
 * Creates the superadmin account from environment variables, or brings an
 * existing account in line with them.
 *
 * Set ADMIN_EMAIL and ADMIN_PASSWORD to enable. The env vars are the source
 * of truth: on each deploy the account is re-synced to match them, which
 * doubles as password recovery. Leave them unset and nothing happens.
 *
 * Assumes connectDB() has already been awaited by the caller.
 */
export async function seedAdmin() {
  if (seeded) return;

  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    seeded = true;
    return;
  }

  try {
    // "+password" keeps every other field too; an inclusive projection here
    // would drop role/verified/suspended and corrupt the save below.
    const existing = await User.findOne({ email }).select("+password");

    if (existing) {
      // Re-sync so the env vars stay authoritative, but skip the write when
      // nothing actually changed — avoids a bcrypt hash on every cold start.
      const passwordMatches = await bcrypt.compare(password, existing.password || "");
      if (!passwordMatches || existing.role !== "admin" || existing.suspended) {
        existing.password = passwordMatches ? existing.password : await bcrypt.hash(password, 12);
        existing.role = "admin";
        existing.verified = true;
        existing.suspended = false;
        await existing.save();
        console.log(`[seedAdmin] Synced admin account: ${email}`);
      }
    } else {
      await User.create({
        name: process.env.ADMIN_NAME?.trim() || "Super Admin",
        email,
        password: await bcrypt.hash(password, 12),
        role: "admin",
        verified: true,
      });
      console.log(`[seedAdmin] Created admin account: ${email}`);
    }

    seeded = true;
  } catch (error) {
    // Don't mark as seeded — let the next request retry.
    console.error("[seedAdmin] Failed to seed admin:", error);
  }
}
