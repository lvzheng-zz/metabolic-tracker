const MAX_IMAGE_CHARS = 10_000_000;
const MAX_REQUEST_CHARS = 10_500_000;
const REQUEST_TIMEOUT_MS = 55_000;
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_DASHSCOPE_MODEL = "qwen-vl-plus";
const DEFAULT_DASHSCOPE_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const DEFAULT_DASHSCOPE_REGION = "cn-beijing";
const RECOGNIZE_FOOD_VERSION = "2026-06-30-ai-json-repair";

const foodResultSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          meal: { type: "string", enum: ["早餐", "午餐", "晚餐", "加餐", "饮品"] },
          foodName: { type: "string" },
          grams: { type: "number" },
          kcal100: { type: "number" },
          protein100: { type: "number" },
          carbs100: { type: "number" },
          fat100: { type: "number" },
          notes: { type: "string" }
        },
        required: ["meal", "foodName", "grams", "kcal100", "protein100", "carbs100", "fat100", "notes"]
      }
    }
  },
  required: ["items"]
};

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    sendJson(res, 200, recognitionStatus());
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const provider = aiProviderConfig();
    const apiKey = provider.apiKey;
    if (!apiKey) {
      throw httpError(
        501,
        "服务端没有配置 AI Key。请在阿里云函数环境变量中添加 OPENAI_API_KEY 或 DASHSCOPE_API_KEY 后重启函数。",
        "missing_openai_api_key"
      );
    }

    const model = provider.model;
    if (isPlaceholder(model)) {
      throw httpError(500, "OPENAI_MODEL 还是示例占位值，请删除该变量或填写真实模型名。", "invalid_openai_model");
    }

    const body = await readJsonBody(req);
    const image = pickImage(body);
    const meal = typeof body.meal === "string" ? body.meal : "";

    validateImage(image);

    const result = await recognizeWithOpenAi({
      apiKey,
      model,
      baseUrl: provider.baseUrl,
      image,
      meal
    });

    sendJson(res, 200, {
      items: sanitizeItems(result.items),
      model: result.model,
      apiStyle: result.apiStyle,
      provider: provider.provider
    });
  } catch (error) {
    sendJson(res, error.status || 500, {
      error: error.message || "AI 识别失败，请稍后重试。",
      code: error.code || "recognition_failed",
      detail: error.detail || ""
    });
  }
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sendJson(res, status, data) {
  res.status(status).json(data);
}

function recognitionStatus() {
  const provider = aiProviderConfig();
  const apiKey = provider.apiKey;
  const model = provider.model;
  const baseUrl = provider.baseUrl;
  const workspaceConfigured = provider.provider !== "dashscope" || Boolean(provider.workspaceId);
  const configuredStyle = cleanEnv("OPENAI_API_STYLE").toLowerCase();
  const apiStyle = ["responses", "chat", "auto"].includes(configuredStyle) ? configuredStyle : "chat";
  let baseUrlHost = "";
  try {
    baseUrlHost = new URL(baseUrl).host;
  } catch {
    baseUrlHost = "invalid";
  }
  return {
    ok: Boolean(apiKey) && !isPlaceholder(model) && baseUrlHost !== "invalid" && workspaceConfigured,
    version: RECOGNIZE_FOOD_VERSION,
    hasApiKey: Boolean(apiKey),
    provider: provider.provider,
    dashScopeRegion: provider.provider === "dashscope" ? provider.region : "",
    dashScopeWorkspace: provider.provider === "dashscope" ? (provider.workspaceId ? "已配置" : "未配置") : "",
    model,
    apiStyle,
    baseUrlHost,
    maxImageMB: Math.round((MAX_IMAGE_CHARS * 3) / 4 / 1024 / 1024),
    hints: recognitionHints({
      apiKey,
      model,
      baseUrlHost,
      apiStyle,
      provider: provider.provider,
      workspaceConfigured
    })
  };
}

function recognitionHints({ apiKey, model, baseUrlHost, apiStyle, provider, workspaceConfigured }) {
  const hints = [];
  if (!apiKey) hints.push("未配置 OPENAI_API_KEY 或 DASHSCOPE_API_KEY，拍照识别不会真正调用。");
  if (isPlaceholder(model)) hints.push("OPENAI_MODEL 仍是示例占位值，请删除或改成真实视觉模型。");
  if (baseUrlHost === "invalid") hints.push("OPENAI_BASE_URL 不是有效 URL。");
  if (provider === "dashscope") hints.push("当前使用阿里云百炼/DashScope 兼容接口。");
  if (provider === "dashscope" && !workspaceConfigured) hints.push("新版百炼地域接口需要 DASHSCOPE_WORKSPACE_ID，请从业务空间管理复制业务空间 ID。");
  if (apiStyle === "responses") hints.push("当前使用 Responses API；兼容接口失败时可改为 chat。");
  if (!hints.length) hints.push("基础配置看起来正常；如果仍失败，多半是模型权限、余额、网络或图片格式问题。");
  return hints;
}

