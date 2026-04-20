const sqli = require('./scripts/sqli');
const xss = require('./scripts/xss');
const csrf = require('./scripts/csrf');
const ssrf = require('./scripts/ssrf');
const headers = require('./scripts/headers');
const corsCheck = require('./scripts/cors');
const idor = require('./scripts/idor');
const lfi = require('./scripts/lfi');
const vt = require('./scripts/virustotal');

// 🔥 MAIN SCANNER FUNCTION
exports.runAll = async (url) => {

  const start = Date.now();

  try {
    // 🚀 Parallel scanning (FAST)
    const results = await Promise.all([
      sqli.check(url),
      xss.check(url),
      csrf.check(url),
      ssrf.check(url),
      headers.check(url),
      corsCheck.check(url),
      idor.check(url),
      lfi.check(url),
      vt.scan(url)
    ]);

    const end = Date.now();

    // 📊 Summary calculation
    const summary = {
      total: results.length,
      vulnerable: results.filter(r => r.vulnerable).length,
      critical: results.filter(r => r.severity === "Critical").length,
      high: results.filter(r => r.severity === "High").length,
      medium: results.filter(r => r.severity === "Medium").length,
      low: results.filter(r => r.severity === "Low").length
    };

    return {
      target: url,
      scan_time: (end - start) + " ms",
      summary,
      results
    };

  } catch (err) {
    console.error("Scanner error:", err);
    throw err;
  }
};