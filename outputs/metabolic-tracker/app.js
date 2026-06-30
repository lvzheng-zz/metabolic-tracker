const STORAGE_KEY = "metabolic-tracker-v1";
const AUTH_STORAGE_KEY = "metabolic-tracker-auth-v1";
const APP_VERSION = "2026-06-30-ai-json-repair";

const BUILTIN_FOODS = [
  { name: "米饭（熟）", kcal100: 116, protein100: 2.6, carbs100: 25.9, fat100: 0.3 },
  { name: "面条（熟）", kcal100: 109, protein100: 3.6, carbs100: 21.6, fat100: 0.7 },
  { name: "馒头", kcal100: 223, protein100: 7.0, carbs100: 47.0, fat100: 1.1 },
  { name: "燕麦片", kcal100: 379, protein100: 13.2, carbs100: 67.7, fat100: 6.5 },
  { name: "红薯（蒸）", kcal100: 90, protein100: 1.6, carbs100: 20.7, fat100: 0.2 },
  { name: "土豆（蒸）", kcal100: 77, protein100: 2.0, carbs100: 17.0, fat100: 0.1 },
  { name: "鸡蛋", kcal100: 143, protein100: 12.6, carbs100: 0.7, fat100: 9.5 },
  { name: "鸡胸肉（熟）", kcal100: 165, protein100: 31.0, carbs100: 0, fat100: 3.6 },
  { name: "牛肉（瘦）", kcal100: 180, protein100: 27.0, carbs100: 0, fat100: 8.0 },
  { name: "猪里脊", kcal100: 155, protein100: 20.0, carbs100: 0, fat100: 7.9 },
  { name: "三文鱼", kcal100: 208, protein100: 20.4, carbs100: 0, fat100: 13.4 },
  { name: "虾仁", kcal100: 99, protein100: 24.0, carbs100: 0.2, fat100: 0.3 },
  { name: "北豆腐", kcal100: 116, protein100: 9.2, carbs100: 3.0, fat100: 8.1 },
  { name: "无糖酸奶", kcal100: 63, protein100: 5.3, carbs100: 7.0, fat100: 1.6 },
  { name: "纯牛奶", kcal100: 66, protein100: 3.3, carbs100: 5.0, fat100: 3.6 },
  { name: "西兰花", kcal100: 34, protein100: 2.8, carbs100: 6.6, fat100: 0.4 },
  { name: "青菜", kcal100: 18, protein100: 1.5, carbs100: 2.7, fat100: 0.3 },
  { name: "苹果", kcal100: 52, protein100: 0.3, carbs100: 13.8, fat100: 0.2 },
  { name: "香蕉", kcal100: 89, protein100: 1.1, carbs100: 22.8, fat100: 0.3 },
  { name: "橙子", kcal100: 47, protein100: 0.9, carbs100: 11.8, fat100: 0.1 },
  { name: "花生", kcal100: 567, protein100: 25.8, carbs100: 16.1, fat100: 49.2 },
  { name: "混合坚果", kcal100: 607, protein100: 20.0, carbs100: 21.0, fat100: 54.0 },
  { name: "食用油", kcal100: 884, protein100: 0, carbs100: 0, fat100: 100 },
  { name: "无糖豆浆", kcal100: 31, protein100: 3.0, carbs100: 1.2, fat100: 1.6 },
  { name: "拿铁（无糖）", kcal100: 48, protein100: 2.6, carbs100: 4.6, fat100: 2.1 }
];

const ACTIVITIES = [
  { name: "步行", met: 3.0 },
  { name: "快走", met: 4.3 },
  { name: "慢跑", met: 7.0 },
  { name: "骑行", met: 6.8 },
  { name: "游泳", met: 6.0 },
  { name: "力量训练", met: 5.0 },
  { name: "椭圆机", met: 5.0 },
  { name: "跳绳", met: 10.0 },
  { name: "瑜伽", met: 2.5 },
  { name: "家务", met: 3.3 }
];

const DEFAULT_SUPPLEMENTS = [
  {
    id: "supp-metformin",
    category: "medicine",
    name: "二甲双胍",
    dose: "按医嘱",
    time: "08:30",
    timing: "随餐",
    cadence: "daily",
    active: true,
    reminder: true,
    notes: "随餐或餐后；胃肠不适时记录"
  },
  {
    id: "supp-febuxostat",
    category: "medicine",
    name: "非布司他",
    dose: "按医嘱",
    time: "09:00",
    timing: "固定时间",
    cadence: "daily",
    active: true,
    reminder: true,
    notes: "尿酸、肝功能按复查计划跟踪"
  },
  {
    id: "supp-probiotic",
    category: "supplement",
    name: "益生菌",
    dose: "1粒",
    time: "08:40",
    timing: "早餐后",
    cadence: "daily",
    active: true,
    reminder: true,
    notes: "先观察2-4周，没改善可停"
  },
  {
    id: "supp-d3k2",
    category: "supplement",
    name: "维生素D3+K2",
    dose: "1粒",
    time: "08:40",
    timing: "早餐后",
    cadence: "daily",
    active: true,
    reminder: true,
    notes: "随含脂肪餐；留意D3总IU"
  },
  {
    id: "supp-fish-oil",
    category: "supplement",
    name: "鱼油",
    dose: "2粒",
    time: "08:40",
    timing: "早餐后",
    cadence: "daily",
    active: true,
    reminder: true,
    notes: "鱼油/磷虾油二选一，不叠加"
  },
  {
    id: "supp-magnesium",
    category: "supplement",
    name: "甘氨酸镁",
    dose: "1粒",
    time: "22:30",
    timing: "睡前",
    cadence: "daily",
    active: true,
    reminder: true,
    notes: "先低剂量；不要和ZMA重复叠太多"
  },
  {
    id: "supp-arginine-citrulline",
    category: "supplement",
    name: "精氨酸+瓜氨酸",
    dose: "1片",
    time: "17:30",
    timing: "运动前30-60分钟",
    cadence: "workout",
    active: true,
    reminder: true,
    notes: "训练日使用；关节痛、低血压感或尿酸回升时暂停"
  }
];

const DEFAULT_STATE = {
  settings: {
    sex: "",
    age: "",
    height: "",
    fallbackWeight: "",
    activityFactor: 1.2,
    deficit: 400,
    manualTarget: 1800,
    exerciseCredit: 50,
    minIntake: "",
    targetWeight: "",
    aiFoodEndpoint: "/api/recognize-food",
    cloudApiEndpoint: "/api",
    supplementNotifications: false
  },
  customFoods: [],
  foodEntries: [],
  bodyEntries: [],
  exerciseEntries: [],
  supplementItems: structuredClone(DEFAULT_SUPPLEMENTS),
  supplementLogs: [],
  supplementWorkoutDates: []
};

const ICONS = {
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
  "layout-dashboard":
    '<rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect>',
  utensils:
    '<path d="M3 2v7c0 1.7 1.3 3 3 3s3-1.3 3-3V2"></path><path d="M6 2v20"></path><path d="M13 2v20"></path><path d="M21 15V2c-4 2-6 5-6 9v4h6z"></path>',
  ruler:
    '<path d="M21.3 15.3 15.3 21.3a2.4 2.4 0 0 1-3.4 0L2.7 12.1a2.4 2.4 0 0 1 0-3.4L8.7 2.7a2.4 2.4 0 0 1 3.4 0l9.2 9.2a2.4 2.4 0 0 1 0 3.4z"></path><path d="m14.5 5.5-2 2"></path><path d="m17.5 8.5-2 2"></path><path d="m8.5 11.5-2 2"></path><path d="m11.5 14.5-2 2"></path>',
  bike:
    '<circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="18.5" cy="17.5" r="3.5"></circle><path d="M15 6h2a2 2 0 0 1 2 2v2"></path><path d="m9 11 3 6 3-6"></path><path d="M5.5 17.5 9 11h6l3.5 6.5"></path><path d="M8 6h3"></path>',
  camera:
    '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle>',
  bell:
    '<path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"></path><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>',
  "chart-line": '<path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path>',
  "refresh-cw":
    '<path d="M3 12a9 9 0 0 1 15.1-6.6L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-15.1 6.6L3 16"></path><path d="M3 21v-5h5"></path>',
  settings:
    '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 1 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z"></path>',
  user:
    '<path d="M19 21a7 7 0 0 0-14 0"></path><circle cx="12" cy="7" r="4"></circle>',
  database:
    '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"></path><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"></path>',
  x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M7 10l5 5 5-5"></path><path d="M12 15V3"></path>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="M17 8l-5-5-5 5"></path><path d="M12 3v12"></path>',
  plus: '<path d="M5 12h14"></path><path d="M12 5v14"></path>',
  pill:
    '<path d="m10.5 20.5 10-10a4.2 4.2 0 0 0-6-6l-10 10a4.2 4.2 0 0 0 6 6z"></path><path d="m8.5 10.5 5 5"></path>',
  calculator:
    '<rect width="16" height="20" x="4" y="2" rx="2"></rect><path d="M8 6h8"></path><path d="M8 10h.01"></path><path d="M12 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v5h8"></path>',
  sparkles:
    '<path d="m12 3-1.9 5.8L4 11l6.1 2.2L12 19l1.9-5.8L20 11l-6.1-2.2L12 3z"></path><path d="M5 3v4"></path><path d="M3 5h4"></path><path d="M19 17v4"></path><path d="M17 19h4"></path>',
  "trash-2":
    '<path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path>',
  check: '<path d="M20 6 9 17l-5-5"></path>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
  "chevron-left": '<path d="m15 18-6-6 6-6"></path>',
  "chevron-right": '<path d="m9 18 6-6-6-6"></path>',
  smartphone:
    '<rect width="14" height="20" x="5" y="2" rx="2"></rect><path d="M12 18h.01"></path>',
  watch:
    '<circle cx="12" cy="12" r="5"></circle><path d="M9 2h6l1 4H8l1-4z"></path><path d="m9 22-1-4h8l-1 4H9z"></path><path d="M12 9v3l2 1"></path>',
  scale:
    '<path d="M16 16V7a4 4 0 0 0-8 0v9"></path><rect width="18" height="10" x="3" y="12" rx="2"></rect><path d="M12 7v1"></path><path d="M8 16h8"></path>',
  info: '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

let state = loadState();
let settingsAutosaveTimer = null;
let settingsStatusTimer = null;
let foodPhotoDataUrl = "";
let foodAiDrafts = [];
let supplementReminderTimer = null;
let cloudSyncTimer = null;
let authState = loadAuthState();
let monthCursor = null;
let chartAnimationToken = 0;
const supplementReminderSent = new Set();

function normalizeSupplementItems(items) {
  if (!Array.isArray(items)) return structuredClone(DEFAULT_SUPPLEMENTS);
  return items
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      id: item.id || newId("supp"),
      category: item.category === "medicine" ? "medicine" : "supplement",
      name: String(item.name || "").trim(),
      dose: String(item.dose || "").trim(),
      time: item.time || "08:30",
      timing: String(item.timing || "").trim(),
      cadence: item.cadence === "workout" ? "workout" : "daily",
      active: item.active !== false,
      reminder: item.reminder !== false,
      notes: String(item.notes || "").trim()
    }))
    .filter((item) => item.name);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      customFoods: Array.isArray(parsed.customFoods) ? parsed.customFoods : [],
      foodEntries: Array.isArray(parsed.foodEntries) ? parsed.foodEntries : [],
      bodyEntries: Array.isArray(parsed.bodyEntries) ? parsed.bodyEntries : [],
      exerciseEntries: Array.isArray(parsed.exerciseEntries) ? parsed.exerciseEntries : [],
      supplementItems: normalizeSupplementItems(parsed.supplementItems),
      supplementLogs: Array.isArray(parsed.supplementLogs) ? parsed.supplementLogs : [],
      supplementWorkoutDates: Array.isArray(parsed.supplementWorkoutDates) ? parsed.supplementWorkoutDates : []
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function loadAuthState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || "{}");
    return {
      token: typeof parsed.token === "string" ? parsed.token : "",
      username: typeof parsed.username === "string" ? parsed.username : "",
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : ""
    };
  } catch {
    return { token: "", username: "", savedAt: "" };
  }
}

function saveAuthState(nextAuth) {
  authState = {
    token: nextAuth.token || "",
    username: nextAuth.username || "",
    savedAt: nextAuth.savedAt || new Date().toISOString()
  };
  if (authState.token) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
  renderCloudSyncSettings();
}

function saveState(options = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!options.skipCloudSync) scheduleCloudAutoSync();
}

function todayISO() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function parseLocalDate(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateText, offset) {
  const date = parseLocalDate(dateText);
  date.setDate(date.getDate() + offset);
  return formatLocalDate(date);
}

function daysBetween(start, end) {
  return Math.max(1, Math.round((parseLocalDate(end) - parseLocalDate(start)) / 86400000));
}

function rangeDays(endDate, count) {
  return Array.from({ length: count }, (_, index) => addDays(endDate, index - count + 1));
}

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function round(value, digits = 0) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatKcal(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${Math.round(value)} kcal`;
}

function formatGram(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${round(value, 1)} g`;
}

function formatKcalPair(used, target) {
  if (target === null || target === undefined || Number.isNaN(target)) return formatKcal(used);
  return `${Math.round(used || 0)} / ${Math.round(target)} kcal`;
}

function formatGramPair(used, target) {
  if (target === null || target === undefined || Number.isNaN(target)) return formatGram(used);
  return `${round(used || 0, 1)} / ${round(target, 1)} g`;
}

