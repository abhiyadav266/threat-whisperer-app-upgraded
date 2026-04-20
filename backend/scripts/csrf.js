const axios = require('axios');

exports.check = async (url) => {
  try {
    const res = await axios.get(url);

    if (!res.data.includes("csrf") && !res.headers['x-csrf-token']) {
      return {
        type: "CSRF",
        severity: "Medium",
        vulnerable: true,
        cvss: 6.5,
        description: "CSRF protection missing",
        impact: "Unauthorized actions",
        mitigation: "Use CSRF tokens"
      };
    }
  } catch {}

  return { type: "CSRF", vulnerable: false };
};