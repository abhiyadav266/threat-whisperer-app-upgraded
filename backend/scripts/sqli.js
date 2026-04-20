const axios = require('axios');

const payloads = [
  "' OR 1=1--",
  "' UNION SELECT null--",
  "' OR SLEEP(3)--",
  "'"
];

exports.check = async (url) => {
  for (let payload of payloads) {
    try {
      const start = Date.now();
      const res = await axios.get(url + payload, { timeout: 4000 });
      const time = Date.now() - start;

      if (/sql|syntax|mysql|error/i.test(res.data) || time > 2500) {
        return {
          type: "SQL Injection",
          severity: "Critical",
          vulnerable: true,
          cvss: 9.8,
          description: "SQL Injection detected",
          impact: "Database compromise",
          mitigation: "Use prepared statements"
        };
      }
    } catch {}
  }

  return { type: "SQL Injection", vulnerable: false };
};