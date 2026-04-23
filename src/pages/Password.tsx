import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, Eye, EyeOff, ShieldAlert, ShieldCheck, Lock, Zap, AlertTriangle } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
 
/* ─── Strength config ─── */
const STRENGTH_LEVELS = [
  { label: 'CRITICAL',    color: '#ff2d55', glow: 'rgba(255,45,85,0.4)',   bg: 'rgba(255,45,85,0.12)'   },
  { label: 'WEAK',        color: '#ff6b35', glow: 'rgba(255,107,53,0.4)',  bg: 'rgba(255,107,53,0.12)'  },
  { label: 'MODERATE',    color: '#ffd60a', glow: 'rgba(255,214,10,0.4)',  bg: 'rgba(255,214,10,0.12)'  },
  { label: 'STRONG',      color: '#00e5ff', glow: 'rgba(0,229,255,0.4)',   bg: 'rgba(0,229,255,0.12)'   },
  { label: 'FORTIFIED',   color: '#00ff9d', glow: 'rgba(0,255,157,0.5)',   bg: 'rgba(0,255,157,0.12)'   },
];
 
/* ─── Animated strength bar segment ─── */
const StrengthBar = ({ strength }: { strength: number }) => {
  const level = STRENGTH_LEVELS[Math.min(strength, 4)];
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          animate={{
            background: i < strength ? level.color : 'rgba(255,255,255,0.07)',
            boxShadow: i < strength ? `0 0 8px ${level.glow}` : 'none',
          }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          style={{ flex: 1, height: 6, borderRadius: 4 }}
        />
      ))}
    </div>
  );
};
 
