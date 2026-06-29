import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { readJsonBody, sendJson, setCorsHeaders, verifyRequest } from "./_shared.js";

const MAX_STATE_CHARS = 2_000_000;
let ossClientPromise = null;

export default async function handler(req, res) {
  setCorsHeaders(res, "GET, PUT, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  let user;
  try {
    user = verifyRequest(req);
  } catch (error) {
    sendJson(res, 401, { error: "请重新登录云端同步。" });
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
      if (serialized.length > MAX_STATE_CHARS) {
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
