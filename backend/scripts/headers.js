const axios = require('axios');

exports.check = async (url) => {
  try {
    const res = await axios.get(url);

    const missing = [];

    if (!res.headers['content-security-policy']) missing.push("CSP");
    if (!res.headers['x-frame-options']) missing.push("X-Frame-Options");

    return {
      type: "Security Headers",
      severity: "Low",
      vulnerable: missing.length > 0,
      cvss: 4.0,
      description: "Missing security headers",
      impact: "Clickjacking/XSS risk",
      mitigation: "Add security headers"
    };
  } catch {}

  return { type: "Headers", vulnerable: false };
};