function formatUnit(value, unit, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${round(value, digits)} ${unit}`;
}

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function activeDate() {
  return $("#activeDate").value || todayISO();
}

function foodCatalog() {
  const map = new Map();
  [...BUILTIN_FOODS, ...state.customFoods].forEach((food) => {
    if (food.name) map.set(food.name, food);
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

function findFood(name) {
  return foodCatalog().find((food) => food.name === name);
}

function getLatestBodyEntry() {
  return [...state.bodyEntries]
    .filter((entry) => toNumber(entry.weight) !== null)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function latestBodyMetric(key) {
  const latest = [...state.bodyEntries]
    .filter((entry) => toNumber(entry[key]) !== null)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  return toNumber(latest?.[key]);
}

function currentWeight() {
  const latest = getLatestBodyEntry();
  return toNumber(latest?.weight) ?? toNumber(state.settings.fallbackWeight);
}

function referenceWeightForTargets() {
  const targetWeight = toNumber(state.settings.targetWeight);
  const weight = currentWeight();
  const height = toNumber(state.settings.height);
  if (targetWeight) return targetWeight;
  if (weight) return weight;
  if (height) return round(24 * (height / 100) ** 2, 1);
  return 80;
}

function bmrEstimate() {
  const { sex, age, height, activityFactor } = state.settings;
  const weight = currentWeight();
  const ageNumber = toNumber(age);
  const heightNumber = toNumber(height);
  if (!sex || !weight || !ageNumber || !heightNumber) return null;
  const base = 10 * weight + 6.25 * heightNumber - 5 * ageNumber + (sex === "male" ? 5 : -161);
  return {
    bmr: Math.round(base),
    tdee: Math.round(base * Number(activityFactor || 1.2))
  };
}

function baseTarget() {
  const estimate = bmrEstimate();
  if (estimate) {
    return Math.max(0, Math.round(estimate.tdee - Number(state.settings.deficit || 0)));
  }
  return toNumber(state.settings.manualTarget);
}

function bmiFor(weight) {
  const height = toNumber(state.settings.height);
  if (!weight || !height) return null;
  return weight / (height / 100) ** 2;
}

function entriesForDate(entries, date) {
  return entries.filter((entry) => entry.date === date);
}

function foodTotals(date) {
  return entriesForDate(state.foodEntries, date).reduce(
    (total, entry) => {
      const grams = toNumber(entry.grams) || 0;
      total.kcal += (grams * (toNumber(entry.kcal100) || 0)) / 100;
      total.protein += (grams * (toNumber(entry.protein100) || 0)) / 100;
      total.carbs += (grams * (toNumber(entry.carbs100) || 0)) / 100;
      total.fat += (grams * (toNumber(entry.fat100) || 0)) / 100;
      return total;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function exerciseTotals(date) {
  const total = entriesForDate(state.exerciseEntries, date).reduce(
    (sum, entry) => {
      sum.kcal += toNumber(entry.kcal) || 0;
      sum.minutes += toNumber(entry.minutes) || 0;
      return sum;
    },
    { kcal: 0, minutes: 0 }
  );
  total.credit = total.kcal * (Number(state.settings.exerciseCredit || 0) / 100);
  return total;
}

function daySummary(date) {
  const food = foodTotals(date);
  const exercise = exerciseTotals(date);
  const base = baseTarget();
  const budget = base === null ? null : base + exercise.credit;
  return {
    food,
    exercise,
    base,
    budget,
    balance: budget === null ? null : budget - food.kcal,
    net: food.kcal - exercise.credit
  };
}

function weekSummary(endDate = activeDate()) {
  const days = rangeDays(endDate, 7);
  return days.reduce(
    (summary, date) => {
      const day = daySummary(date);
      summary.food += day.food.kcal;
      summary.budget += day.budget || 0;
      summary.credit += day.exercise.credit;
      summary.minutes += day.exercise.minutes;
      return summary;
    },
    { food: 0, budget: 0, credit: 0, minutes: 0, days: days.length }
  );
}

function dailyTargets(date = activeDate()) {
  const summary = daySummary(date);
  const kcal = summary.budget ?? baseTarget();
  const referenceWeight = referenceWeightForTargets();
  const protein = referenceWeight * 1.2;
  const fat = kcal ? (kcal * 0.25) / 9 : null;
  const carbs = kcal && protein !== null && fat !== null ? Math.max(0, (kcal - protein * 4 - fat * 9) / 4) : null;
  return {
    kcal,
    protein,
    carbs,
    fat,
    weeklyKcal: kcal ? kcal * 7 : null,
    weeklyExerciseMinutes: 150
  };
}

function monthStart(dateText) {
  return `${dateText.slice(0, 7)}-01`;
}

function shiftMonth(dateText, offset) {
  const date = parseLocalDate(monthStart(dateText));
  date.setMonth(date.getMonth() + offset);
  return formatLocalDate(date);
}

function daysInMonth(dateText) {
  const date = parseLocalDate(monthStart(dateText));
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function monthLabel(dateText) {
  const date = parseLocalDate(monthStart(dateText));
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

function progressDegrees(used, target) {
  const usedValue = toNumber(used) ?? 0;
  const targetValue = toNumber(target);
  if (!targetValue) return 0;
  return Math.min(Math.max(usedValue / targetValue, 0), 1) * 360;
}

function hasDayRecord(date) {
  return (
    entriesForDate(state.foodEntries, date).length > 0 ||
    entriesForDate(state.bodyEntries, date).length > 0 ||
    entriesForDate(state.exerciseEntries, date).length > 0 ||
    state.supplementLogs.some((log) => log.date === date)
  );
}

function setActiveDate(date) {
  const activeInput = $("#activeDate");
  if (activeInput) activeInput.value = date;
  monthCursor = monthStart(date);
  setFormDates(date);
  renderAll();
}

function setGoalRing(cardId, used, target, options) {
  const card = $(`#${cardId}`);
  if (!card) return;
  const usedValue = toNumber(used) ?? 0;
  const targetValue = toNumber(target);
  const ratio = targetValue ? usedValue / targetValue : 0;
  const degrees = Math.min(Math.max(ratio, 0), 1) * 360;
  const color = ratio > 1.05 ? "var(--rose)" : ratio > 0.9 ? "var(--amber)" : "var(--teal)";
  card.style.setProperty("--goal-progress", `${degrees}deg`);
  card.style.setProperty("--goal-color", color);
  card.classList.toggle("is-over", Boolean(targetValue && ratio > 1.05));

  $(`#${options.percentId}`).textContent = targetValue ? `${Math.round(ratio * 100)}%` : "--";
  $(`#${options.usedId}`).textContent = options.format(usedValue);
  $(`#${options.targetId}`).textContent = targetValue ? options.format(targetValue) : "--";
}

function monthDayButton(date, dayNumber) {
  const summary = daySummary(date);
  const targets = dailyTargets(date);
  const moveTarget = Math.max(20, targets.weeklyExerciseMinutes / 7);
  const calories = progressDegrees(summary.food.kcal, targets.kcal);
  const protein = progressDegrees(summary.food.protein, targets.protein);
  const move = progressDegrees(summary.exercise.minutes, moveTarget);
  const button = document.createElement("button");
  const isSelected = date === activeDate();
  const isToday = date === todayISO();
  const isFuture = date > todayISO();
  const recorded = hasDayRecord(date);
  button.type = "button";
  button.className = [
    "month-day",
    isSelected ? "is-selected" : "",
    isToday ? "is-today" : "",
    isFuture ? "is-future" : "",
    recorded ? "has-record" : ""
  ]
    .filter(Boolean)
    .join(" ");
  button.dataset.date = date;
  button.title = `${date} · ${formatKcal(summary.food.kcal)} · 蛋白 ${round(summary.food.protein, 1)}g · 运动 ${Math.round(
    summary.exercise.minutes
  )}min`;
  button.style.setProperty("--cal-progress", `${calories}deg`);
  button.style.setProperty("--protein-progress", `${protein}deg`);
  button.style.setProperty("--move-progress", `${move}deg`);
  button.innerHTML = `
    <span class="day-rings" aria-hidden="true">
      <i class="month-ring month-ring-cal"></i>
      <i class="month-ring month-ring-protein"></i>
      <i class="month-ring month-ring-move"></i>
      <b>${dayNumber}</b>
    </span>
    <small>${recorded ? Math.round(summary.food.kcal) : ""}</small>
  `;
  return button;
}

function renderMonthRings() {
  const grid = $("#monthRingsGrid");
  const title = $("#monthRingsTitle");
  if (!grid || !title) return;
  if (!monthCursor) monthCursor = monthStart(activeDate());
  const cursor = monthStart(monthCursor);
  const firstDate = parseLocalDate(cursor);
  const totalDays = daysInMonth(cursor);
  const firstWeekday = (firstDate.getDay() + 6) % 7;
  title.textContent = monthLabel(cursor);
  grid.innerHTML = "";
  ["一", "二", "三", "四", "五", "六", "日"].forEach((label) => {
    const weekday = document.createElement("div");
    weekday.className = "month-weekday";
    weekday.textContent = label;
    grid.append(weekday);
  });
  for (let i = 0; i < firstWeekday; i += 1) {
    const placeholder = document.createElement("div");
    placeholder.className = "month-day-placeholder";
    grid.append(placeholder);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    const date = `${cursor.slice(0, 8)}${String(day).padStart(2, "0")}`;
    grid.append(monthDayButton(date, day));
  }
}

function renderGoalDashboard(date) {
  const summary = daySummary(date);
  const targets = dailyTargets(date);
  const week = weekSummary(date);
  const weeklyTarget = week.budget || targets.weeklyKcal;

  setGoalRing("goalCaloriesRing", summary.food.kcal, targets.kcal, {
    percentId: "goalCaloriesPercent",
    usedId: "goalCaloriesUsed",
    targetId: "goalCaloriesTarget",
    format: formatKcal
  });
  setGoalRing("goalProteinRing", summary.food.protein, targets.protein, {
    percentId: "goalProteinPercent",
    usedId: "goalProteinUsed",
    targetId: "goalProteinTarget",
    format: formatGram
  });
  setGoalRing("goalWeekRing", week.food, weeklyTarget, {
    percentId: "goalWeekPercent",
    usedId: "goalWeekUsed",
    targetId: "goalWeekTarget",
    format: formatKcal
  });

  $("#targetProtein").textContent = formatGram(targets.protein);
  $("#targetCarbs").textContent = formatGram(targets.carbs);
  $("#targetFat").textContent = formatGram(targets.fat);
  $("#targetExercise").textContent = `${Math.round(week.minutes)} / ${targets.weeklyExerciseMinutes} min`;
  $("#targetWeekDailyAvg").textContent = weeklyTarget ? formatKcal(weeklyTarget / week.days) : "--";
}

function weightTrend() {
  const sorted = [...state.bodyEntries]
    .filter((entry) => toNumber(entry.weight) !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length < 2) return null;
  const latest = sorted[sorted.length - 1];
  const earliest = sorted.find((entry) => daysBetween(entry.date, latest.date) >= 5) || sorted[0];
  if (earliest.id === latest.id) return null;
  const days = daysBetween(earliest.date, latest.date);
  const change = Number(latest.weight) - Number(earliest.weight);
  const weeklyRate = (change / Number(earliest.weight) / days) * 7 * 100;
  return { change, weeklyRate, days };
}

function initIcons(root = document) {
  $$(".icon[data-icon]", root).forEach((slot) => {
    const name = slot.dataset.icon;
    const path = ICONS[name] || ICONS.info;
    slot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  });
}

function createIcon(name) {
  const span = document.createElement("span");
  span.className = "icon";
  span.dataset.icon = name;
  initIcons(span);
  return span;
}

function setView(viewName) {
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === viewName));
  $$(".view").forEach((view) => view.classList.toggle("is-active", view.id === viewName));
  renderAll();
}

function fillFoodDatalist() {
  const list = $("#foodList");
  list.innerHTML = "";
  foodCatalog().forEach((food) => {
    const option = document.createElement("option");
    option.value = food.name;
    option.label = `${food.kcal100} kcal /100g`;
    list.append(option);
  });
}

function fillExerciseTypes() {
  const select = $("#exerciseForm select[name='type']");
  select.innerHTML = "";
  ACTIVITIES.forEach((activity) => {
    const option = document.createElement("option");
    option.value = activity.name;
    option.textContent = activity.name;
    select.append(option);
  });
}

function setFormDates(date) {
  $$("form input[name='date']").forEach((input) => {
    input.value = date;
  });
}

function formControl(form, name) {
  return form.elements.namedItem(name) || form.querySelector(`[name="${name}"]`);
}

function formValue(form, name) {
  return formControl(form, name)?.value ?? "";
}

function setFormValue(form, name, value) {
  const control = formControl(form, name);
  if (control) control.value = value ?? "";
}

function renderSettingsForm() {
  const form = $("#settingsForm");
  Object.entries(state.settings).forEach(([key, value]) => {
    setFormValue(form, key, value);
  });
}

function profileIsComplete() {
  const { sex, age, height } = state.settings;
  return Boolean(sex && toNumber(age) && toNumber(height) && currentWeight());
}

function renderProfileSummary() {
  const name = $("#profileName");
  const summary = $("#profileSummary");
  if (!name || !summary) return;
  const height = toNumber(state.settings.height);
  const targetWeight = toNumber(state.settings.targetWeight);
  const target = baseTarget();
  name.textContent = profileIsComplete() ? "我的档案" : "个人中心";
  const parts = [];
  if (height) parts.push(`${height}cm`);
  if (targetWeight) parts.push(`目标 ${targetWeight}kg`);
  if (target) parts.push(`${Math.round(target)} kcal`);
  summary.textContent = parts.length ? parts.join(" · ") : "未设置";
}