/* ─── Rule row ─── */
const RuleRow = ({ label, passed }: { label: string; passed: boolean }) => (
  <motion.div
    animate={{ opacity: 1 }}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 8,
      background: passed ? 'rgba(0,255,157,0.05)' : 'rgba(255,45,85,0.04)',
      border: `1px solid ${passed ? 'rgba(0,255,157,0.15)' : 'rgba(255,45,85,0.12)'}`,
      marginBottom: 7,
      transition: 'background 0.3s, border-color 0.3s',
    }}
  >
    <motion.div
      animate={{ scale: passed ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: 20, height: 20, borderRadius: '50%',
        background: passed ? 'rgba(0,255,157,0.15)' : 'rgba(255,45,85,0.12)',
        border: `1px solid ${passed ? '#00ff9d' : '#ff2d55'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {passed
        ? <Check size={11} color="#00ff9d" strokeWidth={3} />
        : <X size={11} color="#ff2d55" strokeWidth={3} />}
    </motion.div>
    <span style={{
      fontSize: 12,
      color: passed ? 'rgba(0,255,157,0.8)' : 'rgba(180,100,100,0.8)',
      fontFamily: '"Share Tech Mono", monospace',
      letterSpacing: 0.5,
      transition: 'color 0.3s',
    }}>
      {label}
    </span>
    {passed && (
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ marginLeft: 'auto', fontSize: 10, color: '#00ff9d', fontFamily: '"Share Tech Mono", monospace', letterSpacing: 1 }}
      >
        OK
      </motion.div>
    )}
  </motion.div>
);
 
/* ─── Entropy visualizer ─── */
const EntropyMeter = ({ password }: { password: string }) => {
  const entropy = Math.min(Math.round((new Set(password).size / 94) * 100 * (password.length / 12)), 100);
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, color: 'rgba(0,229,255,0.6)', letterSpacing: 2 }}>
          // ENTROPY
        </span>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 12, color: '#00e5ff' }}>
          {entropy}%
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'rgba(0,229,255,0.1)', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${entropy}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: 2,
            background: 'linear-gradient(90deg, #00e5ff, #7b61ff)',
            boxShadow: '0 0 8px rgba(0,229,255,0.5)',
          }}
        />
      </div>
    </div>
  );
};
 
/* ── Character type distribution dots ── */
const CharDots = ({ password }: { password: string }) => {
  const chars = password.split('').slice(0, 32);
  const getColor = (c: string) => {
    if (/[A-Z]/.test(c)) return '#00e5ff';
    if (/[a-z]/.test(c)) return '#00ff9d';
    if (/[0-9]/.test(c)) return '#ffd60a';
    return '#ff6b35';
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, minHeight: 24 }}>
      {chars.map((c, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.02 }}
          title={c}
          style={{
            width: 8, height: 8, borderRadius: 2,
            background: getColor(c),
            boxShadow: `0 0 4px ${getColor(c)}80`,
          }}
        />
      ))}
    </div>
  );
};
 
/* ══════════════════ MAIN COMPONENT ══════════════════ */
export default function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [breach, setBreach] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
 
  const rules: Record<string, boolean> = {
    length: password.length >= 10,
    upper:  /[A-Z]/.test(password),
    lower:  /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
 
  useEffect(() => {
    let score = 0;
    Object.values(rules).forEach(v => v && score++);
    setStrength(score);
    setBreach(null);
  }, [password]);
 
  const level = STRENGTH_LEVELS[Math.min(strength, 4)];
 
  const suggestions: string[] = [];
  if (!rules.length) suggestions.push('Use at least 10 characters');
  if (!rules.upper)  suggestions.push('Add an uppercase letter');
  if (!rules.lower)  suggestions.push('Add a lowercase letter');
  if (!rules.number) suggestions.push('Add numbers');
  if (!rules.symbol) suggestions.push('Add a special character (!@#$...)');
 
  const checkBreach = async () => {
    if (!password) return;
    setLoading(true);
    setBreach(null);
    try {
      const res = await fetch('http://localhost:5000/check-breach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setBreach(data.breached ? data.count : 0);
    } catch {
      setBreach(-1);
    }
    setLoading(false);
  };
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
 
        @keyframes gridScroll {
          0%   { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes pulseGlow {
          0%,100% { opacity: 0.6; }
          50%     { opacity: 1; }
        }
        @keyframes scanLine {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
 
        .pw-input::placeholder { color: rgba(0,255,157,0.25); }
        .pw-input:focus { outline: none; }
      `}</style>
 
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: '#000d06',
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0,229,255,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,255,157,0.04) 0%, transparent 60%),
          linear-gradient(rgba(0,255,157,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,157,0.025) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, auto, 60px 60px, 60px 60px',
        animation: 'gridScroll 8s linear infinite',
      }} />
 
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px' }}>
 
          {/* ── Header ── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(0,229,255,0.1)',
                border: '1px solid rgba(0,229,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0,229,255,0.15)',
              }}>
                <Lock size={20} color="#00e5ff" />
              </div>
              <h1 style={{
                fontFamily: '"Orbitron", sans-serif',
                fontSize: 'clamp(20px, 4vw, 32px)',
                fontWeight: 900, color: '#e8fff4',
                textShadow: '0 0 30px rgba(0,229,255,0.3)',
                letterSpacing: 1,
              }}>
                Password <span style={{ color: '#00e5ff' }}>Security</span> Checker
              </h1>
            </div>
            <p style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 11, color: 'rgba(0,229,255,0.4)',
              letterSpacing: 2.5, textTransform: 'uppercase', marginLeft: 58,
            }}>
              // Strength analysis & breach exposure detection
            </p>
            <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(0,229,255,0.3), transparent)', marginTop: 16 }} />
          </motion.div>
 
          {/* ── Top row: Input + Strength ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
 
            {/* Input card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                borderRadius: 14,
                background: 'rgba(0,12,10,0.85)',
                border: '1px solid rgba(0,229,255,0.2)',
                backdropFilter: 'blur(20px)',
                padding: 22,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ height: 1, background: 'linear-gradient(90deg, #00e5ff, transparent)', marginBottom: 18 }} />
              <div style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 10, color: 'rgba(0,229,255,0.5)',
                letterSpacing: 2.5, marginBottom: 12, textTransform: 'uppercase',
              }}>
                // Password Input
              </div>
 
              {/* input row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: 'rgba(0,229,255,0.04)',
                border: '1px solid rgba(0,229,255,0.15)',
                borderRadius: 9,
                marginBottom: 16,
              }}>
                <Lock size={13} color="rgba(0,229,255,0.4)" style={{ flexShrink: 0 }} />
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Enter secure password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pw-input"
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    color: '#e8fff4',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 14, letterSpacing: show ? 0.5 : 3,
                  }}
                />
                <button
                  onClick={() => setShow(s => !s)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(0,229,255,0.5)' }}
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
 
              {/* char dots */}
              {password && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 10, color: 'rgba(0,229,255,0.4)', letterSpacing: 2, marginBottom: 6 }}>
                    // CHARACTER MAP
                  </div>
                  <CharDots password={password} />
                  <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                    {[['#00e5ff','Upper'],['#00ff9d','Lower'],['#ffd60a','Num'],['#ff6b35','Symbol']].map(([c,l]) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 1, background: c }} />
                        <span style={{ fontSize: 9, color: 'rgba(180,200,190,0.5)', fontFamily: '"Share Tech Mono", monospace' }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
 
              {password && <EntropyMeter password={password} />}
            </motion.div>
 
            {/* Strength card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                borderRadius: 14,
                background: 'rgba(0,12,10,0.85)',
                border: `1px solid ${level.color}40`,
                backdropFilter: 'blur(20px)',
                padding: 22,
                position: 'relative', overflow: 'hidden',
                boxShadow: password ? `0 0 28px ${level.glow}18` : 'none',
                transition: 'border-color 0.4s, box-shadow 0.4s',
              }}
            >
              <div style={{ height: 1, background: `linear-gradient(90deg, ${level.color}, transparent)`, marginBottom: 18, transition: 'background 0.4s' }} />
              <div style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 10, color: `${level.color}80`,
                letterSpacing: 2.5, marginBottom: 20, textTransform: 'uppercase',
                transition: 'color 0.4s',
              }}>
                // Strength Analysis
              </div>
 
              {/* Big label */}
              <div style={{ marginBottom: 20, textAlign: 'center' }}>
                <motion.p
                  key={level.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: 28, fontWeight: 900,
                    color: level.color,
                    textShadow: `0 0 20px ${level.glow}`,
                    letterSpacing: 3,
                    transition: 'color 0.4s',
                  }}
                >
                  {password ? level.label : '—'}
                </motion.p>
                <p style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 11, color: 'rgba(180,220,200,0.4)',
                  marginTop: 4, letterSpacing: 1,
                }}>
                  {password ? `${strength} / 5 criteria met` : 'Enter a password'}
                </p>
              </div>
 
              <StrengthBar strength={strength} />
 
              {/* Score arc */}
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(0,229,255,0.05)',
                  border: '1px solid rgba(0,229,255,0.12)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 20, fontWeight: 700, color: '#00e5ff' }}>
                    {password.length}
                  </p>
                  <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, color: 'rgba(0,229,255,0.5)', letterSpacing: 1.5 }}>CHARS</p>
                </div>
                <div style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(0,255,157,0.05)',
                  border: '1px solid rgba(0,255,157,0.12)',
                  textAlign: 'center',
                }}>
                  <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 20, fontWeight: 700, color: '#00ff9d' }}>
                    {new Set(password).size}
                  </p>
                  <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, color: 'rgba(0,255,157,0.5)', letterSpacing: 1.5 }}>UNIQUE</p>
                </div>
              </div>
            </motion.div>
          </div>
 
          {/* ── Bottom row: Rules + Breach ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 
            {/* Left: Rules + Suggestions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 
              {/* Rules */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  borderRadius: 14,
                  background: 'rgba(0,12,10,0.85)',
                  border: '1px solid rgba(0,255,157,0.15)',
                  backdropFilter: 'blur(20px)',
                  padding: 22,
                }}
              >
                <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(0,255,157,0.4), transparent)', marginBottom: 18 }} />
                <div style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 10, color: 'rgba(0,255,157,0.5)',
                  letterSpacing: 2.5, marginBottom: 14, textTransform: 'uppercase',
                }}>
                  // Security Requirements
                </div>
 
                {Object.entries({
                  length: 'Min. 10 characters',
                  upper:  'Uppercase letter (A–Z)',
                  lower:  'Lowercase letter (a–z)',
                  number: 'Number (0–9)',
                  symbol: 'Special character (!@#$...)',
                }).map(([key, label]) => (
                  <RuleRow key={key} label={label} passed={rules[key]} />
                ))}
              </motion.div>
 
              {/* Suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      borderRadius: 14,
                      background: 'rgba(12,10,0,0.85)',
                      border: '1px solid rgba(255,214,10,0.2)',
                      backdropFilter: 'blur(20px)',
                      padding: 22, overflow: 'hidden',
                    }}
                  >
                    <div style={{ height: 1, background: 'linear-gradient(90deg, #ffd60a60, transparent)', marginBottom: 18 }} />
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 10, color: 'rgba(255,214,10,0.6)',
                      letterSpacing: 2.5, textTransform: 'uppercase',
                    }}>
                      <AlertTriangle size={12} color="#ffd60a" />
                      Recommendations
                    </div>
                    {suggestions.map((s, i) => (
                      <motion.div
                        key={s}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          fontSize: 12, color: 'rgba(255,214,10,0.7)',
                          fontFamily: '"Share Tech Mono", monospace',
                          marginBottom: 8, letterSpacing: 0.3,
                        }}
                      >
                        <Zap size={11} color="#ffd60a" />
                        {s}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
 
            {/* Right: Breach check */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                borderRadius: 14,
                background: 'rgba(0,12,10,0.85)',
                border: '1px solid rgba(255,45,85,0.2)',
                backdropFilter: 'blur(20px)',
                padding: 22,
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,45,85,0.5), transparent)', marginBottom: 18 }} />
              <div style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 10, color: 'rgba(255,45,85,0.5)',
                letterSpacing: 2.5, marginBottom: 20, textTransform: 'uppercase',
              }}>
                // Data Breach Detection
              </div>
 
              <p style={{
                fontSize: 12, color: 'rgba(180,160,160,0.6)',
                fontFamily: '"Share Tech Mono", monospace',
                lineHeight: 1.7, marginBottom: 20, letterSpacing: 0.3,
              }}>
                Cross-reference against known breach databases using k-anonymity hashing. Your password is never transmitted in full.
              </p>
 
              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={!password || loading}
                onClick={checkBreach}
                style={{
                  width: '100%', padding: '13px 0',
                  borderRadius: 9,
                  background: !password || loading
                    ? 'rgba(255,45,85,0.08)'
                    : 'linear-gradient(135deg, #ff2d55, #ff6b35)',
                  border: '1px solid rgba(255,45,85,0.4)',
                  color: !password || loading ? 'rgba(255,45,85,0.4)' : '#fff',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: 2.5, cursor: !password || loading ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase',
                  boxShadow: !password || loading ? 'none' : '0 0 20px rgba(255,45,85,0.35)',
                  transition: 'all 0.2s',
                  marginBottom: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                {loading
                  ? <><Loader2 size={14} style={{ animation: 'spinSlow 1s linear infinite' }} /> Querying databases...</>
                  : <><ShieldAlert size={14} /> Check Breach Exposure</>}
              </motion.button>
 
              {/* Result */}
              <AnimatePresence>
                {breach !== null && !loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      borderRadius: 10,
                      padding: '18px 20px',
                      textAlign: 'center',
                      background: breach > 0
                        ? 'rgba(255,45,85,0.08)'
                        : breach === 0 ? 'rgba(0,255,157,0.06)' : 'rgba(255,214,10,0.06)',
                      border: `1px solid ${breach > 0 ? 'rgba(255,45,85,0.3)' : breach === 0 ? 'rgba(0,255,157,0.25)' : 'rgba(255,214,10,0.25)'}`,
                    }}
                  >
                    {breach > 0 && (
                      <>
                        <ShieldAlert size={28} color="#ff2d55" style={{ margin: '0 auto 10px', filter: 'drop-shadow(0 0 8px #ff2d55)' }} />
                        <p style={{
                          fontFamily: '"Orbitron", sans-serif',
                          fontSize: 22, fontWeight: 900,
                          color: '#ff2d55',
                          textShadow: '0 0 16px rgba(255,45,85,0.6)',
                          marginBottom: 4,
                        }}>
                          {breach.toLocaleString()}
                        </p>
                        <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: 'rgba(255,45,85,0.7)', letterSpacing: 2 }}>
                          BREACH OCCURRENCES
                        </p>
                        <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: 'rgba(255,120,120,0.5)', marginTop: 8, letterSpacing: 0.5 }}>
                          This password has been compromised. Change it immediately.
                        </p>
                      </>
                    )}
                    {breach === 0 && (
                      <>
                        <ShieldCheck size={28} color="#00ff9d" style={{ margin: '0 auto 10px', filter: 'drop-shadow(0 0 8px #00ff9d)' }} />
                        <p style={{
                          fontFamily: '"Orbitron", sans-serif',
                          fontSize: 16, fontWeight: 900,
                          color: '#00ff9d',
                          textShadow: '0 0 16px rgba(0,255,157,0.5)',
                          letterSpacing: 2,
                        }}>
                          NOT FOUND
                        </p>
                        <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: 'rgba(0,255,157,0.5)', letterSpacing: 1.5, marginTop: 6 }}>
                          No known breach exposure detected
                        </p>
                      </>
                    )}
                    {breach === -1 && (
                      <>
                        <AlertTriangle size={28} color="#ffd60a" style={{ margin: '0 auto 10px' }} />
                        <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 12, color: '#ffd60a', letterSpacing: 1.5 }}>
                          CONNECTION ERROR
                        </p>
                        <p style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 11, color: 'rgba(255,214,10,0.5)', marginTop: 6 }}>
                          Could not reach backend
                        </p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
 
          </div>
        </div>
      </div>
    </>
  );
}
