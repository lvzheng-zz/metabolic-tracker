import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const maxStateChars = 2_000_000;
const defaultTokenTtlSeconds = 60 * 60 * 24 * 30;
let recognizeFoodHandlerPromise = null;
let ossClientPromise = null;

const routes = new Map([
  ["/api/auth/login", authLogin],
  ["/api/recognize-food", recognizeFood],
  ["/api/health/import", importHealthData],
  ["/api/sync", syncState]
]);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const route = routes.get(url.pathname);
    if (route) {
      await route(req, responseAdapter(res));
      return;
    }
    await serveStatic(url.pathname, res);
  } catch (error) {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    res.end(JSON.stringify({ error: error.message || "Server error" }));
  }
});

server.listen(port, () => {
  console.log(`metabolic-tracker listening on http://localhost:${port}`);
});

function responseAdapter(res) {
  return {
    setHeader(name, value) {
      res.setHeader(name, value);
    },
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(data) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(data));
    },
    end(data) {
      res.end(data);
    }
  };
}

async function authLogin(req, res) {
  setCorsHeaders(res, "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    const result = verifyPassword(password);

    if (!username || username !== result.username || !result.ok) {
      sendJson(res, 401, { error: "Invalid username or password" });
      return;
    }

    sendJson(res, 200, {
      token: signToken({ username }),
      username
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Login failed" });
  }
}

async function syncState(req, res) {
  setCorsHeaders(res, "GET, PUT, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  let user;
  try {
    user = verifyRequest(req);
  } catch {
    sendJson(res, 401, { error: "Please log in again." });
    return;
  }

  try {
    if (req.method === "GET") {
      const state = await readCloudState(user.username);
      sendJson(res, 200, { state });
      return;
    }

    if (req.method === "PUT") {
      const body = await readJsonBody(req);
      const state = body.state && typeof body.state === "object" ? body.state : null;
      if (!state) {
        sendJson(res, 400, { error: "Missing state" });
        return;
      }

      const serialized = JSON.stringify({
        state,
        updatedAt: new Date().toISOString()
      });
      if (serialized.length > maxStateChars) {
        sendJson(res, 413, { error: "State is too large" });
        return;
      }

      await writeCloudState(user.username, serialized);
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Sync failed" });
  }
}

async function importHealthData(req, res) {
  setCorsHeaders(res, "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "GET") {
    sendJson(res, 200, {
      ok: true,
      endpoint: "/api/health/import",
      accepts: ["date", "weight", "bodyFat", "sleepHours", "exerciseMinutes", "exerciseKcal", "workouts"],
      auth: process.env.APP_HEALTH_IMPORT_TOKEN ? "X-Health-Import-Token or Authorization" : "Authorization"
    });
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  let body;
  let user;
  try {
    body = await readJsonBody(req);
    user = verifyHealthImportRequest(req, body);
  } catch (error) {
    sendJson(res, 401, { error: error.message || "Health import is not authorized." });
    return;
  }

  try {
    const imported = normalizeHealthImportPayload(body);
    const bodyCount = imported.bodyEntries.length;
    const exerciseCount = imported.exerciseEntries.length;
    if (!bodyCount && !exerciseCount) {
      sendJson(res, 400, { error: "No usable health data was found." });
      return;
    }

    const current = (await readCloudState(user.username)) || {};
    const nextState = mergeHealthImportIntoState(current, imported);
    const serialized = JSON.stringify({
      state: nextState,
      updatedAt: new Date().toISOString()
    });
    if (serialized.length > maxStateChars) {
      sendJson(res, 413, { error: "State is too large" });
      return;
    }

    await writeCloudState(user.username, serialized);
    sendJson(res, 200, {
      ok: true,
      source: imported.source,
      bodyCount,
      exerciseCount,
      updatedAt: nextState.updatedAt
    });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Health import failed" });
  }
}

async function recognizeFood(req, res) {
  try {
    if (!recognizeFoodHandlerPromise) {
      recognizeFoodHandlerPromise = import("./api/recognize-food.js").then((mod) => mod.default);
    }
    const handler = await recognizeFoodHandlerPromise;
    await handler(req, res);
  } catch (error) {
    sendJson(res, 500, {
      error: error.message || "Photo recognition route is not available. Re-upload the full package."
    });
  }
}

function setCorsHeaders(res, methods = "GET, PUT, POST, OPTIONS") {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Health-Import-Token");
}

function sendJson(res, status, data) {
  res.status(status).json(data);
}

async function readJsonBody(req) {
  if (req.body) return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function passwordDigest(password, salt) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

function verifyPassword(password) {
  const username = requireEnv("APP_USERNAME");
  const salt = requireEnv("APP_PASSWORD_SALT");
  const expected = requireEnv("APP_PASSWORD_SHA256");
  const actual = passwordDigest(password, salt);
  return { username, ok: safeStringEqual(actual, expected) };
}

function signToken(payload) {
  const secret = requireEnv("APP_JWT_SECRET");
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + Number(process.env.APP_TOKEN_TTL_SECONDS || defaultTokenTtlSeconds)
  };
  const header = { alg: "HS256", typ: "JWT" };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(body))}`;
  const signature = createHmac("sha256", secret).update(unsigned).digest("base64url");
  return `${unsigned}.${signature}`;
}

function verifyRequest(req) {
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

function verifyHealthImportRequest(req, body = {}) {
  const importToken = process.env.APP_HEALTH_IMPORT_TOKEN;
  const provided = String(req.headers["x-health-import-token"] || body.token || "").trim();
  if (importToken && provided && safeStringEqual(provided, importToken)) {
    return { username: requireEnv("APP_USERNAME"), source: "health-import-token" };
  }
  return verifyRequest(req);
}

function safeStringEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && timingSafeEqual(left, right);
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

async function readCloudState(username) {
  if (process.env.OSS_BUCKET) return readOssState(username);
  return readLocalState(username);
}

async function writeCloudState(username, serialized) {
  if (process.env.OSS_BUCKET) {
    await writeOssState(username, serialized);
    return;
  }
  await writeLocalState(username, serialized);
}

async function readLocalState(username) {
  try {
    const raw = await readFile(localStatePath(username), "utf8");
    return JSON.parse(raw).state || null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function writeLocalState(username, serialized) {
  const file = localStatePath(username);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, serialized, "utf8");
}

function localStatePath(username) {
  const baseDir = process.env.SYNC_DATA_DIR || path.join(os.tmpdir(), ".metabolic-tracker-data");
  return path.join(baseDir, `${safeKey(username)}.json`);
}

async function readOssState(username) {
  const client = await getOssClient();
  try {
    const result = await client.get(ossKey(username));
    return JSON.parse(result.content.toString("utf8")).state || null;
  } catch (error) {
    if (error.code === "NoSuchKey" || error.status === 404) return null;
    throw error;
  }
}

async function writeOssState(username, serialized) {
  const client = await getOssClient();
  await client.put(ossKey(username), Buffer.from(serialized, "utf8"), {
    headers: { "Content-Type": "application/json" }
  });
}

async function getOssClient() {
  if (!ossClientPromise) {
    ossClientPromise = import("ali-oss").then((mod) => {
      const OSS = mod.default || mod;
      return new OSS({
        region: process.env.OSS_REGION,
        bucket: process.env.OSS_BUCKET,
        accessKeyId: process.env.OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
        stsToken: process.env.OSS_STS_TOKEN,
        authorizationV4: true
      });
    });
  }
  return ossClientPromise;
}

function ossKey(username) {
  const prefix = (process.env.OSS_STATE_PREFIX || "metabolic-tracker").replace(/^\/+|\/+$/g, "");
  return `${prefix}/${safeKey(username)}.json`;
}

function safeKey(value) {
  return encodeURIComponent(String(value || "user").trim().toLowerCase());
}

function normalizeHealthImportPayload(body) {
  const source = String(body.source || "Apple 健康自动同步").slice(0, 60);
  const bodyMap = new Map();
  const exerciseEntries = [];

  normalizeBodyEntries(body.bodyEntries || body.body || body.metrics).forEach((entry) => {
    mergeBodyEntryByDate(bodyMap, entry);
  });

  const topLevelBody = normalizeBodyEntry(body, body.date || body.day || body.startDate);
  if (topLevelBody) mergeBodyEntryByDate(bodyMap, topLevelBody);

  normalizeExerciseEntries(body.exerciseEntries || body.exercises || body.workouts, source).forEach((entry) => {
    exerciseEntries.push(entry);
  });

  const topLevelExercise = normalizeExerciseEntry(body, source, body.date || body.day || body.startDate);
  if (topLevelExercise) exerciseEntries.push(topLevelExercise);

  return {
    source,
    bodyEntries: Array.from(bodyMap.values()),
    exerciseEntries: dedupeById(exerciseEntries)
  };
}

function normalizeBodyEntries(value) {
  const items = Array.isArray(value) ? value : value && typeof value === "object" ? [value] : [];
  return items.map((item) => normalizeBodyEntry(item, item.date || item.day || item.startDate)).filter(Boolean);
}

function normalizeBodyEntry(item, rawDate) {
  if (!item || typeof item !== "object") return null;
  const date = normalizeDate(rawDate);
  if (!date) return null;
  const entry = { id: `body-health-${date}`, date };
  addNumberField(entry, "weight", item.weight ?? item.bodyWeight ?? item.bodyMass ?? item.kg, 1);
  addNumberField(entry, "bodyFat", item.bodyFat ?? item.bodyFatPercentage ?? item.fatPercentage, 1, true);
  addNumberField(entry, "sleep", item.sleep ?? item.sleepHours ?? item.sleepH ?? item.asleepHours, 1);
  return Object.keys(entry).length > 2 ? entry : null;
}

function normalizeExerciseEntries(value, source) {
  const items = Array.isArray(value) ? value : value && typeof value === "object" ? [value] : [];
  return items.map((item) => normalizeExerciseEntry(item, source, item.date || item.day || item.startDate)).filter(Boolean);
}

function normalizeExerciseEntry(item, source, rawDate) {
  if (!item || typeof item !== "object") return null;
  const date = normalizeDate(rawDate);
  if (!date) return null;
  const minutes = numberFromText(item.minutes ?? item.exerciseMinutes ?? item.durationMinutes ?? item.workoutMinutes);
  const kcal = numberFromText(item.kcal ?? item.exerciseKcal ?? item.activeEnergyKcal ?? item.calories ?? item.energy);
  if (minutes === null && kcal === null) return null;
  const type = String(item.type || item.workoutType || item.activity || "Apple Watch 活动").trim();
  return {
    id: item.id || `exercise-health-${date}-${hashText(`${type}-${minutes ?? 0}-${kcal ?? 0}-${item.startDate || ""}`)}`,
    date,
    type,
    minutes: roundNumber(minutes ?? 0, 0),
    intensity: item.intensity || "normal",
    heartRate: numberFromText(item.heartRate ?? item.avgHeartRate ?? item.averageHeartRate) ?? "",
    kcal: roundNumber(kcal ?? 0, 0),
    notes: String(item.notes || item.note || source || "Apple 健康自动同步").trim()
  };
}

function mergeHealthImportIntoState(current, imported) {
  return {
    ...current,
    bodyEntries: mergeBodyEntriesByDate(current.bodyEntries, imported.bodyEntries),
    exerciseEntries: mergeEntriesById(current.exerciseEntries, imported.exerciseEntries),
    updatedAt: new Date().toISOString()
  };
}

function mergeBodyEntryByDate(map, entry) {
  const current = map.get(entry.date) || { id: entry.id || `body-health-${entry.date}`, date: entry.date };
  map.set(entry.date, { ...current, ...entry, id: current.id || entry.id });
}

function mergeBodyEntriesByDate(existing = [], incoming = []) {
  const map = new Map();
  (Array.isArray(existing) ? existing : []).forEach((entry) => {
    if (entry?.date) map.set(entry.date, entry);
  });
  incoming.forEach((entry) => {
    if (!entry?.date) return;
    map.set(entry.date, { ...(map.get(entry.date) || {}), ...entry });
  });
  return Array.from(map.values());
}

function mergeEntriesById(existing = [], incoming = []) {
  const map = new Map();
  (Array.isArray(existing) ? existing : []).forEach((entry) => {
    if (entry?.id) map.set(entry.id, entry);
  });
  incoming.forEach((entry) => {
    if (!entry?.id) return;
    map.set(entry.id, { ...(map.get(entry.id) || {}), ...entry });
  });
  return Array.from(map.values());
}

function dedupeById(entries) {
  return mergeEntriesById([], entries);
}

function addNumberField(entry, key, value, digits = 1, percent = false) {
  const number = numberFromText(value);
  if (number === null) return;
  entry[key] = roundNumber(percent && number <= 1 ? number * 100 : number, digits);
}

function normalizeDate(value) {
  const text = String(value || "").trim();
  const direct = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (direct) return `${direct[1]}-${direct[2].padStart(2, "0")}-${direct[3].padStart(2, "0")}`;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return "";
  const shifted = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 10);
}

function numberFromText(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const text = String(value).replace(/,/g, "").trim();
  const direct = Number(text);
  if (Number.isFinite(direct)) return direct;
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function roundNumber(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function hashText(text) {
  return createHash("sha1").update(String(text)).digest("hex").slice(0, 12);
}

async function serveStatic(pathname, res) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded === "/" ? "index.html" : decoded.slice(1);
  if (!relative || relative.includes("..") || path.isAbsolute(relative)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  const filePath = path.join(rootDir, relative);
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    res.statusCode = 200;
    res.setHeader("Content-Type", contentType(filePath));
    res.setHeader("Cache-Control", cacheControl(filePath));
    createReadStream(filePath).pipe(res);
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

function cacheControl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if ([".html", ".css", ".js"].includes(ext)) return "no-store, max-age=0";
  return "public, max-age=3600";
}