function openProfileCenter() {
  const modal = $("#profileModal");
  if (!modal) return;
  renderSettingsForm();
  const status = $("#settingsStatus");
  if (status) status.textContent = "";
  modal.hidden = false;
  $("#profileButton")?.setAttribute("aria-expanded", "true");
}

function closeProfileCenter() {
  const modal = $("#profileModal");
  if (!modal) return;
  modal.hidden = true;
  $("#profileButton")?.setAttribute("aria-expanded", "false");
}

function openCheckupModal() {
  const modal = $("#checkupModal");
  if (!modal) return;
  setFormValue($("#checkupForm"), "date", activeDate());
  modal.hidden = false;
}

function closeCheckupModal() {
  const modal = $("#checkupModal");
  if (!modal) return;
  modal.hidden = true;
}

function renderDashboard() {
  const date = activeDate();
  const summary = daySummary(date);
  $("#budgetTitle").textContent = formatKcal(summary.budget);
  $("#todayFoodKcal").textContent = formatKcal(summary.food.kcal);
  $("#todayExerciseKcal").textContent = formatKcal(summary.exercise.credit);
  $("#todayNetKcal").textContent = formatKcal(summary.net);
  $("#balanceValue").textContent = summary.balance === null ? "--" : Math.round(summary.balance);

  const ratio = summary.budget ? Math.min(summary.food.kcal / summary.budget, 1.2) : 0;
  $("#calorieMeter").style.width = `${Math.min(ratio * 100, 100)}%`;
  const ringDegrees = Math.min(ratio, 1) * 360;
  const ringColor = ratio > 1.05 ? "var(--rose)" : ratio > 0.9 ? "var(--amber)" : "var(--teal)";
  $("#balanceRing").style.setProperty("--balance-color", ringColor);
  $("#balanceRing").style.setProperty("--balance-progress", `${ringDegrees}deg`);

  const latestWeight = currentWeight();
  $("#latestWeight").textContent = latestWeight ? formatUnit(latestWeight, "kg", 1) : "--";
  $("#latestBmi").textContent = latestWeight ? formatUnit(bmiFor(latestWeight), "", 1).trim() : "--";
  const latestWaist = latestBodyMetric("waist");
  const latestGlucose = latestBodyMetric("fastingGlucose");
  $("#latestWaist").textContent = latestWaist ? formatUnit(latestWaist, "cm", 1) : "--";
  $("#latestGlucose").textContent = latestGlucose
    ? formatUnit(latestGlucose, "mmol/L", 1)
    : "--";

  renderGoalDashboard(date);
  renderMonthRings();
  renderSupplementDashboard(date);
  renderSuggestions(date);
  renderTodayTimeline(date);
}

function renderSuggestions(date) {
  const summary = daySummary(date);
  const latest = getLatestBodyEntry();
  const suggestions = [];
  const add = (type, title, text, icon = "info") => suggestions.push({ type, title, text, icon });

  if (!latest && !currentWeight()) {
    add("warn", "先补一条身体基线", "记录体重，或在个人中心填估算体重，后面的预算和趋势会更准。", "alert");
  }

  if (!bmrEstimate()) {
    add("warn", "目标正在用手动值", "在设置里补齐性别、年龄、身高和体重后，系统会用公式估算基础目标。", "calculator");
  }

  if (summary.food.kcal === 0) {
    add("info", "今天还没记饮食", "先从主食、肉蛋奶豆、烹调用油和饮品开始记，热量误差会小很多。", "utensils");
  } else if (summary.budget !== null) {
    if (summary.balance < -300) {
      add("alert", "今天已超过预算", "不用靠明天极端少吃来补，优先把下一餐拉回清淡、足量蛋白和蔬菜。", "alert");
    } else if (summary.balance > 500) {
      add("warn", "剩余热量偏多", "如果不是医生安排的低热量日，长期摄入过低可能影响坚持和训练恢复。", "alert");
    } else {
      add("info", "今天节奏比较稳", "运动抵扣已按设置比例计入预算，晚上按饥饿感小幅调整就好。", "check");
    }
  }

  const minIntake = toNumber(state.settings.minIntake);
  if (minIntake && summary.food.kcal > 0 && summary.food.kcal < minIntake) {
    add("warn", "低于最低摄入提醒", `你设置的提醒线是 ${minIntake} kcal；如果经常低于它，建议复核方案。`, "alert");
  }

  const trend = weightTrend();
  if (trend && trend.weeklyRate < -1) {
    add("warn", "体重下降偏快", "最近趋势超过每周体重 1% 的下降幅度，代谢异常人群更适合让医生确认节奏。", "alert");
  }

  if (latest) {
    const systolic = toNumber(latest.systolic);
    const diastolic = toNumber(latest.diastolic);
    const fastingGlucose = toNumber(latest.fastingGlucose);
    const uricAcid = toNumber(latest.uricAcid);
    const ldl = toNumber(latest.ldl);
    const alt = toNumber(latest.alt);
    if ((systolic && systolic >= 130) || (diastolic && diastolic >= 80)) {
      add("warn", "血压建议持续复测", "体检血压偏高时，减脂期适合把家庭血压也记进身体记录，方便看趋势。", "alert");
    }
    if (fastingGlucose && fastingGlucose >= 5.6) {
      add("warn", "血糖作为重点指标", "空腹血糖偏高时，优先盯住含糖饮料、精制主食份量和餐后活动。", "alert");
    }
    if (uricAcid && uricAcid > 420) {
      add("warn", "尿酸作为复查指标", "尿酸偏高时，记录饮水、酒精、海鲜/内脏等触发因素会更有用。", "alert");
    }
    if ((ldl && ldl >= 3.4) || (alt && alt > 50)) {
      add("warn", "血脂和肝功能要复查", "LDL 或 ALT 偏高时，减脂趋势、运动频率和复查时间可以一起跟踪。", "alert");
    }
  }

  const week = weekSummary(date);
  if (week.minutes > 0 && week.minutes < 150) {
    add("info", "本周运动还可以加一点", `最近 7 天记录了 ${Math.round(week.minutes)} 分钟活动；先把频率做稳。`, "bike");
  } else if (week.minutes >= 150) {
    add("info", "本周活动量不错", `最近 7 天记录了 ${Math.round(week.minutes)} 分钟活动，注意保留恢复日。`, "check");
  }

  const container = $("#suggestions");
  container.innerHTML = "";
  suggestions.slice(0, 4).forEach((item) => {
    const card = document.createElement("div");
    card.className = `suggestion ${item.type}`;
    const badge = document.createElement("div");
    badge.className = "badge";
    badge.append(createIcon(item.icon));
    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.title;
    const text = document.createElement("p");
    text.textContent = item.text;
    body.append(title, text);
    card.append(badge, body);
    container.append(card);
  });
}

function intensityLabel(value) {
  return { easy: "偏轻", normal: "正常", hard: "偏高" }[value] || "正常";
}

function exerciseDetail(entry, includeCredit = false) {
  const parts = [
    `${entry.minutes} min`,
    formatKcal(entry.kcal),
    `强度 ${intensityLabel(entry.intensity)}`,
    entry.heartRate ? `心率 ${entry.heartRate} bpm` : "",
    includeCredit ? `计入 ${formatKcal(entry.kcal * (Number(state.settings.exerciseCredit || 0) / 100))}` : "",
    entry.notes || ""
  ].filter(Boolean);
  return parts.join(" · ");
}

function renderTodayTimeline(date) {
  const container = $("#todayTimeline");
  container.innerHTML = "";
  const bodyEntries = entriesForDate(state.bodyEntries, date).map((entry) => {
    const parts = [
      entry.weight ? `体重 ${entry.weight}kg` : "",
      entry.sleep ? `睡眠 ${entry.sleep}h` : "",
      entry.medication ? `用药 ${entry.medication}` : "",
      entry.notes || ""
    ].filter(Boolean);
    return {
      type: "body",
      id: entry.id,
      title: "每日记录",
      detail: parts.length ? parts.join(" · ") : "已保存当天记录"
    };
  });
  const foods = entriesForDate(state.foodEntries, date).map((entry) => ({
    type: "food",
    id: entry.id,
    title: `${entry.meal} · ${entry.foodName}`,
    detail: `${entry.grams} g · ${formatKcal((entry.grams * entry.kcal100) / 100)}${entry.notes ? ` · ${entry.notes}` : ""}`
  }));
  const exercises = entriesForDate(state.exerciseEntries, date).map((entry) => ({
    type: "exercise",
    id: entry.id,
    title: `运动 · ${entry.type}`,
    detail: exerciseDetail(entry)
  }));

  const items = [...bodyEntries, ...foods, ...exercises];
  if (!items.length) {
    container.append(emptyState("今天还没有明细。"));
    return;
  }
  items.forEach((item) => container.append(entryNode(item.title, item.detail, item.type, item.id)));
}

function isWorkoutDay(date) {
  return state.supplementWorkoutDates.includes(date) || entriesForDate(state.exerciseEntries, date).length > 0;
}

function supplementItemsForDate(date) {
  const workout = isWorkoutDay(date);
  return state.supplementItems
    .filter((item) => item.active && (item.cadence === "daily" || (item.cadence === "workout" && workout)))
    .sort((a, b) => `${a.time || "99:99"}-${a.name}`.localeCompare(`${b.time || "99:99"}-${b.name}`, "zh-CN"));
}

function supplementLog(date, itemId) {
  return state.supplementLogs.find((log) => log.date === date && log.itemId === itemId);
}

function supplementTaken(date, itemId) {
  return Boolean(supplementLog(date, itemId)?.taken);
}

function supplementSummary(date) {
  const items = supplementItemsForDate(date);
  const taken = items.filter((item) => supplementTaken(date, item.id)).length;
  return { items, taken, total: items.length };
}

function setSupplementTaken(date, itemId, taken) {
  state.supplementLogs = state.supplementLogs.filter((log) => !(log.date === date && log.itemId === itemId));
  if (taken) {
    state.supplementLogs.push({
      id: newId("supp-log"),
      date,
      itemId,
      taken: true,
      takenAt: new Date().toISOString()
    });
  }
  saveState();
  renderAll();
}

function cadenceLabel(value) {
  return value === "workout" ? "训练日" : "每天";
}

function categoryLabel(value) {
  return value === "medicine" ? "药物" : "补剂";
}

function supplementDetail(item) {
  return [item.time, item.timing, item.dose, cadenceLabel(item.cadence), item.notes].filter(Boolean).join(" · ");
}

function supplementItemNode(item, date, compact = false) {
  const label = document.createElement("label");
  label.className = `supplement-check${compact ? " is-compact" : ""}`;
  if (supplementTaken(date, item.id)) label.classList.add("is-done");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = supplementTaken(date, item.id);
  checkbox.dataset.supplementId = item.id;
  checkbox.dataset.date = date;

  const body = document.createElement("span");
  body.className = "supplement-check-body";
  const title = document.createElement("strong");
  title.textContent = item.name;
  const detail = document.createElement("small");
  detail.textContent = supplementDetail(item);
  body.append(title, detail);
  label.append(checkbox, body);
  return label;
}

function renderSupplementChecklist(containerId, date, compact = false) {
  const container = $(`#${containerId}`);
  if (!container) return;
  container.innerHTML = "";
  const summary = supplementSummary(date);
  if (!summary.items.length) {
    container.append(emptyState(isWorkoutDay(date) ? "今天没有启用的补剂计划。" : "今天没有训练日项目；每日补剂可在计划里启用。"));
    return;
  }
  summary.items.forEach((item) => container.append(supplementItemNode(item, date, compact)));
}

function renderSupplementDashboard(date) {
  const title = $("#supplementSummaryTitle");
  const text = $("#supplementSummaryText");
  const meter = $("#supplementMeter");
  if (!title || !text || !meter) return;
  const summary = supplementSummary(date);
  const ratio = summary.total ? summary.taken / summary.total : 0;
  title.textContent = summary.total ? `${summary.taken}/${summary.total} 已完成` : "暂无计划";
  text.textContent = summary.total
    ? `${summary.taken} 项已打勾，${Math.max(0, summary.total - summary.taken)} 项待完成`
    : "到补剂页启用或新增计划";
  meter.style.width = `${Math.round(ratio * 100)}%`;
  renderSupplementChecklist("dashboardSupplementList", date, true);
}

function renderReminderStatus() {
  const status = $("#supplementReminderStatus");
  const button = $("#toggleSupplementReminders");
  if (!status || !button) return;
  const buttonText = $("span:last-child", button);
  if (!("Notification" in window)) {
    status.textContent = "当前浏览器不支持系统提醒，可以继续用打勾记录。";
    status.dataset.tone = "error";
    if (buttonText) buttonText.textContent = "不支持提醒";
    button.disabled = true;
    return;
  }
  button.disabled = false;
  if (Notification.permission === "denied") {
    status.textContent = "提醒权限已被浏览器拒绝，需要在浏览器设置里重新允许。";
    status.dataset.tone = "error";
    if (buttonText) buttonText.textContent = "提醒被拒绝";
    return;
  }
  if (state.settings.supplementNotifications && Notification.permission === "granted") {
    status.textContent = "提醒已开启；页面打开时，到点会弹浏览器提醒。";
    status.dataset.tone = "";
    if (buttonText) buttonText.textContent = "关闭提醒";
    return;
  }
  status.textContent = "提醒未开启；打勾记录不受影响。";
  status.dataset.tone = "";
  if (buttonText) buttonText.textContent = "开启提醒";
}

