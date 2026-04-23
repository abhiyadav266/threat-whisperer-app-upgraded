import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ShieldAlert, ShieldCheck, Terminal, Crosshair, Zap, Radio } from 'lucide-react';
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
 
/* ─── Typing effect for terminal lines ─── */
const TypingLine = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) clearInterval(iv);
      }, 22);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span style={{ animation: 'blink 0.7s step-end infinite', color: '#00ff9d' }}>█</span>
      )}
    </span>
  );
};
 
/* ─── Animated radar ring ─── */
const RadarRing = () => (
  <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 28px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        position: 'absolute', inset: 0,
        border: '1px solid rgba(0,255,157,0.25)',
        borderRadius: '50%',
        animation: `radarPulse 2.4s ${i * 0.8}s ease-out infinite`,
      }} />
    ))}
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Crosshair size={40} color="#00ff9d" style={{ filter: 'drop-shadow(0 0 8px #00ff9d)' }} />
    </div>
    {/* sweep line */}
    <div style={{
      position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '50%', height: 1,
        background: 'linear-gradient(90deg, rgba(0,255,157,0.8), transparent)',
        transformOrigin: '0% 50%',
        animation: 'radarSweep 2.4s linear infinite',
      }} />
    </div>
  </div>
);
 
/* ─── Loading terminal ─── */
const ScanningTerminal = () => {
  const lines = [
    '> Initializing scan engine...',
    '> Resolving DNS records...',
    '> Mapping attack surface...',
    '> Running CVE checks...',
    '> Analyzing HTTP headers...',
    '> Testing injection vectors...',
  ];
  const [visibleLines, setVisibleLines] = useState<number[]>([0]);
  useEffect(() => {
    const intervals = lines.map((_, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i + 1]), i * 900 + 500)
    );
    return () => intervals.forEach(clearTimeout);
  }, []);
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      style={{
        borderRadius: 14,
        background: 'rgba(0,12,8,0.9)',
        border: '1px solid rgba(0,255,157,0.2)',
        padding: 28,
        fontFamily: '"Share Tech Mono", monospace',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* terminal titlebar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 20, paddingBottom: 14,
        borderBottom: '1px solid rgba(0,255,157,0.1)',
      }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(0,255,157,0.5)', letterSpacing: 2 }}>
          SECURESCАН // ACTIVE SCAN
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Radio size={11} color="#00ff9d" style={{ animation: 'blink 1s step-end infinite' }} />
          <span style={{ fontSize: 10, color: '#00ff9d', letterSpacing: 1.5 }}>LIVE</span>
        </div>
      </div>
 
      <div style={{ minHeight: 160 }}>
        {lines.slice(0, visibleLines.length).map((line, i) => (
          <div key={i} style={{ marginBottom: 8, fontSize: 13, color: 'rgba(0,255,157,0.8)' }}>
            {i < visibleLines.length - 1
              ? <span style={{ color: 'rgba(0,255,157,0.5)' }}>{line}</span>
              : <TypingLine text={line} />}
          </div>
        ))}
      </div>
 
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Loader2 size={14} color="#00ff9d" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 12, color: 'rgba(0,255,157,0.6)', letterSpacing: 1.5 }}>
          RUNNING SECURITY CHECKS...
        </span>
      </div>
    </motion.div>
  );
};
 
/* ─── Severity colors ─── */
const SEVERITY_COLOR: Record<string, string> = {
  Critical: '#ff2d55',
  High:     '#ff6b35',
  Medium:   '#ffd60a',
  Low:      '#00ff9d',
  Info:     '#00e5ff',
};
 
/* ─── Summary stat tile ─── */
const SummaryTile = ({
  label, value, color, delay
}: { label: string; value: number; color: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring', stiffness: 130 }}
    style={{
      borderRadius: 12, padding: '18px 20px',
      background: 'rgba(0,14,9,0.8)',
      border: `1px solid ${color}40`,
      backdropFilter: 'blur(16px)',
      boxShadow: `0 0 20px ${color}18`,
      position: 'relative', overflow: 'hidden',
    }}
  >
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
    }} />
    <p style={{
      fontSize: 32, fontWeight: 700,
      color, fontFamily: '"Share Tech Mono", monospace',
      textShadow: `0 0 16px ${color}99`,
      lineHeight: 1,
    }}>
      {value}
    </p>
    <p style={{
      fontSize: 10, color: `${color}99`,
      letterSpacing: 2.5, textTransform: 'uppercase',
      fontFamily: '"Share Tech Mono", monospace',
      marginTop: 6,
    }}>
      {label}
    </p>
  </motion.div>
);
 
