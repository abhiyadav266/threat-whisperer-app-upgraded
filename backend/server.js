const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

// 🔥 FIX FETCH (Node 18+ safe)
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 🔥 Middleware
app.use(cors());
app.use(express.json());

const scanner = require('./scanner');

// 🔥 STATS
let stats = {
  scansToday: 0,
  threatsFound: 0,
  startTime: Date.now()
};

// 🔥 HISTORY
let history = [];

// 🔥 CACHE
const breachCache = {};

// =========================
// ✅ HEALTH
// =========================
app.get('/', (req, res) => {
  res.send("🚀 SecureScan Backend Running");
});

// =========================
// 📊 STATS
// =========================
app.get("/stats", (req, res) => {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);

  res.json({
    scansToday: stats.scansToday,
    threatsBlocked: stats.threatsFound,
    uptime
  });
});

// =========================
// 📜 HISTORY
// =========================
app.get("/history", (req, res) => res.json(history));

app.delete("/history/:id", (req, res) => {
  const id = Number(req.params.id);
  history = history.filter(h => h.id !== id);
  res.json({ success: true });
});

app.delete("/history", (req, res) => {
  history = [];
  res.json({ success: true });
});

// =========================
// 🔐 BREACH CHECK (FINAL FIX)
// =========================
app.post("/check-breach", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.json({ breached: false, count: 0 });
    }

    // 🔥 CACHE
    if (breachCache[password]) {
      return res.json(breachCache[password]);
    }

    // 🔐 HASH
    const sha1 = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex")
      .toUpperCase();

    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    // 🔥 FETCH
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: { "User-Agent": "SecureScan-App" }
      }
    );

    const text = await response.text();
    const lines = text.split("\n");

    let found = false;
    let count = 0;

    for (let line of lines) {
      const [hashSuffix, num] = line.trim().split(":");

      if (hashSuffix === suffix) {
        found = true;
        count = parseInt(num);
        break;
      }
    }

    const result = {
      breached: found,
      count: count
    };

    breachCache[password] = result;

    res.json(result);

  } catch (err) {
    console.error("❌ Breach Error:", err.message);

    res.status(500).json({
      breached: false,
      count: 0
    });
  }
});

// =========================
// 🔍 SCAN
// =========================
app.post('/scan', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !url.startsWith('http')) {
      return res.status(400).json({
        status: "error",
        message: "Invalid URL"
      });
    }

    const result = await scanner.runAll(url);

    stats.scansToday++;
    stats.threatsFound += result.summary.vulnerable || 0;

    let severity = "Low";
    if (result.summary.critical > 0) severity = "Critical";
    else if (result.summary.high > 0) severity = "High";
    else if (result.summary.medium > 0) severity = "Medium";

    history.unshift({
      id: Date.now(),
      url,
      date: new Date().toLocaleString(),
      issues: result.summary.vulnerable || 0,
      severity
    });

    res.json({ status: "success", data: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error" });
  }
});

// =========================
// 🚀 START
// =========================
app.listen(5000, () => {
  console.log("🔥 Server running on http://localhost:5000");
});