function renderSupplementsView() {
  const date = activeDate();
  const title = $("#supplementDayTitle");
  const workoutButton = $("#toggleWorkoutDay");
  if (!title || !workoutButton) return;
  const summary = supplementSummary(date);
  title.textContent = `${date} · ${summary.taken}/${summary.total}`;
  workoutButton.classList.toggle("is-active", isWorkoutDay(date));
  const workoutText = $("span:last-child", workoutButton);
  if (workoutText) workoutText.textContent = isWorkoutDay(date) ? "今天训练中" : "今天训练";
  renderReminderStatus();
  renderSupplementChecklist("todaySupplementList", date);
  renderSupplementPlanList();
}

function renderSupplementPlanList() {
  const container = $("#supplementPlanList");
  if (!container) return;
  container.innerHTML = "";
  if (!state.supplementItems.length) {
    container.append(emptyState("还没有补剂计划，可以先恢复默认或新增一项。"));
    return;
  }
  const sorted = [...state.supplementItems].sort((a, b) => `${a.time || "99:99"}-${a.name}`.localeCompare(`${b.time || "99:99"}-${b.name}`, "zh-CN"));
  sorted.forEach((item) => {
    const card = document.createElement("article");
    card.className = `supplement-plan-card${item.active ? "" : " is-paused"}`;
    const body = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.name;
    const detail = document.createElement("p");
    detail.textContent = `${categoryLabel(item.category)} · ${supplementDetail(item)}${item.reminder ? "" : " · 不提醒"}`;
    body.append(title, detail);

    const actions = document.createElement("div");
    actions.className = "supplement-plan-actions";
    const edit = document.createElement("button");
    edit.className = "ghost-button";
    edit.type = "button";
    edit.dataset.supplementAction = "edit";
    edit.dataset.id = item.id;
    edit.textContent = "编辑";
    const toggle = document.createElement("button");
    toggle.className = item.active ? "secondary-button" : "ghost-button";
    toggle.type = "button";
    toggle.dataset.supplementAction = "toggle-active";
    toggle.dataset.id = item.id;
    toggle.textContent = item.active ? "暂停" : "启用";
    const remove = document.createElement("button");
    remove.className = "danger-button";
    remove.type = "button";
    remove.dataset.supplementAction = "remove";
    remove.dataset.id = item.id;
    remove.textContent = "删除";
    actions.append(edit, toggle, remove);
    card.append(body, actions);
    container.append(card);
  });
}

function resetSupplementForm() {
  const form = $("#supplementForm");
  if (!form) return;
  form.reset();
  setFormValue(form, "id", "");
  setFormValue(form, "time", "08:30");
  setFormValue(form, "category", "supplement");
  setFormValue(form, "cadence", "daily");
  setFormValue(form, "active", "true");
  setFormValue(form, "reminder", "true");
}

function fillSupplementForm(item) {
  const form = $("#supplementForm");
  if (!form || !item) return;
  ["id", "name", "dose", "time", "timing", "category", "cadence", "notes"].forEach((key) => setFormValue(form, key, item[key] || ""));
  setFormValue(form, "active", String(item.active !== false));
  setFormValue(form, "reminder", String(item.reminder !== false));
}

function supplementFromForm(form) {
  return {
    id: formValue(form, "id") || newId("supp"),
    category: formValue(form, "category") === "medicine" ? "medicine" : "supplement",
    name: formValue(form, "name").trim(),
    dose: formValue(form, "dose").trim(),
    time: formValue(form, "time") || "08:30",
    timing: formValue(form, "timing").trim(),
    cadence: formValue(form, "cadence") === "workout" ? "workout" : "daily",
    active: formValue(form, "active") !== "false",
    reminder: formValue(form, "reminder") !== "false",
    notes: formValue(form, "notes").trim()
  };
}

function handleSupplementSubmit(event) {
  event.preventDefault();
  const item = supplementFromForm(event.currentTarget);
  if (!item.name) return;
  const exists = state.supplementItems.some((current) => current.id === item.id);
  state.supplementItems = exists
    ? state.supplementItems.map((current) => (current.id === item.id ? item : current))
    : [...state.supplementItems, item];
  saveState();
  resetSupplementForm();
  renderAll();
}

function toggleWorkoutDay() {
  const date = activeDate();
  const exists = state.supplementWorkoutDates.includes(date);
  state.supplementWorkoutDates = exists
    ? state.supplementWorkoutDates.filter((item) => item !== date)
    : [...state.supplementWorkoutDates, date];
  saveState();
  renderAll();
}

function handleSupplementListChange(event) {
  const input = event.target.closest("input[type='checkbox'][data-supplement-id]");
  if (!input) return;
  setSupplementTaken(input.dataset.date, input.dataset.supplementId, input.checked);
}

function handleSupplementPlanClick(event) {
  const button = event.target.closest("[data-supplement-action]");
  if (!button) return;
  const item = state.supplementItems.find((current) => current.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.supplementAction === "edit") {
    fillSupplementForm(item);
    return;
  }
  if (button.dataset.supplementAction === "toggle-active") {
    item.active = !item.active;
    saveState();
    renderAll();
    return;
  }
  if (button.dataset.supplementAction === "remove") {
    if (!confirm(`删除「${item.name}」的提醒计划？已打勾历史也会移除。`)) return;
    state.supplementItems = state.supplementItems.filter((current) => current.id !== item.id);
    state.supplementLogs = state.supplementLogs.filter((log) => log.itemId !== item.id);
    saveState();
    renderAll();
  }
}

async function toggleSupplementReminders() {
  if (!("Notification" in window)) {
    renderReminderStatus();
    return;
  }
  if (state.settings.supplementNotifications && Notification.permission === "granted") {
    state.settings.supplementNotifications = false;
    saveState();
    renderReminderStatus();
    return;
  }
  const permission = Notification.permission === "granted" ? "granted" : await Notification.requestPermission();
  state.settings.supplementNotifications = permission === "granted";
  saveState();
  renderReminderStatus();
  checkSupplementReminders();
}