/* ─── Result card ─── */
const ResultCard = ({ r, index }: { r: any; index: number }) => {
  const [open, setOpen] = useState(false);
  const color = SEVERITY_COLOR[r.severity] || '#00ff9d';
 
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{
        borderRadius: 12,
        background: 'rgba(0,12,8,0.75)',
        border: `1px solid ${r.vulnerable ? color + '50' : 'rgba(0,255,157,0.15)'}`,
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: r.vulnerable ? `0 0 24px ${color}18` : 'none',
      }}
      onClick={() => setOpen(o => !o)}
    >
      {/* top accent bar */}
      {r.vulnerable && (
        <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      )}
 
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {r.vulnerable
              ? <ShieldAlert size={18} color="#ff2d55" style={{ filter: 'drop-shadow(0 0 6px #ff2d55)' }} />
              : <ShieldCheck size={18} color="#00ff9d" style={{ filter: 'drop-shadow(0 0 6px #00ff9d)' }} />}
            <span style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 14, fontWeight: 600, color: '#e8fff4',
              letterSpacing: 0.5,
            }}>
              {r.type}
            </span>
          </div>
 
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* CVSS pill */}
            <div style={{
              padding: '3px 10px', borderRadius: 100,
              background: `${color}18`, border: `1px solid ${color}40`,
              fontSize: 11, color, fontFamily: '"Share Tech Mono", monospace',
              letterSpacing: 1,
            }}>
              CVSS {r.cvss}
            </div>
 
            {/* status */}
            <div style={{
              padding: '3px 10px', borderRadius: 100,
              background: r.vulnerable ? 'rgba(255,45,85,0.12)' : 'rgba(0,255,157,0.08)',
              border: `1px solid ${r.vulnerable ? '#ff2d5560' : '#00ff9d40'}`,
              fontSize: 11,
              color: r.vulnerable ? '#ff2d55' : '#00ff9d',
              fontFamily: '"Share Tech Mono", monospace',
              letterSpacing: 1,
            }}>
              {r.vulnerable ? 'VULNERABLE' : 'SECURE'}
            </div>
 
            <SeverityBadge severity={r.severity} />
          </div>
        </div>
 
        {/* expand hint */}
        <div style={{
          marginTop: 8, fontSize: 10,
          color: 'rgba(0,255,157,0.35)',
          fontFamily: '"Share Tech Mono", monospace',
          letterSpacing: 1.5,
        }}>
          {open ? '▲ COLLAPSE' : '▼ EXPAND DETAILS'}
        </div>
      </div>
 
      {/* Expanded details */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 20px 20px',
              borderTop: '1px solid rgba(0,255,157,0.08)',
              paddingTop: 16,
              display: 'grid', gap: 10,
            }}>
              {r.description && (
                <div style={{ fontSize: 13, color: 'rgba(180,220,200,0.8)', lineHeight: 1.6 }}>
                  {r.description}
                </div>
              )}
              {r.impact && (
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: '#ff6b35', fontFamily: '"Share Tech Mono", monospace', fontSize: 11, letterSpacing: 1, marginRight: 8 }}>
                    IMPACT //
                  </span>
                  <span style={{ color: 'rgba(180,220,200,0.7)' }}>{r.impact}</span>
                </div>
              )}
              {r.mitigation && (
                <div style={{
                  fontSize: 13, padding: '10px 14px',
                  background: 'rgba(0,255,157,0.05)',
                  border: '1px solid rgba(0,255,157,0.15)',
                  borderRadius: 8,
                }}>
                  <span style={{ color: '#00ff9d', fontFamily: '"Share Tech Mono", monospace', fontSize: 11, letterSpacing: 1, marginRight: 8 }}>
                    FIX //
                  </span>
                  <span style={{ color: 'rgba(180,220,200,0.7)' }}>{r.mitigation}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
 
/* ══════════════════ SCANNER ══════════════════ */
export default function Scanner() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
 
  const scan = async () => {
    if (!url || !url.startsWith('http')) {
      alert('⚠️ Enter valid URL');
      return;
    }
    try {
      setLoading(true);
      setResults([]);
      setSummary(null);
 
      const res = await fetch('http://localhost:5000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
 
      const safeResults = (data?.data?.results || []).map((r: any) => ({
        type: r.type || 'Unknown',
        severity: r.severity || 'Info',
        vulnerable: r.vulnerable ?? false,
        cvss: r.cvss ?? 0,
        description: r.description || '',
        impact: r.impact || '',
        mitigation: r.mitigation || '',
        references: r.references || '',
      }));
 
      setResults(safeResults);
      setSummary(data?.data?.summary || null);
    } catch {
      alert('Scan failed');
    } finally {
      setLoading(false);
    }
  };
 
  const chartData = {
    labels: results.map(r => r.type),
    datasets: [{
      label: 'CVSS Score',
      data: results.map(r => r.cvss || 0),
      backgroundColor: results.map(r => (SEVERITY_COLOR[r.severity] || '#00ff9d') + '55'),
      borderColor: results.map(r => SEVERITY_COLOR[r.severity] || '#00ff9d'),
      borderWidth: 1,
      borderRadius: 6,
    }],
  };
 
  const chartOptions = {
    plugins: {
      legend: { labels: { color: 'rgba(0,255,157,0.6)', font: { family: 'Share Tech Mono' } } },
      tooltip: {
        backgroundColor: 'rgba(0,14,9,0.95)',
        borderColor: 'rgba(0,255,157,0.3)',
        borderWidth: 1,
        titleColor: '#00ff9d',
        bodyColor: 'rgba(180,220,200,0.8)',
        titleFont: { family: 'Share Tech Mono' },
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgba(0,255,157,0.5)', font: { family: 'Share Tech Mono', size: 10 } },
        grid: { color: 'rgba(0,255,157,0.06)' },
      },
      y: {
        ticks: { color: 'rgba(0,255,157,0.5)', font: { family: 'Share Tech Mono', size: 10 } },
        grid: { color: 'rgba(0,255,157,0.06)' },
      },
    },
  };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
 
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes radarPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes gridScroll {
          0%   { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        @keyframes inputGlow {
          0%,100% { box-shadow: 0 0 12px rgba(0,255,157,0.2); }
          50%      { box-shadow: 0 0 24px rgba(0,255,157,0.4); }
        }
      `}</style>
 
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #002a1a 0%, #000d06 60%, #000 100%)',
        backgroundImage: `
          radial-gradient(ellipse 70% 50% at 50% 0%, #002a1a 0%, #000d06 60%, #000 100%),
          linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 60px 60px, 60px 60px',
        animation: 'gridScroll 6s linear infinite',
      }} />
 
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px' }}>
 
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: 36 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(0,255,157,0.1)',
                border: '1px solid rgba(0,255,157,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Terminal size={18} color="#00ff9d" />
              </div>
              <div>
                <h1 style={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontSize: 'clamp(22px, 4vw, 34px)',
                  fontWeight: 900, color: '#e8fff4',
                  textShadow: '0 0 30px rgba(0,255,157,0.3)',
                  letterSpacing: 1,
                }}>
                  Vulnerability <span style={{ color: '#00ff9d' }}>Scanner</span>
                </h1>
              </div>
            </div>
            <p style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 12, color: 'rgba(0,255,157,0.45)',
              letterSpacing: 2.5, textTransform: 'uppercase',
              marginLeft: 52,
            }}>
              // Scan targets and detect security vulnerabilities
            </p>
            <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(0,255,157,0.3), transparent)', marginTop: 16 }} />
          </motion.div>
 
          {/* ── Input ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              borderRadius: 14,
              background: 'rgba(0,14,9,0.85)',
              border: `1px solid ${focused ? 'rgba(0,255,157,0.5)' : 'rgba(0,255,157,0.2)'}`,
              backdropFilter: 'blur(20px)',
              padding: 20,
              marginBottom: 28,
              transition: 'border-color 0.25s',
              boxShadow: focused ? '0 0 30px rgba(0,255,157,0.12)' : 'none',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* corner brackets */}
            {[
              { top: 10, left: 10, borderTop: true, borderLeft: true },
              { top: 10, right: 10, borderTop: true, borderRight: true },
              { bottom: 10, left: 10, borderBottom: true, borderLeft: true },
              { bottom: 10, right: 10, borderBottom: true, borderRight: true },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute', width: 12, height: 12,
                ...(s.top !== undefined ? { top: s.top } : { bottom: s.bottom }),
                ...(s.left !== undefined ? { left: s.left } : { right: s.right }),
                borderTop: s.borderTop ? '1.5px solid rgba(0,255,157,0.4)' : 'none',
                borderLeft: s.borderLeft ? '1.5px solid rgba(0,255,157,0.4)' : 'none',
                borderBottom: s.borderBottom ? '1.5px solid rgba(0,255,157,0.4)' : 'none',
                borderRight: s.borderRight ? '1.5px solid rgba(0,255,157,0.4)' : 'none',
              }} />
            ))}
 
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                flex: 1, padding: '10px 14px',
                background: 'rgba(0,255,157,0.04)',
                border: '1px solid rgba(0,255,157,0.15)',
                borderRadius: 8,
              }}>
                <Zap size={14} color="rgba(0,255,157,0.5)" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="https://target.com"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && scan()}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: '#e8fff4', fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 14, letterSpacing: 0.5,
                  }}
                />
              </div>
 
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={scan}
                disabled={loading}
                style={{
                  padding: '11px 28px',
                  borderRadius: 8,
                  background: loading
                    ? 'rgba(0,255,157,0.1)'
                    : 'linear-gradient(135deg, #00ff9d, #00c97a)',
                  border: '1px solid rgba(0,255,157,0.4)',
                  color: loading ? '#00ff9d' : '#001a0d',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 13, fontWeight: 700,
                  letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase',
                  boxShadow: loading ? 'none' : '0 0 20px rgba(0,255,157,0.35)',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                    Scanning...
                  </span>
                ) : '▶ Scan'}
              </motion.button>
            </div>
          </motion.div>
 
          {/* ── Loading terminal ── */}
          <AnimatePresence>
            {loading && <ScanningTerminal />}
          </AnimatePresence>
 
          {/* ── Results ── */}
          <AnimatePresence>
            {!loading && results.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
 
                {/* Summary tiles */}
                {summary && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: 14, marginBottom: 24,
                  }}>
                    <SummaryTile label="Critical" value={summary.critical || 0} color="#ff2d55" delay={0.0} />
                    <SummaryTile label="High"     value={summary.high     || 0} color="#ff6b35" delay={0.07} />
                    <SummaryTile label="Medium"   value={summary.medium   || 0} color="#ffd60a" delay={0.14} />
                    <SummaryTile label="Low"      value={summary.low      || 0} color="#00ff9d" delay={0.21} />
                  </div>
                )}
 
                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    borderRadius: 14,
                    background: 'rgba(0,14,9,0.85)',
                    border: '1px solid rgba(0,255,157,0.18)',
                    backdropFilter: 'blur(20px)',
                    padding: 24, marginBottom: 24,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ height: 2, background: 'linear-gradient(90deg, #00ff9d, #00e5ff, transparent)', marginBottom: 20 }} />
                  <div style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 11, color: 'rgba(0,255,157,0.5)',
                    letterSpacing: 2.5, textTransform: 'uppercase',
                    marginBottom: 16,
                  }}>
                    // CVSS Score Distribution
                  </div>
                  <Bar data={chartData} options={chartOptions as any} />
                </motion.div>
 
                {/* Section label */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginBottom: 16,
                }}>
                  <span style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 11, letterSpacing: 3,
                    color: 'rgba(0,255,157,0.5)',
                    textTransform: 'uppercase',
                  }}>
                    // FINDINGS — {results.length} entries
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(0,255,157,0.2), transparent)' }} />
                </div>
 
                {/* Result cards */}
                <div style={{ display: 'grid', gap: 12 }}>
                  {results.map((r, i) => (
                    <ResultCard key={i} r={r} index={i} />
                  ))}
                </div>
 
              </motion.div>
            )}
          </AnimatePresence>
 
          {/* ── Empty state ── */}
          <AnimatePresence>
            {!loading && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                style={{ textAlign: 'center', paddingTop: 48 }}
              >
                <RadarRing />
                <p style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 13, color: 'rgba(0,255,157,0.4)',
                  letterSpacing: 2, textTransform: 'uppercase',
                }}>
                  Enter a target URL to begin scanning
                </p>
                <p style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 11, color: 'rgba(0,255,157,0.2)',
                  letterSpacing: 1.5, marginTop: 8,
                }}>
                  // Awaiting target acquisition
                </p>
              </motion.div>
            )}
          </AnimatePresence>
 
        </div>
      </div>
    </>
  );
}
