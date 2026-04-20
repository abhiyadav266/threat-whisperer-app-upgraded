const axios = require('axios');

const payloads = [
  "<script>alert(1)</script>",
  "\"><img src=x onerror=alert(1)>"
];

exports.check = async (url) => {
  for (let payload of payloads) {
    try {
      const res = await axios.get(url + "?q=" + payload);

      if (res.data.includes(payload)) {
        return {
          type: "XSS",
          severity: "High",
          vulnerable: true,
          cvss: 7.5,
          description: "Reflected XSS detected",
          impact: "Session hijacking",
          mitigation: "Sanitize input & use CSP"
        };
      }
    } catch {}
  }

  return { type: "XSS", vulnerable: false };
};