function minutesOfDay(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

function timeToMinutes(timeText) {
  const [hour, minute] = String(timeText || "00:00").split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
}

function checkSupplementReminders() {
  if (!state.settings.supplementNotifications || !("Notification" in window) || Notification.permission !== "granted") return;
  const date = todayISO();
  const nowMinutes = minutesOfDay();
  supplementItemsForDate(date).forEach((item) => {
    if (!item.reminder || supplementTaken(date, item.id)) return;
    const dueMinutes = timeToMinutes(item.time);
    if (dueMinutes === null) return;
    const diff = nowMinutes - dueMinutes;
    const sentKey = `${date}-${item.id}`;
    if (diff < 0 || diff > 30 || supplementReminderSent.has(sentKey)) return;
    supplementReminderSent.add(sentKey);
    new Notification("补剂提醒", {
      body: `${item.name} ${item.dose || ""} · ${item.timing || item.time}`.trim(),
      tag: sentKey
    });
    const status = $("#supplementReminderStatus");
    if (status) status.textContent = `刚提醒：${item.name}`;
  });
}

function startSupplementReminderLoop() {
  clearInterval(supplementReminderTimer);
  supplementReminderTimer = setInterval(checkSupplementReminders, 60000);
  checkSupplementReminders();
}

function restoreDefaultSupplements() {
  if (!confirm("恢复默认补剂计划？当前自定义计划会被替换，但饮食、运动和身体记录不会受影响。")) return;
  state.supplementItems = structuredClone(DEFAULT_SUPPLEMENTS);
  state.supplementLogs = [];
  state.supplementWorkoutDates = [];
  saveState();
  resetSupplementForm();
  renderAll();
}

function renderFoodView() {
  const date = activeDate();
  const totals = foodTotals(date);
  const targets = dailyTargets(date);
  $("#foodDayTitle").textContent = date;
  $("#foodTotalKcal").textContent = formatKcalPair(totals.kcal, targets.kcal);
  $("#foodTotalProtein").textContent = formatGramPair(totals.protein, targets.protein);
  $("#foodTotalCarbs").textContent = formatGramPair(totals.carbs, targets.carbs);
  $("#foodTotalFat").textContent = formatGramPair(totals.fat, targets.fat);

  const container = $("#foodEntries");
  container.innerHTML = "";
  const entries = entriesForDate(state.foodEntries, date).sort((a, b) => a.meal.localeCompare(b.meal, "zh-CN"));
  if (!entries.length) {
    container.append(emptyState("当天还没有饮食记录。"));
    return;
  }
  entries.forEach((entry) => {
    const kcal = (entry.grams * entry.kcal100) / 100;
    const macros = `蛋白 ${round((entry.grams * (entry.protein100 || 0)) / 100, 1)}g · 碳水 ${round(
      (entry.grams * (entry.carbs100 || 0)) / 100,
      1
    )}g · 脂肪 ${round((entry.grams * (entry.fat100 || 0)) / 100, 1)}g`;
    container.append(
      entryNode(
        `${entry.meal} · ${entry.foodName}`,
        `${entry.grams} g · ${formatKcal(kcal)} · ${macros}${entry.notes ? ` · ${entry.notes}` : ""}`,
        "food",
        entry.id
      )
    );
  });
}

function renderBodyView() {
  const container = $("#bodyEntries");
  container.innerHTML = "";
  const entries = [...state.bodyEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);
  if (!entries.length) {
    container.append(emptyState("还没有身体记录。"));
    return;
  }
  entries.forEach((entry) => {
    const parts = [
      entry.weight ? `体重 ${entry.weight}kg` : "",
      entry.waist ? `腰围 ${entry.waist}cm` : "",
      entry.systolic && entry.diastolic ? `血压 ${entry.systolic}/${entry.diastolic}` : "",
      entry.fastingGlucose ? `空腹血糖 ${entry.fastingGlucose}mmol/L` : "",
      entry.postMealGlucose ? `餐后血糖 ${entry.postMealGlucose}mmol/L` : "",
      entry.sleep ? `睡眠 ${entry.sleep}h` : "",
      entry.medication ? `用药 ${entry.medication}` : "",
      entry.bodyFat ? `体脂 ${entry.bodyFat}%` : "",
      entry.muscleMass ? `肌肉量 ${entry.muscleMass}kg` : "",
      entry.hba1c ? `HbA1c ${entry.hba1c}%` : "",
      entry.uricAcid ? `尿酸 ${entry.uricAcid}umol/L` : "",
      entry.totalCholesterol ? `总胆固醇 ${entry.totalCholesterol}mmol/L` : "",
      entry.ldl ? `LDL ${entry.ldl}mmol/L` : "",
      entry.alt ? `ALT ${entry.alt}U/L` : "",
      entry.creatinine ? `肌酐 ${entry.creatinine}umol/L` : "",
      entry.notes || ""
    ].filter(Boolean);
    container.append(entryNode(entry.date, parts.join(" · "), "body", entry.id));
  });
}

function renderExerciseView() {
  const date = activeDate();
  const total = exerciseTotals(date);
  $("#exerciseDayTitle").textContent = date;
  $("#exerciseTotalKcal").textContent = formatKcal(total.kcal);
  $("#exerciseCreditKcal").textContent = formatKcal(total.credit);

  const container = $("#exerciseEntries");
  container.innerHTML = "";
  const entries = entriesForDate(state.exerciseEntries, date);
  if (!entries.length) {
    container.append(emptyState("当天还没有运动记录。"));
    return;
  }
  entries.forEach((entry) => {
    container.append(
      entryNode(
        entry.type,
        exerciseDetail(entry, true),
        "exercise",
        entry.id
      )
    );
  });
}

function renderTrendStats() {
  const week = weekSummary(activeDate());
  $("#weekAvgFood").textContent = formatKcal(week.food / week.days);
  $("#weekMinutes").textContent = `${Math.round(week.minutes)} min`;
  $("#weekCredit").textContent = formatKcal(week.credit);
  $("#weekBalance").textContent = formatKcal(week.budget - week.food);
}

function emptyState(text) {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.textContent = text;
  return div;
}

function entryNode(title, detail, type, id) {
  const node = $("#entryTemplate").content.firstElementChild.cloneNode(true);
  $("strong", node).textContent = title;
  $("p", node).textContent = detail;
  const button = $(".delete-button", node);
  button.dataset.type = type;
  button.dataset.id = id;
  initIcons(node);
  return node;
}

function deleteEntry(type, id) {
  const key = `${type}Entries`;
  state[key] = state[key].filter((entry) => entry.id !== id);
  saveState();
  renderAll();
}

function estimateExerciseKcal() {
  const form = $("#exerciseForm");
  const activity = ACTIVITIES.find((item) => item.name === formValue(form, "type"));
  const minutes = toNumber(formValue(form, "minutes"));
  const weight = currentWeight();
  if (!activity || !minutes || !weight) return null;
  const intensityMap = { easy: 0.82, normal: 1, hard: 1.18 };
  const met = activity.met * intensityMap[formValue(form, "intensity")];
  return Math.round(((met * 3.5 * weight) / 200) * minutes);
}

function rememberCustomFood(entry) {
  const exists = BUILTIN_FOODS.some((food) => food.name === entry.foodName) || state.customFoods.some((food) => food.name === entry.foodName);
  if (exists) return;
  state.customFoods.push({
    name: entry.foodName,
    kcal100: entry.kcal100,
    protein100: entry.protein100,
    carbs100: entry.carbs100,
    fat100: entry.fat100
  });
}

function readFormNumber(form, name) {
  return toNumber(formValue(form, name)) ?? "";
}

function persistFoodEntry(entry) {
  state.foodEntries.push(entry);
  rememberCustomFood(entry);
  saveState();
}

function setFoodAiStatus(text, tone = "") {
  const status = $("#foodAiStatus");
  if (!status) return;
  status.textContent = text;
  status.dataset.tone = tone;
}

function setFoodPhotoControls() {
  const preview = $("#foodPhotoPreview");
  const recognizeButton = $("#recognizeFoodPhoto");
  const clearButton = $("#clearFoodPhoto");
  if (preview) preview.hidden = !foodPhotoDataUrl;
  if (recognizeButton) recognizeButton.disabled = !foodPhotoDataUrl;
  if (clearButton) clearButton.hidden = !foodPhotoDataUrl;
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("照片读取失败，请重新选择。"));
    reader.onload = () => {
      const originalDataUrl = String(reader.result || "");
      const originalMime = dataUrlMime(originalDataUrl);
      const image = new Image();
      image.onload = () => {
        const maxSide = 1280;
        const longestSide = Math.max(image.width, image.height);
        const scale = longestSide > maxSide ? maxSide / longestSide : 1;
        if (!image.width || !image.height) {
          resolve(originalDataUrl);
          return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(originalDataUrl);
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => {
        if (["image/heic", "image/heif"].includes(originalMime)) {
          reject(new Error("当前照片是 HEIC/HEIF，网页无法直接转换。请在 iPhone 设置-相机-格式里选择“兼容性最佳”，或从相册导出 JPG 后再试。"));
          return;
        }
        resolve(originalDataUrl);
      };
      image.src = originalDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

function dataUrlMime(dataUrl) {
  return String(dataUrl || "").match(/^data:([^;]+);/i)?.[1]?.toLowerCase() || "";
}

function supportedAiImageMime(dataUrl) {
  return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(dataUrlMime(dataUrl));
}

async function handleFoodPhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setFoodAiStatus("请选择一张食物照片。", "error");
    return;
  }
  setFoodAiStatus("正在压缩照片...");
  try {
    foodPhotoDataUrl = await readImageAsDataUrl(file);
    foodAiDrafts = [];
    const preview = $("#foodPhotoPreview");
    if (preview) preview.src = foodPhotoDataUrl;
    setFoodPhotoControls();
    renderFoodAiDrafts();
    setFoodAiStatus("照片已准备好，可以让 AI 生成草稿。");
  } catch (error) {
    foodPhotoDataUrl = "";
    setFoodPhotoControls();
    setFoodAiStatus(error.message || "照片读取失败，请重新选择。", "error");
  }
}

function clearFoodPhoto() {
  foodPhotoDataUrl = "";
  foodAiDrafts = [];
  const input = $("#foodPhotoInput");
  const preview = $("#foodPhotoPreview");
  if (input) input.value = "";
  if (preview) {
    preview.removeAttribute("src");
    preview.hidden = true;
  }
  setFoodPhotoControls();
  renderFoodAiDrafts();
  setFoodAiStatus("");
}

function numberFromAi(value, fallback = 0) {
  const number = toNumber(value);
  return number === null ? fallback : Math.max(0, number);
}

function normalizeAiMeal(value) {
  const meals = ["早餐", "午餐", "晚餐", "加餐", "饮品"];
  const text = String(value || "").trim();
  if (meals.includes(text)) return text;
  return formValue($("#foodForm"), "meal") || "午餐";
}

function normalizeAiFoodItem(item) {
  if (!item || typeof item !== "object") return null;
  const foodName = String(item.foodName || item.name || item.food || "").trim();
  if (!foodName) return null;
  const grams = numberFromAi(item.grams ?? item.weightGrams ?? item.weight_g, 100);
  const totalKcal = toNumber(item.kcal ?? item.calories ?? item.totalKcal);
  const kcal100 =
    toNumber(item.kcal100 ?? item.caloriesPer100g ?? item.kcal_per_100g) ?? (totalKcal && grams ? (totalKcal / grams) * 100 : 0);
  return {
    id: newId("draft"),
    meal: normalizeAiMeal(item.meal),
    foodName,
    grams: round(grams, 0),
    kcal100: round(Math.max(0, kcal100), 0),
    protein100: round(numberFromAi(item.protein100 ?? item.proteinPer100g ?? item.protein_per_100g), 1),
    carbs100: round(numberFromAi(item.carbs100 ?? item.carbsPer100g ?? item.carbs_per_100g), 1),
    fat100: round(numberFromAi(item.fat100 ?? item.fatPer100g ?? item.fat_per_100g), 1),
    notes: String(item.notes || item.note || "AI估算").trim()
  };
}

function draftInput(labelText, name, value, options = {}) {
  const label = document.createElement("label");
  label.className = "field";
  const span = document.createElement("span");
  span.textContent = labelText;
  const input = document.createElement("input");
  input.name = name;
  input.value = value ?? "";
  Object.entries(options).forEach(([key, optionValue]) => input.setAttribute(key, optionValue));
  label.append(span, input);
  return label;
}

function draftMealSelect(value) {
  const label = document.createElement("label");
  label.className = "field";
  const span = document.createElement("span");
  span.textContent = "餐次";
  const select = document.createElement("select");
  select.name = "meal";
  ["早餐", "午餐", "晚餐", "加餐", "饮品"].forEach((meal) => {
    const option = document.createElement("option");
    option.value = meal;
    option.textContent = meal;
    option.selected = meal === value;
    select.append(option);
  });
  label.append(span, select);
  return label;
}

function draftEntryFromCard(card) {
  const value = (name) => card.querySelector(`[name="${name}"]`)?.value ?? "";
  const entry = {
    id: newId("food"),
    date: activeDate(),
    meal: normalizeAiMeal(value("meal")),
    foodName: value("foodName").trim(),
    grams: numberFromAi(value("grams"), 0),
    kcal100: numberFromAi(value("kcal100"), 0),
    protein100: numberFromAi(value("protein100"), 0),
    carbs100: numberFromAi(value("carbs100"), 0),
    fat100: numberFromAi(value("fat100"), 0),
    notes: value("notes").trim()
  };
  if (!entry.foodName || entry.grams <= 0) return null;
  return entry;
}

function renderFoodAiDrafts() {
  const container = $("#foodAiDrafts");
  if (!container) return;
  container.innerHTML = "";
  if (!foodAiDrafts.length) return;

  const toolbar = document.createElement("div");
  toolbar.className = "ai-draft-toolbar";
  const summary = document.createElement("strong");
  summary.textContent = `识别到 ${foodAiDrafts.length} 项，请确认后加入`;
  const addAll = document.createElement("button");
  addAll.className = "secondary-button";
  addAll.type = "button";
  addAll.dataset.aiAction = "add-all";
  addAll.textContent = "全部加入";
  toolbar.append(summary, addAll);
  container.append(toolbar);

  foodAiDrafts.forEach((draft, index) => {
    const card = document.createElement("article");
    card.className = "ai-draft-card";
    card.dataset.draftIndex = String(index);

    const head = document.createElement("div");
    head.className = "ai-draft-head";
    const title = document.createElement("strong");
    title.textContent = draft.foodName;
    const estimate = document.createElement("span");
    estimate.textContent = `${draft.grams}g 约 ${formatKcal((draft.grams * draft.kcal100) / 100)}`;
    head.append(title, estimate);

    const fields = document.createElement("div");
    fields.className = "ai-draft-fields";
    fields.append(
      draftMealSelect(draft.meal),
      draftInput("食物", "foodName", draft.foodName),
      draftInput("重量 g", "grams", draft.grams, { type: "number", min: "1", step: "1" }),
      draftInput("热量 /100g", "kcal100", draft.kcal100, { type: "number", min: "0", step: "1" }),
      draftInput("蛋白 /100g", "protein100", draft.protein100, { type: "number", min: "0", step: "0.1" }),
      draftInput("碳水 /100g", "carbs100", draft.carbs100, { type: "number", min: "0", step: "0.1" }),
      draftInput("脂肪 /100g", "fat100", draft.fat100, { type: "number", min: "0", step: "0.1" }),
      draftInput("备注", "notes", draft.notes)
    );

    const actions = document.createElement("div");
    actions.className = "ai-draft-actions";
    const add = document.createElement("button");
    add.className = "primary-button";
    add.type = "button";
    add.dataset.aiAction = "add";
    add.textContent = "加入";
    const remove = document.createElement("button");
    remove.className = "ghost-button";
    remove.type = "button";
    remove.dataset.aiAction = "remove";
    remove.textContent = "丢弃";
    actions.append(add, remove);

    card.append(head, fields, actions);
    container.append(card);
  });
}

function addAiDraftCard(card) {
  const entry = draftEntryFromCard(card);
  if (!entry) {
    setFoodAiStatus("请先补全食物名称和重量。", "error");
    return;
  }
  persistFoodEntry(entry);
  const index = Number(card.dataset.draftIndex);
  foodAiDrafts.splice(index, 1);
  fillFoodDatalist();
  renderFoodAiDrafts();
  renderAll();
  setFoodAiStatus("已加入饮食记录，热量仍按估算值显示。");
}

function addAllAiDraftCards() {
  const cards = $$(".ai-draft-card", $("#foodAiDrafts"));
  const entries = cards.map(draftEntryFromCard).filter(Boolean);
  if (!entries.length) {
    setFoodAiStatus("请先补全至少一项食物名称和重量。", "error");
    return;
  }
  entries.forEach(persistFoodEntry);
  foodAiDrafts = [];
  fillFoodDatalist();
  renderFoodAiDrafts();
  renderAll();
  setFoodAiStatus(`已加入 ${entries.length} 项饮食记录，记得按实际份量微调。`);
}

function handleFoodAiDraftClick(event) {
  const button = event.target.closest("[data-ai-action]");
  if (!button) return;
  const action = button.dataset.aiAction;
  if (action === "add-all") {
    addAllAiDraftCards();
    return;
  }
  const card = button.closest(".ai-draft-card");
  if (!card) return;
  if (action === "add") {
    addAiDraftCard(card);
    return;
  }
  if (action === "remove") {
    const index = Number(card.dataset.draftIndex);
    foodAiDrafts.splice(index, 1);
    renderFoodAiDrafts();
    setFoodAiStatus(foodAiDrafts.length ? "已丢弃该项。" : "");
  }
}

function foodApiErrorMessage(data, status) {
  const code = String(data.code || "");
  const base = String(data.error || data.message || `识别失败：${status}`).trim();
  const detail = String(data.detail || "").trim();
  if (code === "missing_openai_api_key") {
    return "AI 识别还没配置服务端 Key：请在阿里云函数环境变量添加 OPENAI_API_KEY 或 DASHSCOPE_API_KEY 后重启函数。";
  }
  if (code === "invalid_openai_model") {
    return "AI 模型名还是占位值：请删除 OPENAI_MODEL，或改成真实可用的视觉模型。";
  }
  if (code === "openai_timeout") {
    return "AI 服务超时：请稍后重试，或把 OPENAI_MODEL 换成更快的视觉模型。";
  }
  if (code === "openai_network_error") {
    return "AI 服务网络连接失败：请检查阿里云函数是否能访问 OPENAI_BASE_URL。";
  }
  if (code === "openai_api_error" && detail) {
    return `${base}（${detail}）`;
  }
  return detail ? `${base}（${detail}）` : base;
}

function foodAiEndpoint() {
  return (state.settings.aiFoodEndpoint || DEFAULT_STATE.settings.aiFoodEndpoint).trim();
}

function foodAiStatusMessage(data) {
  if (!data || typeof data !== "object") return "接口返回不是有效 JSON。";
  const lines = [
    `前端版本：${APP_VERSION}`,
    `接口版本：${data.version || "未知，可能还没部署新版"}`,
    `Key：${data.hasApiKey ? "已配置" : "未配置"}`,
    `服务：${data.provider || "--"}`,
    data.provider === "dashscope" ? `百炼地域：${data.dashScopeRegion || "--"}` : "",
    data.provider === "dashscope" ? `业务空间：${data.dashScopeWorkspace || "--"}` : "",
    `模型：${data.model || "--"}`,
    `地址：${data.baseUrlHost || "--"}`,
    `模式：${data.apiStyle || "--"}`
  ].filter(Boolean);
  if (Array.isArray(data.hints) && data.hints.length) lines.push(`提示：${data.hints.join("；")}`);
  return lines.join("｜");
}

async function runFoodAiSelfTest() {
  const endpoint = foodAiEndpoint();
  if (!endpoint) {
    setFoodAiStatus("请先在个人中心填写 AI 识别接口。", "error");
    return;
  }
  if (window.location.protocol === "file:" && endpoint.startsWith("/")) {
    setFoodAiStatus("当前是 file:// 打开，接口自检需要通过 localhost 或上线后的地址访问。", "error");
    return;
  }
  const separator = endpoint.includes("?") ? "&" : "?";
  setFoodAiStatus("正在自检 AI 接口...");
  try {
    const response = await fetch(`${endpoint}${separator}check=${Date.now()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(foodApiErrorMessage(data, response.status));
    setFoodAiStatus(foodAiStatusMessage(data), data.ok ? "" : "error");
  } catch (error) {
    setFoodAiStatus(error.message || "接口自检失败，请确认部署包已更新且接口路径为 /api/recognize-food。", "error");
  }
}

async function recognizeFoodPhoto() {
  const endpoint = foodAiEndpoint();
  if (!foodPhotoDataUrl) {
    setFoodAiStatus("请先拍照或上传食物照片。", "error");
    return;
  }
  if (!supportedAiImageMime(foodPhotoDataUrl)) {
    setFoodAiStatus("照片格式暂不支持。请使用 JPG、PNG 或 WebP；iPhone 建议把相机格式设为“兼容性最佳”。", "error");
    return;
  }
  if (!endpoint) {
    setFoodAiStatus("请先在个人中心填写 AI 识别接口。", "error");
    return;
  }
  if (window.location.protocol === "file:" && endpoint.startsWith("/")) {
    setFoodAiStatus("当前是 file:// 打开，AI 识别需要通过 localhost 或上线后的地址访问。", "error");
    return;
  }

  const button = $("#recognizeFoodPhoto");
  if (button) button.disabled = true;
  setFoodAiStatus("AI 正在识别照片，结果出来后请再确认份量。");

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 58000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        image: foodPhotoDataUrl,
        imageDataUrl: foodPhotoDataUrl,
        date: activeDate(),
        meal: formValue($("#foodForm"), "meal")
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(foodApiErrorMessage(data, response.status));

    const items = Array.isArray(data.items) ? data.items : Array.isArray(data.foods) ? data.foods : [];
    foodAiDrafts = items.map(normalizeAiFoodItem).filter(Boolean);
    renderFoodAiDrafts();
    if (!foodAiDrafts.length) {
      setFoodAiStatus("没有识别到可记录的食物，请换一张更清晰的照片或手动记录。", "error");
      return;
    }
    setFoodAiStatus("已生成可编辑草稿，确认后再加入当天饮食。");
  } catch (error) {
    const message =
      error.name === "AbortError" ? "AI 识别请求超时，请稍后重试或换用更快的模型。" : error.message || "AI 识别失败，请稍后重试。";
    setFoodAiStatus(message, "error");
  } finally {
    window.clearTimeout(timeoutId);
    if (button) button.disabled = !foodPhotoDataUrl;
  }
}

function mergeBodyEntry(entry) {
  const existing = state.bodyEntries.find((item) => item.date === entry.date);
  const filledEntry = Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== ""));
  const nextEntry = existing ? { ...existing, ...filledEntry, id: existing.id, date: entry.date } : entry;
  state.bodyEntries = state.bodyEntries.filter((item) => item.date !== entry.date);
  state.bodyEntries.push(nextEntry);
}

function handleFoodSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const entry = {
    id: newId("food"),
    date: formValue(form, "date"),
    meal: formValue(form, "meal"),
    foodName: formValue(form, "foodName").trim(),
    grams: readFormNumber(form, "grams"),
    kcal100: readFormNumber(form, "kcal100"),
    protein100: readFormNumber(form, "protein100") || 0,
    carbs100: readFormNumber(form, "carbs100") || 0,
    fat100: readFormNumber(form, "fat100") || 0,
    notes: formValue(form, "notes").trim()
  };
  persistFoodEntry(entry);
  ["foodName", "grams", "kcal100", "protein100", "carbs100", "fat100", "notes"].forEach((name) => setFormValue(form, name, ""));
  fillFoodDatalist();
  renderAll();
}

function handleBodySubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const entry = {
    id: newId("body"),
    date: formValue(form, "date"),
    weight: readFormNumber(form, "weight"),
    sleep: readFormNumber(form, "sleep"),
    medication: formValue(form, "medication").trim(),
    notes: formValue(form, "notes").trim()
  };
  mergeBodyEntry(entry);
  saveState();
  renderAll();
}

function handleCheckupSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const entry = {
    id: newId("body"),
    date: formValue(form, "date"),
    waist: readFormNumber(form, "waist"),
    systolic: readFormNumber(form, "systolic"),
    diastolic: readFormNumber(form, "diastolic"),
    fastingGlucose: readFormNumber(form, "fastingGlucose"),
    postMealGlucose: readFormNumber(form, "postMealGlucose"),
    bodyFat: readFormNumber(form, "bodyFat"),
    muscleMass: readFormNumber(form, "muscleMass"),
    hba1c: readFormNumber(form, "hba1c"),
    uricAcid: readFormNumber(form, "uricAcid"),
    totalCholesterol: readFormNumber(form, "totalCholesterol"),
    ldl: readFormNumber(form, "ldl"),
    alt: readFormNumber(form, "alt"),
    creatinine: readFormNumber(form, "creatinine")
  };
  mergeBodyEntry(entry);
  saveState();
  [
    "waist",
    "systolic",
    "diastolic",
    "fastingGlucose",
    "postMealGlucose",
    "bodyFat",
    "muscleMass",
    "hba1c",
    "uricAcid",
    "totalCholesterol",
    "ldl",
    "alt",
    "creatinine"
  ].forEach((name) => setFormValue(form, name, ""));
  closeCheckupModal();
  renderAll();
}

function handleExerciseSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const entry = {
    id: newId("exercise"),
    date: formValue(form, "date"),
    type: formValue(form, "type"),
    minutes: readFormNumber(form, "minutes"),
    intensity: formValue(form, "intensity"),
    heartRate: readFormNumber(form, "heartRate"),
    kcal: readFormNumber(form, "kcal"),
    notes: formValue(form, "notes").trim()
  };
  state.exerciseEntries.push(entry);
  saveState();
  ["minutes", "heartRate", "kcal", "notes"].forEach((name) => setFormValue(form, name, ""));
  renderAll();
}

function settingsFromForm(form) {
  return {
    sex: formValue(form, "sex"),
    age: readFormNumber(form, "age"),
    height: readFormNumber(form, "height"),
    fallbackWeight: readFormNumber(form, "fallbackWeight"),
    activityFactor: Number(formValue(form, "activityFactor") || DEFAULT_STATE.settings.activityFactor),
    deficit: readFormNumber(form, "deficit") || 0,
    manualTarget: readFormNumber(form, "manualTarget"),
    exerciseCredit: readFormNumber(form, "exerciseCredit") || 0,
    minIntake: readFormNumber(form, "minIntake"),
    targetWeight: readFormNumber(form, "targetWeight"),
    aiFoodEndpoint: formValue(form, "aiFoodEndpoint").trim() || DEFAULT_STATE.settings.aiFoodEndpoint,
    cloudApiEndpoint: state.settings.cloudApiEndpoint || DEFAULT_STATE.settings.cloudApiEndpoint,
    supplementNotifications: Boolean(state.settings.supplementNotifications)
  };
}

function showSettingsStatus(text) {
  const status = $("#settingsStatus");
  if (!status) return;
  status.textContent = text;
  clearTimeout(settingsStatusTimer);
  settingsStatusTimer = setTimeout(() => {
    status.textContent = "";
  }, 2200);
}

function refreshAfterSettingsChange() {
  renderProfileSummary();
  renderDashboard();
  renderTrendStats();
  renderChartsIfVisible();
}

function saveSettingsFromForm(form, message) {
  state.settings = settingsFromForm(form);
  saveState();
  refreshAfterSettingsChange();
  if (message) showSettingsStatus(message);
}

function scheduleSettingsAutosave(event) {
  const form = event.currentTarget;
  clearTimeout(settingsAutosaveTimer);
  settingsAutosaveTimer = setTimeout(() => {
    saveSettingsFromForm(form, "已自动保存");
  }, 280);
}

function handleSettingsSubmit(event) {
  event.preventDefault();
  clearTimeout(settingsAutosaveTimer);
  saveSettingsFromForm(event.currentTarget, "已保存");
}

function currentCloudApiEndpoint() {
  const inputValue = $("#cloudApiEndpoint")?.value || "";
  return (inputValue || state.settings.cloudApiEndpoint || DEFAULT_STATE.settings.cloudApiEndpoint).trim().replace(/\/+$/, "");
}

function cloudApiUrl(path) {
  const base = currentCloudApiEndpoint();
  if (!base) throw new Error("请先填写云接口地址。");
  if (window.location.protocol === "file:" && base.startsWith("/")) {
    throw new Error("当前是 file:// 打开，云同步需要通过 localhost 或上线后的地址访问。");
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function setCloudSyncStatus(text, tone = "normal") {
  const status = $("#cloudSyncStatus");
  if (!status) return;
  status.textContent = text || "";
  status.dataset.tone = tone === "error" ? "error" : "";
}

function renderCloudSyncSettings() {
  const endpointInput = $("#cloudApiEndpoint");
  if (!endpointInput) return;
  endpointInput.value = state.settings.cloudApiEndpoint || DEFAULT_STATE.settings.cloudApiEndpoint;
  const usernameInput = $("#cloudUsername");
  if (usernameInput && authState.username && !usernameInput.value) usernameInput.value = authState.username;

  const loggedIn = Boolean(authState.token);
  const badge = $("#cloudSyncBadge");
  if (badge) {
    badge.textContent = loggedIn ? `已登录 ${authState.username || "账号"}` : "未登录";
    badge.classList.toggle("is-on", loggedIn);
  }
  $("#cloudPull").disabled = !loggedIn;
  $("#cloudPush").disabled = !loggedIn;
  $("#cloudLogout").disabled = !loggedIn;
}

function saveCloudEndpoint() {
  state.settings.cloudApiEndpoint = currentCloudApiEndpoint() || DEFAULT_STATE.settings.cloudApiEndpoint;
  saveState({ skipCloudSync: true });
  renderCloudSyncSettings();
}

async function cloudRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (authState.token) headers.Authorization = `Bearer ${authState.token}`;
  const response = await fetch(cloudApiUrl(path), {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `云端请求失败：${response.status}`);
  return data;
}

function cloudStatePayload() {
  return {
    ...state,
    type: "metabolic-tracker-cloud-state",
    schemaVersion: 1,
    updatedAt: new Date().toISOString()
  };
}

function remoteStateFromResponse(data) {
  if (data?.state && typeof data.state === "object") return data.state;
  if (data?.data && typeof data.data === "object") return data.data;
  return data;
}

async function loginCloudSync() {
  try {
    saveCloudEndpoint();
    const username = ($("#cloudUsername")?.value || "").trim();
    const password = $("#cloudPassword")?.value || "";
    if (!username || !password) throw new Error("请填写账号和密码。");
    setCloudSyncStatus("正在登录云端...");
    const data = await cloudRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    if (!data.token) throw new Error("登录接口没有返回 token。");
    saveAuthState({ token: data.token, username, savedAt: new Date().toISOString() });
    const passwordInput = $("#cloudPassword");
    if (passwordInput) passwordInput.value = "";
    setCloudSyncStatus("已登录。之后保存记录会自动上传，也可以手动上传当前数据。");
  } catch (error) {
    setCloudSyncStatus(error.message || "云端登录失败。", "error");
  }
}

async function pushCloudState({ silent = false } = {}) {
  if (!authState.token) {
    if (!silent) setCloudSyncStatus("请先登录云端。", "error");
    return;
  }
  try {
    if (!silent) setCloudSyncStatus("正在上传当前数据...");
    await cloudRequest("/sync", {
      method: "PUT",
      body: JSON.stringify({ state: cloudStatePayload() })
    });
    setCloudSyncStatus(`已同步到云端：${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`);
  } catch (error) {
    setCloudSyncStatus(error.message || "上传失败。", "error");
  }
}

async function pullCloudState() {
  if (!authState.token) {
    setCloudSyncStatus("请先登录云端。", "error");
    return;
  }
  try {
    setCloudSyncStatus("正在拉取云端数据...");
    const data = await cloudRequest("/sync", { method: "GET" });
    const remoteState = remoteStateFromResponse(data);
    if (!remoteState || (!remoteState.settings && !remoteState.foodEntries && !remoteState.bodyEntries && !remoteState.exerciseEntries)) {
      setCloudSyncStatus("云端暂无可合并的数据。");
      return;
    }
    applyImportedState({ ...remoteState, type: "metabolic-tracker-merge", mode: "merge" });
    saveState({ skipCloudSync: true });
    fillFoodDatalist();
    renderAll();
    setCloudSyncStatus("已从云端合并到本机。");
  } catch (error) {
    setCloudSyncStatus(error.message || "拉取失败。", "error");
  }
}

function logoutCloudSync() {
  saveAuthState({ token: "", username: "" });
  setCloudSyncStatus("已退出本设备登录。");
}

function scheduleCloudAutoSync() {
  if (!authState.token) return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => {
    pushCloudState({ silent: true });
  }, 1200);
}

function exportState() {
  const data = JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `代谢减脂记录-${activeDate()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function mergeById(existing, incoming) {
  const map = new Map(existing.map((entry) => [entry.id, entry]));
  incoming.forEach((entry) => {
    if (!entry || !entry.id) return;
    map.set(entry.id, { ...(map.get(entry.id) || {}), ...entry });
  });
  return Array.from(map.values());
}

function mergeBodyEntries(existing, incoming) {
  let merged = [...existing];
  incoming.forEach((entry) => {
    if (!entry) return;
    if (entry.id) {
      const index = merged.findIndex((item) => item.id === entry.id);
      if (index >= 0) {
        merged[index] = { ...merged[index], ...entry };
        return;
      }
    }
    if (entry.date) {
      const index = merged.findIndex((item) => item.date === entry.date);
      if (index >= 0) {
        merged[index] = { ...merged[index], ...entry };
        return;
      }
    }
    merged.push(entry);
  });
  return merged;
}

function applyImportedState(parsed) {
  const isMerge = parsed.mode === "merge" || parsed.type === "metabolic-tracker-merge";
  if (!isMerge) {
    state = {
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
      customFoods: Array.isArray(parsed.customFoods) ? parsed.customFoods : [],
      foodEntries: Array.isArray(parsed.foodEntries) ? parsed.foodEntries : [],
      bodyEntries: Array.isArray(parsed.bodyEntries) ? parsed.bodyEntries : [],
      exerciseEntries: Array.isArray(parsed.exerciseEntries) ? parsed.exerciseEntries : [],
      supplementItems: normalizeSupplementItems(parsed.supplementItems),
      supplementLogs: Array.isArray(parsed.supplementLogs) ? parsed.supplementLogs : [],
      supplementWorkoutDates: Array.isArray(parsed.supplementWorkoutDates) ? parsed.supplementWorkoutDates : []
    };
    return "导入完成";
  }

  state = {
    settings: { ...state.settings, ...(parsed.settings || {}) },
    customFoods: mergeById(state.customFoods, Array.isArray(parsed.customFoods) ? parsed.customFoods : []),
    foodEntries: mergeById(state.foodEntries, Array.isArray(parsed.foodEntries) ? parsed.foodEntries : []),
    bodyEntries: mergeBodyEntries(state.bodyEntries, Array.isArray(parsed.bodyEntries) ? parsed.bodyEntries : []),
    exerciseEntries: mergeById(state.exerciseEntries, Array.isArray(parsed.exerciseEntries) ? parsed.exerciseEntries : []),
    supplementItems: mergeById(state.supplementItems, Array.isArray(parsed.supplementItems) ? normalizeSupplementItems(parsed.supplementItems) : []),
    supplementLogs: mergeById(state.supplementLogs, Array.isArray(parsed.supplementLogs) ? parsed.supplementLogs : []),
    supplementWorkoutDates: Array.from(
      new Set([...state.supplementWorkoutDates, ...(Array.isArray(parsed.supplementWorkoutDates) ? parsed.supplementWorkoutDates : [])])
    )
  };
  return "合并导入完成";
}

function importState(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const message = applyImportedState(parsed);
      saveState();
      fillFoodDatalist();
      renderAll();
      alert(message);
    } catch {
      alert("导入失败：文件不是有效的 JSON 备份。");
    }
  };
  reader.readAsText(file, "utf-8");
}

function setDeviceImportStatus(text, tone = "normal") {
  const status = $("#deviceImportStatus");
  if (!status) return;
  status.textContent = text;
  status.dataset.tone = tone;
}

function hashText(text) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function parseAppleHealthDate(value) {
  const text = String(value || "").trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?: ([+-]\d{2}):?(\d{2}))?$/);
  if (!match) return null;
  const offset = match[7] ? `${match[7]}:${match[8]}` : "";
  const parsed = new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}${offset}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeImportDate(value) {
  const text = String(value || "").trim();
  const direct = text.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (direct) return `${direct[1]}-${direct[2].padStart(2, "0")}-${direct[3].padStart(2, "0")}`;
  const healthDate = parseAppleHealthDate(text);
  if (healthDate) return formatLocalDate(healthDate);
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : formatLocalDate(parsed);
}

function numberFromText(value) {
  const text = String(value ?? "").replace(",", ".").replace(/[^\d.-]/g, "");
  return toNumber(text);
}

function convertWeightToKg(value, unit) {
  const number = numberFromText(value);
  if (number === null) return null;
  const normalizedUnit = String(unit || "").toLowerCase();
  if (normalizedUnit.includes("lb") || normalizedUnit.includes("pound")) return round(number * 0.453592, 1);
  return round(number, 1);
}

function convertEnergyToKcal(value, unit) {
  const number = numberFromText(value);
  if (number === null) return null;
  const normalizedUnit = String(unit || "").toLowerCase();
  if (normalizedUnit === "kj" || normalizedUnit.includes("kilojoule")) return round(number / 4.184, 0);
  return round(number, 0);
}

function convertDurationToMinutes(value, unit) {
  const number = numberFromText(value);
  if (number === null) return null;
  const normalizedUnit = String(unit || "").toLowerCase();
  if (normalizedUnit.startsWith("h")) return round(number * 60, 0);
  if (normalizedUnit.startsWith("s")) return round(number / 60, 0);
  return round(number, 0);
}

function convertPercent(value) {
  const number = numberFromText(value);
  if (number === null) return null;
  return round(number <= 1 ? number * 100 : number, 1);
}

function bodyImportEntry(map, date) {
  if (!map.has(date)) map.set(date, { id: `body-device-${date}`, date });
  return map.get(date);
}

function addImportedBodyNumber(map, date, key, value, digits = 1) {
  if (!date || value === null || value === undefined || Number.isNaN(value)) return;
  bodyImportEntry(map, date)[key] = round(value, digits);
}

function workoutTypeName(type) {
  const text = String(type || "");
  if (text.includes("Walking")) return "步行";
  if (text.includes("Running")) return "慢跑";
  if (text.includes("Cycling")) return "骑行";
  if (text.includes("Swimming")) return "游泳";
  if (text.includes("Strength")) return "力量训练";
  if (text.includes("Yoga")) return "瑜伽";
  if (text.includes("Elliptical")) return "椭圆机";
  return "Apple Watch 训练";
}

function zipTextDecoder(bytes) {
  return new TextDecoder("utf-8").decode(bytes);
}

async function inflateZipBytes(bytes) {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("当前浏览器不能直接解压 ZIP，请在文件 App 里先解压，再选择 apple_health_export/export.xml。");
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Response(stream).text();
}

function findZipEntry(view, expectedName) {
  const minOffset = Math.max(0, view.byteLength - 66000);
  let endOffset = -1;
  for (let offset = view.byteLength - 22; offset >= minOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      endOffset = offset;
      break;
    }
  }
  if (endOffset < 0) throw new Error("ZIP 文件结构不完整。");
  const entries = view.getUint16(endOffset + 10, true);
  let offset = view.getUint32(endOffset + 16, true);
  for (let index = 0; index < entries; index += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) break;
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const fileNameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);
    const fileNameBytes = new Uint8Array(view.buffer, offset + 46, fileNameLength);
    const fileName = zipTextDecoder(fileNameBytes).replace(/\\/g, "/");
    if (fileName.endsWith(expectedName)) return { method, compressedSize, localHeaderOffset, fileName };
    offset += 46 + fileNameLength + extraLength + commentLength;
  }
  return null;
}