async function readJsonBody(req) {
  if (req.body) return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_REQUEST_CHARS) {
      throw httpError(413, "照片数据太大，请重新拍摄或换一张较小的照片。", "request_too_large");
    }
  }
  return raw ? JSON.parse(raw) : {};
}

function pickImage(body) {
  if (!body || typeof body !== "object") return "";
  return String(body.image || body.imageDataUrl || body.dataUrl || body.photo || "");
}

function validateImage(image) {
  if (!image.startsWith("data:image/")) {
    throw httpError(400, "没有收到有效的食物照片，请重新拍照后再识别。", "missing_image");
  }
  if (image.length > MAX_IMAGE_CHARS) {
    throw httpError(413, "照片仍然过大，请重新拍摄或换一张较小的照片。", "image_too_large");
  }
}

async function recognizeWithOpenAi({ apiKey, model, baseUrl, image, meal }) {
  const configuredStyle = cleanEnv("OPENAI_API_STYLE").toLowerCase();
  const apiStyle = ["responses", "chat", "auto"].includes(configuredStyle) ? configuredStyle : "chat";

  if (apiStyle === "chat") {
    return recognizeViaChat({ apiKey, baseUrl, model, image, meal });
  }

  try {
    return await recognizeViaResponses({ apiKey, baseUrl, model, image, meal });
  } catch (error) {
    const canFallbackToChat = apiStyle === "auto" && [400, 404, 405].includes(error.upstreamStatus || error.status);
    if (!canFallbackToChat) throw error;
    return recognizeViaChat({ apiKey, baseUrl, model, image, meal });
  }
}

async function recognizeViaResponses({ apiKey, baseUrl, model, image, meal }) {
  const payload = {
    model,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildPrompt(meal, true)
          },
          {
            type: "input_image",
            image_url: image
          }
        ]
      }
    ],
    max_output_tokens: 900,
    text: {
      format: {
        type: "json_schema",
        name: "food_photo_result",
        strict: true,
        schema: foodResultSchema
      }
    }
  };

  const data = await postOpenAiJson(`${baseUrl}/responses`, apiKey, payload, "Responses API");
  return {
    items: parseResponsePayload(data).items,
    model,
    apiStyle: "responses"
  };
}

async function recognizeViaChat({ apiKey, baseUrl, model, image, meal }) {
  const payload = {
    model,
    messages: [
      {
        role: "system",
        content: "你是个人饮食记录助手。你只返回 JSON，不返回 Markdown。"
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: buildPrompt(meal, false)
          },
          {
            type: "image_url",
            image_url: {
              url: image,
              detail: "low"
            }
          }
        ]
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 900
  };

  const data = await postChatWithFallback(`${baseUrl}/chat/completions`, apiKey, payload);

  return {
    items: parseResponseJson(data.choices?.[0]?.message?.content || "").items,
    model,
    apiStyle: "chat"
  };
}

async function postChatWithFallback(url, apiKey, payload) {
  const currentPayload = { ...payload };
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await postOpenAiJson(url, apiKey, currentPayload, "Chat Completions API");
    } catch (error) {
      if (error.upstreamStatus !== 400) throw error;
      const detail = error.detail || "";
      if (currentPayload.response_format && /response_format/i.test(detail)) {
        delete currentPayload.response_format;
        continue;
      }
      if (currentPayload.max_tokens && /max_tokens/i.test(detail)) {
        currentPayload.max_completion_tokens = currentPayload.max_tokens;
        delete currentPayload.max_tokens;
        continue;
      }
      if (currentPayload.temperature !== undefined && /temperature/i.test(detail)) {
        delete currentPayload.temperature;
        continue;
      }
      throw error;
    }
  }
  return postOpenAiJson(url, apiKey, currentPayload, "Chat Completions API");
}

async function postOpenAiJson(url, apiKey, payload, label) {
  const response = await fetchWithTimeout(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = upstreamMessage(data, response.status, label);
    throw httpError(
      response.status >= 500 ? 502 : 400,
      "AI 服务调用失败，请检查 OPENAI_API_KEY、OPENAI_MODEL 或 OPENAI_BASE_URL。",
      "openai_api_error",
      message,
      response.status
    );
  }
  return data;
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw httpError(504, "AI 服务响应超时，请稍后重试或换用更快的模型。", "openai_timeout");
    }
    throw httpError(502, "AI 服务网络连接失败，请检查阿里云函数是否能访问配置的 OPENAI_BASE_URL。", "openai_network_error", error.message);
  } finally {
    clearTimeout(timeout);
  }
}

