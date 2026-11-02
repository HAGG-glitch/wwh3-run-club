#!/usr/bin/env node
/**
 * Generate the value for the ADMIN_PASSWORD_HASH environment variable.
 *
 * Usage:
 *   node scripts/hash-password.mjs "the club password"
 *   ADMIN_PASSWORD="the club password" node scripts/hash-password.mjs
 *
 * The format must stay in sync with verifyPassword() in netlify/lib/auth.ts:
 *   scrypt:<saltHex>:<keyHex>
 */
import crypto from "node:crypto";

const password = process.argv[2] ?? process.env.ADMIN_PASSWORD;

if (!password) {
  console.error(
    'Usage: node scripts/hash-password.mjs "the club password"',
  );
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const key = crypto.scryptSync(password, salt, 32);

console.log(`scrypt:${salt.toString("hex")}:${key.toString("hex")}`);