async function extractAppleHealthXmlFromZip(file) {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const entry = findZipEntry(view, "export.xml");
  if (!entry) throw new Error("ZIP 里没有找到 export.xml。请选择 Apple 健康导出的完整文件，或解压后选择 export.xml。");
  const localOffset = entry.localHeaderOffset;
  if (view.getUint32(localOffset, true) !== 0x04034b50) throw new Error("ZIP 本地文件头无效。");
  const fileNameLength = view.getUint16(localOffset + 26, true);
  const extraLength = view.getUint16(localOffset + 28, true);
  const dataOffset = localOffset + 30 + fileNameLength + extraLength;
  const compressedBytes = new Uint8Array(buffer, dataOffset, entry.compressedSize);
  if (entry.method === 0) return zipTextDecoder(compressedBytes);
  if (entry.method === 8) return inflateZipBytes(compressedBytes);
  throw new Error(`暂不支持 ZIP 压缩方式 ${entry.method}。请先解压后选择 export.xml。`);
}

async function readDeviceImportText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".zip")) return { text: await extractAppleHealthXmlFromZip(file), kind: "health-xml" };
  const text = await file.text();
  if (name.endsWith(".xml") || text.trimStart().startsWith("<")) return { text, kind: "health-xml" };
  return { text, kind: "csv" };
}

