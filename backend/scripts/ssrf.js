const axios = require('axios');

exports.check = async (url) => {
  try {
    const res = await axios.get(url + "?url=http://127.0.0.1");

    if (res.data.includes("127.0.0.1")) {
      return {
        type: "SSRF",
        severity: "High",
        vulnerable: true,
        cvss: 8.0,
        description: "Server Side Request Forgery",
        impact: "Internal network access",
        mitigation: "Validate URLs"
      };
    }
  } catch {}

  return { type: "SSRF", vulnerable: false };
};