function buildPrompt(meal, strictSchema) {
  return [
    "你是个人饮食记录助手。只根据照片中清晰可见的食物做保守估算，不要编造看不见的食物。",
    "请把每个主要食物拆成一项，使用中文食物名。",
    "每项必须估算：meal、foodName、grams、kcal100、protein100、carbs100、fat100、notes。",
    "grams 是照片中这一项食物的总重量估计；kcal100/protein100/carbs100/fat100 都是每100g数值。",
    "如果无法判断油、酱汁或烹饪方式，在 notes 写明不确定；宁可保守估计，也不要给出看似精确但没有依据的数值。",
    `默认餐次：${meal || "午餐"}。`,
    strictSchema ? "按提供的 JSON schema 返回。" : '只返回 JSON，格式为 {"items":[...]}。'
  ].join("\n");
}

function parseResponsePayload(data) {
  if (data.output_parsed && typeof data.output_parsed === "object") return normalizeParsedObject(data.output_parsed);
  const parsedContent = extractParsedContent(data);
  if (parsedContent) return normalizeParsedObject(parsedContent);
  return parseResponseJson(extractResponseText(data));
}

function extractParsedContent(data) {
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.parsed && typeof content.parsed === "object") return content.parsed;
    }
  }
  return null;
}

function extractResponseText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || content.output_text || "")
    .join("\n")
    .trim();
}

function parseResponseJson(text) {
  if (!text) return { items: [] };
  const cleaned = stripJsonFence(text);
  const candidates = [cleaned, extractJsonObjectText(cleaned), extractJsonArrayAsItemsText(cleaned)].filter(Boolean);
  for (const candidate of candidates) {
    const parsed = tryParseRecognizedJson(candidate);
    if (parsed) return parsed;
  }
  const salvaged = salvageItemsFromJsonLikeText(cleaned);
  if (salvaged.items.length) return salvaged;
  throw httpError(
    422,
    "AI 返回的食物结果不是完整 JSON。我已拦截原始解析报错，请重新点一次识别，或换一张更清晰的照片。",
    "ai_json_parse_error",
    cleaned.slice(0, 500)
  );
}

function stripJsonFence(text) {
  return String(text)
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function extractJsonObjectText(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return start >= 0 && end > start ? text.slice(start, end + 1) : "";
}

function extractJsonArrayAsItemsText(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  return start >= 0 && end > start ? `{"items":${text.slice(start, end + 1)}}` : "";
}

function tryParseRecognizedJson(text) {
  const variants = [text, repairJsonLikeText(text)];
  for (const variant of variants) {
    try {
      return normalizeParsedObject(JSON.parse(variant));
    } catch {
      // Try the next repair variant.
    }
  }
  return null;
}

function repairJsonLikeText(text) {
  return String(text)
    .replace(/^\uFEFF/, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/}\s*{/g, "},{");
}

function salvageItemsFromJsonLikeText(text) {
  const arrayText = extractItemsArrayText(text) || extractTopLevelArrayText(text);
  if (!arrayText) return { items: [] };
  const items = collectBalancedObjects(arrayText)
    .map((itemText) => tryParseJsonObject(itemText))
    .filter(Boolean);
  return { items };
}

function extractItemsArrayText(text) {
  const match = /"?items"?\s*:\s*\[/i.exec(text);
  if (!match) return "";
  const start = match.index + match[0].lastIndexOf("[");
  const end = findMatchingBracket(text, start, "[", "]");
  return end > start ? text.slice(start, end + 1) : "";
}

function extractTopLevelArrayText(text) {
  const start = text.indexOf("[");
  const end = start >= 0 ? findMatchingBracket(text, start, "[", "]") : -1;
  return end > start ? text.slice(start, end + 1) : "";
}

function findMatchingBracket(text, start, openChar, closeChar) {
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = quoted;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (quoted) continue;
    if (char === openChar) depth += 1;
    if (char === closeChar) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function collectBalancedObjects(text) {
  const objects = [];
  let start = -1;
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = quoted;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (quoted) continue;
    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        objects.push(text.slice(start, index + 1));
        start = -1;
      }
    }
  }
  return objects;
}

function tryParseJsonObject(text) {
  const variants = [text, repairJsonLikeText(text)];
  for (const variant of variants) {
    try {
      const parsed = JSON.parse(variant);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
    } catch {
      // Try the next repair variant.
    }
  }
  return null;
}

function normalizeParsedObject(value) {
  if (!value || typeof value !== "object") return { items: [] };
  if (Array.isArray(value.items)) return value;
  if (Array.isArray(value.foods)) return { items: value.foods };
  return { items: [] };
}

function sanitizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      const grams = clampNumber(item.grams ?? item.weightGrams ?? item.weight_g, 1, 3000, 100);
      const totalKcal = optionalNumber(item.kcal ?? item.calories ?? item.totalKcal);
      const kcal100 =
        optionalNumber(item.kcal100 ?? item.caloriesPer100g ?? item.kcal_per_100g) ??
        (totalKcal !== null && grams ? (totalKcal / grams) * 100 : 0);

      return {
        meal: sanitizeMeal(item.meal),
        foodName: sanitizeText(item.foodName || item.name || item.food, 40),
        grams: Math.round(grams),
        kcal100: clampNumber(kcal100, 0, 900, 0),
        protein100: clampNumber(item.protein100 ?? item.proteinPer100g ?? item.protein_per_100g, 0, 100, 0),
        carbs100: clampNumber(item.carbs100 ?? item.carbsPer100g ?? item.carbs_per_100g, 0, 100, 0),
        fat100: clampNumber(item.fat100 ?? item.fatPer100g ?? item.fat_per_100g, 0, 100, 0),
        notes: sanitizeText(item.notes || item.note, 80) || "AI估算"
      };
    })
    .filter((item) => item.foodName && item.grams > 0);
}

function sanitizeMeal(value) {
  return ["早餐", "午餐", "晚餐", "加餐", "饮品"].includes(value) ? value : "午餐";
}

function sanitizeText(value, maxLength) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function clampNumber(value, min, max, fallback = min) {
  const number = optionalNumber(value);
  if (number === null) return fallback;
  return Math.min(max, Math.max(min, Math.round(number * 10) / 10));
}

function optionalNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function aiProviderConfig() {
  const openAiKey = cleanEnv("OPENAI_API_KEY");
  const dashScopeKey = cleanEnv("DASHSCOPE_API_KEY") || cleanEnv("BAILIAN_API_KEY");
  const useDashScope = !openAiKey && Boolean(dashScopeKey);
  const provider = useDashScope ? "dashscope" : "openai";
  const dashScopeWorkspaceId = cleanEnv("DASHSCOPE_WORKSPACE_ID") || cleanEnv("BAILIAN_WORKSPACE_ID");
  const dashScopeRegion = cleanEnv("DASHSCOPE_REGION") || DEFAULT_DASHSCOPE_REGION;
  const dashScopeRegionalBaseUrl = dashScopeWorkspaceId
    ? `https://${dashScopeWorkspaceId}.${dashScopeRegion}.maas.aliyuncs.com/compatible-mode/v1`
    : DEFAULT_DASHSCOPE_BASE_URL;
  const explicitBaseUrl = cleanEnv("DASHSCOPE_BASE_URL") || cleanEnv("OPENAI_BASE_URL") || cleanEnv("OPENAI_API_BASE");
  const baseUrl =
    useDashScope && (!explicitBaseUrl || normalizeBaseUrl(explicitBaseUrl) === DEFAULT_OPENAI_BASE_URL)
      ? dashScopeRegionalBaseUrl
      : explicitBaseUrl || (useDashScope ? dashScopeRegionalBaseUrl : DEFAULT_OPENAI_BASE_URL);
  return {
    provider,
    apiKey: openAiKey || dashScopeKey,
    workspaceId: dashScopeWorkspaceId,
    region: dashScopeRegion,
    model: cleanEnv("OPENAI_MODEL") || cleanEnv("DASHSCOPE_MODEL") || (useDashScope ? DEFAULT_DASHSCOPE_MODEL : DEFAULT_OPENAI_MODEL),
    baseUrl: normalizeBaseUrl(baseUrl)
  };
}

function cleanEnv(name) {
  const value = String(process.env[name] || "").trim();
  return isPlaceholder(value) ? "" : value;
}

function isPlaceholder(value) {
  const text = String(value || "").trim().toLowerCase();
  return (
    text === "replace-with-current-vision-model" ||
    text === "replace-if-using-openai" ||
    text === "your-openai-api-key" ||
    text === "sk-..." ||
    text === "null" ||
    text === "undefined"
  );
}

function normalizeBaseUrl(value) {
  return String(value || DEFAULT_OPENAI_BASE_URL).replace(/\/+$/, "");
}

function upstreamMessage(data, status, label) {
  const message = data.error?.message || data.message || data.detail || "";
  return `${label} HTTP ${status}${message ? `: ${String(message).slice(0, 260)}` : ""}`;
}

function httpError(status, message, code = "error", detail = "", upstreamStatus = null) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.detail = detail;
  error.upstreamStatus = upstreamStatus;
  return error;
}