function parseAppleHealthXml(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) throw new Error("XML 解析失败，请确认选择的是 Apple 健康 export.xml。");
  const bodyMap = new Map();
  const dailyMove = new Map();
  const exerciseEntries = [];
  const weightTimestamp = new Map();
  const bodyFatTimestamp = new Map();

  Array.from(doc.getElementsByTagName("Record")).forEach((record) => {
    const type = record.getAttribute("type") || "";
    const unit = record.getAttribute("unit") || "";
    const value = record.getAttribute("value") || "";
    const start = parseAppleHealthDate(record.getAttribute("startDate"));
    const end = parseAppleHealthDate(record.getAttribute("endDate")) || start;
    if (!end && !start) return;

    if (type === "HKQuantityTypeIdentifierBodyMass") {
      const date = formatLocalDate(end || start);
      const at = (end || start).getTime();
      if ((weightTimestamp.get(date) || 0) <= at) {
        const weight = convertWeightToKg(value, unit);
        if (weight !== null) {
          addImportedBodyNumber(bodyMap, date, "weight", weight, 1);
          weightTimestamp.set(date, at);
        }
      }
      return;
    }

    if (type === "HKQuantityTypeIdentifierBodyFatPercentage") {
      const date = formatLocalDate(end || start);
      const at = (end || start).getTime();
      if ((bodyFatTimestamp.get(date) || 0) <= at) {
        const bodyFat = convertPercent(value);
        if (bodyFat !== null) {
          addImportedBodyNumber(bodyMap, date, "bodyFat", bodyFat, 1);
          bodyFatTimestamp.set(date, at);
        }
      }
      return;
    }

    if (type === "HKCategoryTypeIdentifierSleepAnalysis") {
      const sleepValue = record.getAttribute("value") || "";
      if (!sleepValue.includes("Asleep") || !start || !end) return;
      const date = formatLocalDate(end);
      const hours = Math.max(0, (end - start) / 3600000);
      if (hours > 0 && hours < 18) {
        const entry = bodyImportEntry(bodyMap, date);
        entry.sleep = round((toNumber(entry.sleep) || 0) + hours, 1);
      }
      return;
    }

    if (type === "HKQuantityTypeIdentifierActiveEnergyBurned" || type === "HKQuantityTypeIdentifierAppleExerciseTime") {
      const date = formatLocalDate(start || end);
      const item = dailyMove.get(date) || { date, kcal: 0, minutes: 0 };
      if (type === "HKQuantityTypeIdentifierActiveEnergyBurned") item.kcal += convertEnergyToKcal(value, unit) || 0;
      if (type === "HKQuantityTypeIdentifierAppleExerciseTime") item.minutes += convertDurationToMinutes(value, unit) || 0;
      dailyMove.set(date, item);
    }
  });

  const workoutDays = new Set();
  Array.from(doc.getElementsByTagName("Workout")).forEach((workout) => {
    const start = parseAppleHealthDate(workout.getAttribute("startDate"));
    const end = parseAppleHealthDate(workout.getAttribute("endDate")) || start;
    if (!start) return;
    const date = formatLocalDate(start);
    const type = workoutTypeName(workout.getAttribute("workoutActivityType"));
    const minutes =
      convertDurationToMinutes(workout.getAttribute("duration"), workout.getAttribute("durationUnit")) ||
      (end ? round(Math.max(0, end - start) / 60000, 0) : 0);
    const kcal = convertEnergyToKcal(workout.getAttribute("totalEnergyBurned"), workout.getAttribute("totalEnergyBurnedUnit")) || 0;
    if (!minutes && !kcal) return;
    workoutDays.add(date);
    exerciseEntries.push({
      id: `exercise-apple-workout-${date}-${hashText(`${start.toISOString()}-${type}-${minutes}-${kcal}`)}`,
      date,
      type,
      minutes,
      intensity: "normal",
      heartRate: "",
      kcal,
      notes: "Apple 健康导入"
    });
  });

  dailyMove.forEach((item) => {
    if (workoutDays.has(item.date)) return;
    if (!item.minutes && !item.kcal) return;
    exerciseEntries.push({
      id: `exercise-apple-daily-${item.date}`,
      date: item.date,
      type: "Apple Watch 活动",
      minutes: round(item.minutes, 0),
      intensity: "normal",
      heartRate: "",
      kcal: round(item.kcal, 0),
      notes: "Apple 健康导入"
    });
  });

  return {
    source: "Apple 健康",
    bodyEntries: Array.from(bodyMap.values()),
    exerciseEntries
  };
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function normalizeCsvHeader(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_/%（）()·.-]+/g, "");
}

function csvValue(row, names) {
  const normalizedNames = names.map(normalizeCsvHeader);
  for (const name of normalizedNames) {
    if (row[name] !== undefined && String(row[name]).trim() !== "") return row[name];
  }
  return "";
}

function normalizeSleepHours(value) {
  const number = numberFromText(value);
  if (number === null) return null;
  return round(number > 24 ? number / 60 : number, 1);
}

function parseDeviceCsv(text) {
  const rows = parseCsvRows(text);
  if (rows.length < 2) throw new Error("CSV 至少需要表头和一行数据。");
  const headers = rows[0].map(normalizeCsvHeader);
  const bodyMap = new Map();
  const exerciseEntries = [];

  rows.slice(1).forEach((cells, index) => {
    const row = {};
    headers.forEach((header, cellIndex) => {
      row[header] = cells[cellIndex] || "";
    });
    const date = normalizeImportDate(csvValue(row, ["date", "day", "日期", "时间", "startDate", "开始时间"]));
    if (!date) return;

    const weight = numberFromText(csvValue(row, ["weight", "bodyWeight", "kg", "体重", "体重kg"]));
    const bodyFat = convertPercent(csvValue(row, ["bodyFat", "bodyFatPercentage", "fat", "体脂", "体脂率"]));
    const sleep = normalizeSleepHours(csvValue(row, ["sleep", "sleepHours", "sleepH", "睡眠", "睡眠h", "睡眠小时"]));
    if (weight !== null || bodyFat !== null || sleep !== null) {
      const body = bodyImportEntry(bodyMap, date);
      if (weight !== null) body.weight = round(weight, 1);
      if (bodyFat !== null) body.bodyFat = round(bodyFat, 1);
      if (sleep !== null) body.sleep = round(sleep, 1);
    }

    const minutes = numberFromText(csvValue(row, ["exerciseMinutes", "minutes", "activeMinutes", "workoutMinutes", "运动分钟", "运动时长", "时长min"]));
    const kcal = numberFromText(csvValue(row, ["exerciseKcal", "kcal", "calories", "activeEnergy", "消耗", "运动消耗", "热量"]));
    if (minutes !== null || kcal !== null) {
      const type = String(csvValue(row, ["exerciseType", "type", "workout", "运动类型"]) || "设备导入").trim();
      exerciseEntries.push({
        id: `exercise-device-${date}-${hashText(`${index}-${date}-${type}-${minutes}-${kcal}`)}`,
        date,
        type,
        minutes: minutes ?? 0,
        intensity: "normal",
        heartRate: numberFromText(csvValue(row, ["heartRate", "avgHeartRate", "bpm", "平均心率", "心率"])) ?? "",
        kcal: kcal ?? 0,
        notes: "设备 CSV 导入"
      });
    }
  });

  return {
    source: "CSV",
    bodyEntries: Array.from(bodyMap.values()),
    exerciseEntries
  };
}

