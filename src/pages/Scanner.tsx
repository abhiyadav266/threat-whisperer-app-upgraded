import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import GlassCard from '@/components/GlassCard';
import SeverityBadge from '@/components/SeverityBadge';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Scanner() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const scan = async () => {
    if (!url || !url.startsWith("http")) {
      alert("⚠️ Enter valid URL");
      return;
    }

    try {
      setLoading(true);
      setResults([]);
      setSummary(null);

      const res = await fetch("http://localhost:5000/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      const safeResults = (data?.data?.results || []).map((r: any) => ({
        type: r.type || "Unknown",
        severity: r.severity || "Info",
        vulnerable: r.vulnerable ?? false,
        cvss: r.cvss ?? 0,
        description: r.description || "",
        impact: r.impact || "",
        mitigation: r.mitigation || "",
        references: r.references || ""
      }));

      setResults(safeResults);
      setSummary(data?.data?.summary || null);

    } catch {
      alert("Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: results.map(r => r.type),
    datasets: [
      {
        label: 'CVSS Score',
        data: results.map(r => r.cvss || 0),
      }
    ]
  };

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* 🔥 HEADER */}
        <h1 className="text-4xl font-bold mb-2 text-primary text-glow">
          🛡 Vulnerability Scanner
        </h1>
        <p className="text-muted-foreground mb-8">
          Scan targets and detect security vulnerabilities
        </p>

        {/* 🔍 INPUT */}
        <GlassCard className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="https://target.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && scan()}
              className="flex-1 p-3 rounded bg-secondary border text-foreground"
            />

            <button
              onClick={scan}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-primary to-emerald-400 rounded font-semibold"
            >
              {loading ? "Scanning..." : "Scan"}
            </button>
          </div>
        </GlassCard>

        {/* ⏳ LOADING */}
        <AnimatePresence>
          {loading && (
            <motion.div className="text-center py-6">
              <Loader2 className="animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">
                Running security checks...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📊 RESULTS */}
        {!loading && results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* 🔥 SUMMARY CARDS */}
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                <GlassCard>
                  <p className="text-red-400 font-bold text-xl">
                    {summary.critical || 0}
                  </p>
                  <p className="text-sm">Critical</p>
                </GlassCard>

                <GlassCard>
                  <p className="text-orange-400 font-bold text-xl">
                    {summary.high || 0}
                  </p>
                  <p className="text-sm">High</p>
                </GlassCard>

                <GlassCard>
                  <p className="text-yellow-400 font-bold text-xl">
                    {summary.medium || 0}
                  </p>
                  <p className="text-sm">Medium</p>
                </GlassCard>

                <GlassCard>
                  <p className="text-green-400 font-bold text-xl">
                    {summary.low || 0}
                  </p>
                  <p className="text-sm">Low</p>
                </GlassCard>

              </div>
            )}

            {/* 📊 CHART */}
            <GlassCard className="mb-6">
              <Bar data={chartData} />
            </GlassCard>

            {/* 🔥 RESULTS */}
            <div className="space-y-4">
              {results.map((r, i) => (
                <GlassCard key={i}>

                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">{r.type}</h3>
                    <SeverityBadge severity={r.severity} />
                  </div>

                  <p className="mb-2 flex items-center gap-2">
                    {r.vulnerable
                      ? <ShieldAlert className="text-red-400" />
                      : <ShieldCheck className="text-green-400" />}
                    {r.vulnerable ? "Vulnerable" : "Safe"}
                  </p>

                  <p className="text-sm mb-2">CVSS: {r.cvss}</p>

                  {r.description && <p className="text-sm">{r.description}</p>}
                  {r.impact && <p className="text-sm"><b>Impact:</b> {r.impact}</p>}
                  {r.mitigation && <p className="text-sm"><b>Fix:</b> {r.mitigation}</p>}

                </GlassCard>
              ))}
            </div>

          </motion.div>
        )}

        {/* EMPTY STATE */}
        {!loading && results.length === 0 && (
          <div className="text-center mt-10 text-muted-foreground">
            🚀 Enter a target URL to begin scanning
          </div>
        )}

      </div>
    </div>
  );
}