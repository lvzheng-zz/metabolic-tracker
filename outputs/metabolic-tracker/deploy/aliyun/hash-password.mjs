import { createHash, randomBytes } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node hash-password.mjs <password>");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = createHash("sha256").update(`${salt}:${password}`).digest("hex");

console.log(`APP_PASSWORD_SALT=${salt}`);
console.log(`APP_PASSWORD_SHA256=${hash}`);