function applyDeviceImportResult(result) {
  const bodyCount = result.bodyEntries.length;
  const exerciseCount = result.exerciseEntries.length;
  if (!bodyCount && !exerciseCount) throw new Error("没有识别到可导入的体重、睡眠或运动数据。");
  applyImportedState({
    type: "metabolic-tracker-merge",
    mode: "merge",
    bodyEntries: result.bodyEntries,
    exerciseEntries: result.exerciseEntries
  });
  saveState();
  renderAll();
  setDeviceImportStatus(`已导入 ${result.source}：身体 ${bodyCount} 天，运动 ${exerciseCount} 条。`);
}

async function importDeviceData(file) {
  if (!file) return;
  try {
    setDeviceImportStatus("正在读取设备文件...");
    const { text, kind } = await readDeviceImportText(file);
    const result = kind === "health-xml" ? parseAppleHealthXml(text) : parseDeviceCsv(text);
    applyDeviceImportResult(result);
  } catch (error) {
    setDeviceImportStatus(error.message || "设备导入失败。", "error");
  }
}

function downloadDeviceCsvTemplate() {
  const csv = [
    "date,weight,bodyFat,sleep,exerciseMinutes,exerciseKcal,exerciseType,heartRate",
    "2026-06-29,100.0,35.0,7.5,45,320,快走,125"
  ].join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "device-import-template.csv";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function clearState() {
  if (!confirm("确认清空所有本地记录？")) return;
  state = structuredClone(DEFAULT_STATE);
  saveState();
  fillFoodDatalist();
  renderAll();
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(value) {
  return 1 - (1 - value) ** 3;
}

function renderChartsIfVisible() {
  if (!$("#trends").classList.contains("is-active")) return;
  if (prefersReducedMotion()) {
    drawBodyChart(1);
    drawCalorieChart(1);
    return;
  }
  const token = ++chartAnimationToken;
  const start = performance.now();
  const duration = 720;
  const frame = (now) => {
    if (token !== chartAnimationToken) return;
    const progress = easeOutCubic(Math.min(1, (now - start) / duration));
    drawBodyChart(progress);
    drawCalorieChart(progress);
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function canvasContext(canvas) {
  const parentStyle = getComputedStyle(canvas.parentElement);
  const horizontalPadding = parseFloat(parentStyle.paddingLeft || "0") + parseFloat(parentStyle.paddingRight || "0");
  const width = Math.max(240, Math.round(canvas.parentElement.clientWidth - horizontalPadding));
  const baseHeight = Number(canvas.getAttribute("height")) || 260;
  const height = window.matchMedia("(max-width: 720px)").matches ? Math.min(baseHeight, 180) : baseHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function drawEmptyChart(ctx, width, height, text) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfdf8";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#d9e4df";
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
  ctx.setLineDash([]);
  ctx.fillStyle = "#0f766e";
  ctx.font = '700 14px "Microsoft YaHei", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2 - 6);
  ctx.fillStyle = "#65717f";
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  ctx.fillText("记录几天后这里会自动生成趋势", width / 2, height / 2 + 18);
}

function drawBodyChart(progress = 1) {
  const canvas = $("#bodyChart");
  const { ctx, width, height } = canvasContext(canvas);
  const entries = [...state.bodyEntries]
    .filter((entry) => toNumber(entry.weight) !== null || toNumber(entry.waist) !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);
  if (!entries.length) {
    drawEmptyChart(ctx, width, height, "暂无身体趋势");
    return;
  }

  const padding = { top: 28, right: 20, bottom: 44, left: 48 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const values = entries.flatMap((entry) => [toNumber(entry.weight), toNumber(entry.waist)]).filter((value) => value !== null);
  const min = Math.floor(Math.min(...values) - 2);
  const max = Math.ceil(Math.max(...values) + 2);
  const scaleY = (value) => padding.top + plotH - ((value - min) / Math.max(1, max - min)) * plotH;
  const scaleX = (index) => padding.left + (entries.length === 1 ? plotW / 2 : (index / (entries.length - 1)) * plotW);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#e2e8e4";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#65717f";
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i += 1) {
    const value = max - ((max - min) / 4) * i;
    ctx.fillText(Math.round(value), padding.left - 8, padding.top + (plotH / 4) * i + 4);
  }

  drawLine(ctx, entries, "weight", scaleX, scaleY, "#0f766e", progress);
  drawLine(ctx, entries, "waist", scaleX, scaleY, "#b45309", progress);

  ctx.textAlign = "left";
  ctx.fillStyle = "#0f766e";
  ctx.fillText("体重 kg", padding.left, 16);
  ctx.fillStyle = "#b45309";
  ctx.fillText("腰围 cm", padding.left + 72, 16);
  ctx.fillStyle = "#65717f";
  ctx.textAlign = "center";
  entries.forEach((entry, index) => {
    if (index !== 0 && index !== entries.length - 1 && entries.length > 6 && index % 5 !== 0) return;
    ctx.fillText(entry.date.slice(5), scaleX(index), height - 18);
  });
}

function drawLine(ctx, entries, key, scaleX, scaleY, color, progress = 1) {
  const points = entries
    .map((entry, index) => ({ x: scaleX(index), y: scaleY(toNumber(entry[key])), value: toNumber(entry[key]) }))
    .filter((point) => point.value !== null);
  if (!points.length) return;
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  let visiblePoints = points;
  if (points.length > 1 && safeProgress < 1) {
    const exact = (points.length - 1) * safeProgress;
    const whole = Math.floor(exact);
    const partial = exact - whole;
    visiblePoints = points.slice(0, whole + 1);
    if (whole + 1 < points.length) {
      const current = points[whole];
      const next = points[whole + 1];
      visiblePoints.push({
        x: current.x + (next.x - current.x) * partial,
        y: current.y + (next.y - current.y) * partial,
        value: current.value + (next.value - current.value) * partial
      });
    }
  }
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  visiblePoints.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  visiblePoints.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawCalorieChart(progress = 1) {
  const canvas = $("#calorieChart");
  const { ctx, width, height } = canvasContext(canvas);
  const days = rangeDays(activeDate(), 14);
  const data = days.map((date) => ({ date, ...daySummary(date) }));
  if (!data.some((day) => day.food.kcal > 0 || day.exercise.kcal > 0)) {
    drawEmptyChart(ctx, width, height, "暂无摄入与运动记录");
    return;
  }

  const padding = { top: 28, right: 20, bottom: 44, left: 48 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;
  const max = Math.max(...data.map((day) => Math.max(day.food.kcal, day.budget || 0)), 1000);
  const scaleY = (value) => padding.top + plotH - (value / max) * plotH;
  const barW = Math.max(8, plotW / data.length - 8);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#e2e8e4";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#65717f";
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i += 1) {
    const value = max - (max / 4) * i;
    ctx.fillText(Math.round(value), padding.left - 8, padding.top + (plotH / 4) * i + 4);
  }

  data.forEach((day, index) => {
    const x = padding.left + (plotW / data.length) * index + (plotW / data.length - barW) / 2;
    const animatedFood = day.food.kcal * progress;
    const barHeight = plotH - (scaleY(animatedFood) - padding.top);
    ctx.fillStyle = day.budget && day.food.kcal > day.budget ? "#be123c" : "#0f766e";
    ctx.fillRect(x, scaleY(animatedFood), barW, Math.max(1, barHeight));
    ctx.fillStyle = "#65717f";
    ctx.textAlign = "center";
    if (index % 2 === 0 || data.length <= 7) ctx.fillText(day.date.slice(5), x + barW / 2, height - 18);
  });

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, padding.left + plotW * progress + plotW / data.length, height);
  ctx.clip();
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((day, index) => {
    const x = padding.left + (plotW / data.length) * index + plotW / data.length / 2;
    const y = scaleY(day.budget || 0);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = "left";
  ctx.fillStyle = "#0f766e";
  ctx.fillText("摄入", padding.left, 16);
  ctx.fillStyle = "#2563eb";
  ctx.fillText("预算", padding.left + 46, 16);
}

function renderAll() {
  fillFoodDatalist();
  renderSettingsForm();
  renderProfileSummary();
  renderDashboard();
  renderFoodView();
  renderBodyView();
  renderSupplementsView();
  renderExerciseView();
  renderTrendStats();
  renderCloudSyncSettings();
  renderChartsIfVisible();
}

function bindEvents() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });

  $("#profileButton").addEventListener("click", openProfileCenter);
  $("#profileClose").addEventListener("click", closeProfileCenter);
  $("#profileShortcut").addEventListener("click", openProfileCenter);
  $("#checkupButton").addEventListener("click", openCheckupModal);
  $("#checkupClose").addEventListener("click", closeCheckupModal);
  $("#profileModal").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeProfileCenter();
  });
  $("#checkupModal").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeCheckupModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#profileModal").hidden) closeProfileCenter();
    if (event.key === "Escape" && !$("#checkupModal").hidden) closeCheckupModal();
  });

  $$("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.jump));
  });

  $("#activeDate").addEventListener("change", () => {
    monthCursor = monthStart(activeDate());
    setFormDates(activeDate());
    renderAll();
  });
  $("#monthPrev").addEventListener("click", () => {
    monthCursor = shiftMonth(monthCursor || activeDate(), -1);
    renderMonthRings();
  });
  $("#monthNext").addEventListener("click", () => {
    monthCursor = shiftMonth(monthCursor || activeDate(), 1);
    renderMonthRings();
  });
  $("#monthToday").addEventListener("click", () => setActiveDate(todayISO()));
  $("#monthRingsGrid").addEventListener("click", (event) => {
    const button = event.target.closest(".month-day[data-date]");
    if (!button) return;
    setActiveDate(button.dataset.date);
  });

  $("#foodForm").addEventListener("submit", handleFoodSubmit);
  $("#foodPhotoInput").addEventListener("change", handleFoodPhotoChange);
  $("#recognizeFoodPhoto").addEventListener("click", recognizeFoodPhoto);
  $("#testFoodAi").addEventListener("click", runFoodAiSelfTest);
  $("#clearFoodPhoto").addEventListener("click", clearFoodPhoto);
  $("#foodAiDrafts").addEventListener("click", handleFoodAiDraftClick);
  $("#todaySupplementList").addEventListener("change", handleSupplementListChange);
  $("#dashboardSupplementList").addEventListener("change", handleSupplementListChange);
  $("#toggleWorkoutDay").addEventListener("click", toggleWorkoutDay);
  $("#toggleSupplementReminders").addEventListener("click", toggleSupplementReminders);
  $("#supplementForm").addEventListener("submit", handleSupplementSubmit);
  $("#clearSupplementForm").addEventListener("click", resetSupplementForm);
  $("#supplementPlanList").addEventListener("click", handleSupplementPlanClick);
  $("#resetSupplementDefaults").addEventListener("click", restoreDefaultSupplements);
  $("#bodyForm").addEventListener("submit", handleBodySubmit);
  $("#checkupForm").addEventListener("submit", handleCheckupSubmit);
  $("#exerciseForm").addEventListener("submit", handleExerciseSubmit);
  $("#settingsForm").addEventListener("submit", handleSettingsSubmit);
  $("#settingsForm").addEventListener("input", scheduleSettingsAutosave);
  $("#settingsForm").addEventListener("change", scheduleSettingsAutosave);

  $("#foodForm input[name='foodName']").addEventListener("change", (event) => {
    const food = findFood(event.target.value);
    if (!food) return;
    const form = $("#foodForm");
    setFormValue(form, "kcal100", food.kcal100);
    setFormValue(form, "protein100", food.protein100);
    setFormValue(form, "carbs100", food.carbs100);
    setFormValue(form, "fat100", food.fat100);
  });

  $("#estimateExercise").addEventListener("click", () => {
    const kcal = estimateExerciseKcal();
    if (kcal === null) {
      alert("请先填写运动时长，并在身体记录或设置里补一个体重。");
      return;
    }
    setFormValue($("#exerciseForm"), "kcal", kcal);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-button");
    if (!button) return;
    if (!button.dataset.type || !button.dataset.id) return;
    deleteEntry(button.dataset.type, button.dataset.id);
  });

  $("#exportTop").addEventListener("click", exportState);
  $("#exportData").addEventListener("click", exportState);
  $("#importData").addEventListener("change", (event) => importState(event.target.files[0]));
  $("#deviceImportFile").addEventListener("change", (event) => {
    importDeviceData(event.target.files[0]);
    event.target.value = "";
  });
  $("#downloadDeviceTemplate").addEventListener("click", downloadDeviceCsvTemplate);
  $("#clearData").addEventListener("click", clearState);
  $("#cloudApiEndpoint").addEventListener("change", saveCloudEndpoint);
  $("#cloudLogin").addEventListener("click", loginCloudSync);
  $("#cloudPull").addEventListener("click", pullCloudState);
  $("#cloudPush").addEventListener("click", () => pushCloudState());
  $("#cloudLogout").addEventListener("click", logoutCloudSync);
  window.addEventListener("resize", () => renderChartsIfVisible());
}

function init() {
  $("#activeDate").value = todayISO();
  monthCursor = monthStart(activeDate());
  fillExerciseTypes();
  setFormDates(activeDate());
  initIcons();
  bindEvents();
  resetSupplementForm();
  startSupplementReminderLoop();
  renderAll();
}

init();
