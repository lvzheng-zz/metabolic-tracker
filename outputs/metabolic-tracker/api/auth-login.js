import { readJsonBody, sendJson, setCorsHeaders, signToken, verifyPassword } from "./_shared.js";

export default async function handler(req, res) {
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
      sendJson(res, 401, { error: "账号或密码不正确" });
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
