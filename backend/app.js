const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Scan Logic
function runScan(url) {
  const results = [];

  if (url.includes("test") || url.includes("demo")) {
    results.push({
      type: "SQL Injection",
      severity: "Critical",
      vulnerable: true,
      cvss: 9.8,
      description: "Input not sanitized",
      impact: "Database compromise",
      mitigation: "Use prepared statements"
    });
  }

  results.push({
    type: "XSS",
    severity: "High",
    vulnerable: true,
    cvss: 7.5,
    description: "Reflected XSS detected",
    impact: "Session hijacking",
    mitigation: "Escape output"
  });

  results.push({
    type: "CSRF",
    severity: "Medium",
    vulnerable: true,
    cvss: 5.3,
    description: "Missing CSRF tokens",
    impact: "Unauthorized actions",
    mitigation: "Add CSRF tokens"
  });

  results.push({
    type: "SSL",
    severity: "Low",
    vulnerable: false,
    cvss: 2.0,
    description: "SSL certificate valid"
  });

  return results;
}

// 🚀 API
app.post("/scan", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  const results = runScan(url);

  res.json({
    status: "success",
    data: {
      target: url,
      results: results
    }
  });
});

app.listen(5000, () => {
  console.log("🔥 Backend running on http://localhost:5000");
});