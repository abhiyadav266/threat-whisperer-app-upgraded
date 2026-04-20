const axios = require('axios');

exports.check = async (url) => {
  try {
    const res = await axios.get(url);

    if (res.headers['access-control-allow-origin'] === '*') {
      return {
        type: "CORS Misconfig",
        severity: "Medium",
        vulnerable: true,
        cvss: 6.0,
        description: "Wildcard origin allowed",
        impact: "Data exposure",
        mitigation: "Restrict origins"
      };
    }
  } catch {}

  return { type: "CORS", vulnerable: false };
};