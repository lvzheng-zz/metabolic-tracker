import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

export function setCorsHeaders(res, methods = "GET, PUT, POST, OPTIONS") {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

export function sendJson(res, status, data) {
  res.status(status).json(data);
}

export async function readJsonBody(req) {
  if (req.body) return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function passwordDigest(password, salt) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

export function verifyPassword(password) {
  const username = requireEnv("APP_USERNAME");
  const salt = requireEnv("APP_PASSWORD_SALT");
  const expected = requireEnv("APP_PASSWORD_SHA256");
  const actual = passwordDigest(password, salt);
  return { username, ok: safeStringEqual(actual, expected) };
}

export function signToken(payload) {
  const secret = requireEnv("APP_JWT_SECRET");
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + Number(process.env.APP_TOKEN_TTL_SECONDS || DEFAULT_TOKEN_TTL_SECONDS)
  };
  const header = { alg: "HS256", typ: "JWT" };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(body))}`;
  const signature = createHmac("sha256", secret).update(unsigned).digest("base64url");
  return `${unsigned}.${signature}`;
}

export function verifyRequest(req) {
  const auth = req.headers.authorization || req.headers.Authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) throw new Error("Missing token");

  const [headerPart, bodyPart, signature] = token.split(".");
  if (!headerPart || !bodyPart || !signature) throw new Error("Invalid token");

  const secret = requireEnv("APP_JWT_SECRET");
  const unsigned = `${headerPart}.${bodyPart}`;
  const expected = createHmac("sha256", secret).update(unsigned).digest("base64url");
  if (!safeStringEqual(signature, expected)) throw new Error("Invalid token");

  const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) throw new Error("Token expired");
  if (!payload.username) throw new Error("Invalid token payload");
  return payload;
}

function safeStringEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}
