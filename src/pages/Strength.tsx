import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, Timer, Cpu, Zap, Lock } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
 
/* ─── Pure logic — unchanged ─── */
function calculateEntropy(pw: string) {
  let charset = 0;
  if (/[a-z]/.test(pw)) charset += 26;
  if (/[A-Z]/.test(pw)) charset += 26;
  if (/[0-9]/.test(pw)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) charset += 32;
  return pw.length * Math.log2(charset || 1);
}
 
function estimateCrackTime(entropy: number) {
  const guessesPerSecond = 1e9;
  const seconds = Math.pow(2, entropy) / guessesPerSecond;
  if (seconds < 60) return 'Instantly 😬';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
  return `${Math.floor(seconds / 31536000)} years 🔥`;
}
 
/* ─── Danger level derived from entropy ─── */
function getDangerLevel(entropy: number) {
  if (entropy < 28)  return { label: 'CRITICAL',   color: '#ff2d55', glow: 'rgba(255,45,85,0.5)',   bar: 0.10 };
  if (entropy < 40)  return { label: 'DANGEROUS',  color: '#ff6b35', glow: 'rgba(255,107,53,0.5)',  bar: 0.28 };
  if (entropy < 56)  return { label: 'MODERATE',   color: '#ffd60a', glow: 'rgba(255,214,10,0.5)',  bar: 0.50 };
  if (entropy < 72)  return { label: 'STRONG',     color: '#00e5ff', glow: 'rgba(0,229,255,0.5)',   bar: 0.74 };
  return               { label: 'FORTIFIED',  color: '#00ff9d', glow: 'rgba(0,255,157,0.5)',   bar: 1.00 };
}
 
/* ─── Animated number counter ─── */
const CountUp = ({ target, decimals = 2 }: { target: number; decimals?: number }) => {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef(0);
  const from = useRef(0);
 
  useEffect(() => {
    from.current = val;
    start.current = performance.now();
    const duration = 600;
    const tick = (now: number) => {
      const t = Math.min((now - start.current) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(from.current + (target - from.current) * ease);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
 
  return <>{val.toFixed(decimals)}</>;
};
 
/* ─── Scrolling binary rain column ─── */
const BinaryColumn = ({ x, delay, speed }: { x: number; delay: number; speed: number }) => {
  const chars = '01アイウエオカキクケコ'.split('');
  const count = 18;
  return (
    <div style={{
      position: 'absolute', left: x, top: 0,
      display: 'flex', flexDirection: 'column', gap: 2,
      animation: `rainFall ${speed}s ${delay}s linear infinite`,
      opacity: 0.12,
    }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 10, color: '#00ff9d',
          lineHeight: '14px',
        }}>
          {chars[Math.floor(Math.random() * chars.length)]}
        </span>
      ))}
    </div>
  );
};
 
const MatrixRain = () => {
  const columns = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      x: i * 44,
      delay: -(Math.random() * 8),
      speed: 4 + Math.random() * 4,
    })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {columns.map((c, i) => <BinaryColumn key={i} {...c} />)}
    </div>
  );
};
 
/* ─── Entropy arc ─── */
const EntropyArc = ({ entropy }: { entropy: number }) => {
  const max = 128;
  const pct = Math.min(entropy / max, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * 0.75; // 270° arc
  const fill = dash * pct;
  const level = getDangerLevel(entropy);
 
  return (
    <svg width={140} height={140} viewBox="0 0 140 140" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={level.color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={level.color} />
        </linearGradient>
        <filter id="arcGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* track */}
      <circle cx={70} cy={70} r={r}
        fill="none" stroke="rgba(0,255,157,0.07)" strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(135 70 70)"
      />
      {/* fill */}
      <motion.circle cx={70} cy={70} r={r}
        fill="none" stroke="url(#arcGrad)" strokeWidth={8}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform="rotate(135 70 70)"
        filter="url(#arcGlow)"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${fill} ${circ}` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      {/* center text */}
      <text x={70} y={64} textAnchor="middle"
        style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 18, fontWeight: 700, fill: level.color }}>
        <CountUp target={entropy} decimals={1} />
      </text>
      <text x={70} y={80} textAnchor="middle"
        style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 9, fill: 'rgba(0,255,157,0.4)', letterSpacing: 1 }}>
        BITS
      </text>
    </svg>
  );
};
 
/* ─── Crack time threat bar ─── */
const ThreatBar = ({ entropy }: { entropy: number }) => {
  const level = getDangerLevel(entropy);
  const ticks = ['INSTANT', '1 MIN', '1 HR', '1 DAY', '1 YEAR', '∞'];
 
  return (
    <div>
      <div style={{ position: 'relative', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginBottom: 8 }}>
        {/* rainbow track */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #ff2d55 0%, #ff6b35 20%, #ffd60a 40%, #00e5ff 70%, #00ff9d 100%)',
          opacity: 0.2,
        }} />
        <motion.div
          animate={{ width: `${level.bar * 100}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            background: `linear-gradient(90deg, #ff2d55, ${level.color})`,
            borderRadius: 4,
            boxShadow: `0 0 10px ${level.glow}`,
          }}
        />
        {/* thumb */}
        <motion.div
          animate={{ left: `calc(${level.bar * 100}% - 5px)` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'absolute', top: -2, width: 10, height: 12,
            borderRadius: 3, background: level.color,
            boxShadow: `0 0 8px ${level.glow}`,
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {ticks.map(t => (
          <span key={t} style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 8, color: 'rgba(0,255,157,0.3)', letterSpacing: 0.5 }}>{t}</span>
        ))}
      </div>
    </div>
  );
};
 
/* ─── Attack type rows ─── */
const ATTACK_TYPES = [
  { name: 'Dictionary Attack',     speedFactor: 0.001,  icon: '📖' },
  { name: 'Brute Force (CPU)',      speedFactor: 1,      icon: '💻' },
  { name: 'Brute Force (GPU)',      speedFactor: 100,    icon: '🖥️' },
  { name: 'Botnet Cluster',         speedFactor: 10000,  icon: '🌐' },
  { name: 'Nation-State ASIC',      speedFactor: 1e6,    icon: '🏛️' },
];
 
const AttackRow = ({ name, icon, speedFactor, entropy, index }: {
  name: string; icon: string; speedFactor: number; entropy: number; index: number;
}) => {
  const gps = 1e9 * speedFactor;
  const secs = Math.pow(2, entropy) / gps;
  let time: string;
  if (secs < 1)          time = '< 1 sec';
  else if (secs < 60)    time = `${secs.toFixed(0)} sec`;
  else if (secs < 3600)  time = `${(secs / 60).toFixed(0)} min`;
  else if (secs < 86400) time = `${(secs / 3600).toFixed(0)} hrs`;
  else if (secs < 3.15e7) time = `${(secs / 86400).toFixed(0)} days`;
  else                   time = `${(secs / 3.15e7).toFixed(0)} yrs`;
 
  const danger = secs < 3600;
  const safe   = secs > 3.15e7;
  const color  = danger ? '#ff2d55' : safe ? '#00ff9d' : '#ffd60a';
 
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 8, marginBottom: 7,
        background: `${color}08`,
        border: `1px solid ${color}22`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: 12, color: 'rgba(200,230,215,0.7)', letterSpacing: 0.3 }}>
          {name}
        </span>
      </div>
      <span style={{
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: 12, fontWeight: 700,
        color, letterSpacing: 1,
        textShadow: `0 0 8px ${color}80`,
      }}>
        {time}
      </span>
    </motion.div>
  );
};
 
/* ══════════════════ MAIN ══════════════════ */
export default function AttackSimulator() {
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
 
  const entropy   = useMemo(() => calculateEntropy(password), [password]);
  const crackTime = useMemo(() => estimateCrackTime(entropy), [entropy]);
  const level     = getDangerLevel(entropy);
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
 
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to   { background-position: 0 60px; }
        }
        @keyframes rainFall {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 0.12; }
          90%  { opacity: 0.12; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%     { opacity: 0; }
        }
        @keyframes hueShift {
          0%   { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
 
        .atk-input { background: transparent; border: none; outline: none; width: 100%; }
        .atk-input::placeholder { color: rgba(0,255,157,0.2); }
      `}</style>
 
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: '#000d06',
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,45,85,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 80% 80%, rgba(0,255,157,0.04) 0%, transparent 60%),
          linear-gradient(rgba(0,255,157,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,157,0.025) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, auto, 60px 60px, 60px 60px',
        animation: 'gridScroll 7s linear infinite',
      }} />
 
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }}>
        <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 20px' }}>
 
          {/* ── Header ── */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(255,45,85,0.1)',
                border: '1px solid rgba(255,45,85,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(255,45,85,0.15)',
              }}>
                <Cpu size={20} color="#ff2d55" />
              </div>
              <h1 style={{
                fontFamily: '"Orbitron", sans-serif',
                fontSize: 'clamp(20px, 4vw, 30px)',
                fontWeight: 900, color: '#e8fff4',
                textShadow: '0 0 30px rgba(255,45,85,0.3)',
                letterSpacing: 1,
              }}>
                Password <span style={{ color: '#ff2d55' }}>Attack</span> Simulator
              </h1>
            </div>
            <p style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 11, color: 'rgba(255,45,85,0.4)',
              letterSpacing: 2.5, textTransform: 'uppercase', marginLeft: 58,
            }}>
              // See how fast a hacker can crack your password
            </p>
            <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,45,85,0.35), transparent)', marginTop: 16 }} />
          </motion.div>
 
          {/* ── Input card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              borderRadius: 14,
              background: 'rgba(0,12,8,0.88)',
              border: '1px solid rgba(255,45,85,0.22)',
              backdropFilter: 'blur(20px)',
              padding: 22, marginBottom: 20,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ height: 1, background: 'linear-gradient(90deg, #ff2d55, #ff6b35, transparent)', marginBottom: 18 }} />
            <div style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 10, color: 'rgba(255,45,85,0.5)',
              letterSpacing: 2.5, marginBottom: 14, textTransform: 'uppercase',
            }}>
              // Target Password
            </div>
 
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px',
              background: 'rgba(255,45,85,0.04)',
              border: '1px solid rgba(255,45,85,0.15)',
              borderRadius: 9,
            }}>
              <Lock size={14} color="rgba(255,45,85,0.4)" style={{ flexShrink: 0 }} />
              <input
                type={show ? 'text' : 'password'}
                placeholder="Enter password to analyze..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="atk-input"
                style={{
                  color: '#e8fff4',
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 15, letterSpacing: show ? 0.5 : 3,
                }}
              />
              <button
                onClick={() => setShow(s => !s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,45,85,0.5)', padding: 0 }}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </motion.div>
 
          {/* ── Results ── */}
          <AnimatePresence>
            {password && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
 
                {/* Entropy + Crack time — side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
 
                  {/* Entropy arc card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    style={{
                      borderRadius: 14,
                      background: 'rgba(0,12,8,0.88)',
                      border: `1px solid ${level.color}35`,
                      backdropFilter: 'blur(20px)',
                      padding: 22,
                      textAlign: 'center',
                      boxShadow: `0 0 30px ${level.glow}15`,
                      transition: 'border-color 0.4s, box-shadow 0.4s',
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${level.color}, transparent)`, marginBottom: 18, transition: 'background 0.4s' }} />
                    <div style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 10, color: `${level.color}70`,
                      letterSpacing: 2.5, marginBottom: 16,
                      textTransform: 'uppercase',
                    }}>
                      <Shield size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                      Entropy
                    </div>
 
                    <EntropyArc entropy={entropy} />
 
                    <motion.p
                      key={level.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        fontFamily: '"Orbitron", sans-serif',
                        fontSize: 13, fontWeight: 900,
                        color: level.color,
                        textShadow: `0 0 12px ${level.glow}`,
                        letterSpacing: 2.5, marginTop: 10,
                      }}
                    >
                      {level.label}
                    </motion.p>
                  </motion.div>
 
                  {/* Crack time card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      borderRadius: 14,
                      background: 'rgba(12,0,4,0.88)',
                      border: '1px solid rgba(255,45,85,0.25)',
                      backdropFilter: 'blur(20px)',
                      padding: 22,
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {/* matrix rain */}
                    <MatrixRain />
 
                    <div style={{ height: 1, background: 'linear-gradient(90deg, #ff2d55, #ff6b35, transparent)', marginBottom: 18 }} />
                    <div style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 10, color: 'rgba(255,45,85,0.5)',
                      letterSpacing: 2.5, marginBottom: 20,
                      textTransform: 'uppercase', position: 'relative',
                    }}>
                      <Timer size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                      Crack Time (GPU)
                    </div>
 
                    <motion.p
                      key={crackTime}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontFamily: '"Orbitron", sans-serif',
                        fontSize: 'clamp(16px, 3.5vw, 24px)',
                        fontWeight: 900,
                        color: '#ff2d55',
                        textShadow: '0 0 20px rgba(255,45,85,0.7)',
                        lineHeight: 1.2,
                        marginBottom: 24,
                        position: 'relative',
                      }}
                    >
                      {crackTime}
                    </motion.p>
 
                    <ThreatBar entropy={entropy} />
 
                    <div style={{
                      marginTop: 16, padding: '8px 12px', borderRadius: 7,
                      background: 'rgba(255,45,85,0.06)',
                      border: '1px solid rgba(255,45,85,0.15)',
                      position: 'relative',
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: '"Share Tech Mono", monospace',
                        fontSize: 10, color: 'rgba(255,45,85,0.5)', letterSpacing: 1.5,
                      }}>
                        <Zap size={9} color="#ff6b35" />
                        ~1 billion guesses/sec assumed
                      </div>
                    </div>
                  </motion.div>
                </div>
 
                {/* Attack simulation table */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  style={{
                    borderRadius: 14,
                    background: 'rgba(0,12,8,0.88)',
                    border: '1px solid rgba(255,107,53,0.2)',
                    backdropFilter: 'blur(20px)',
                    padding: 22,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ height: 1, background: 'linear-gradient(90deg, #ff6b35, #ffd60a, transparent)', marginBottom: 18 }} />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 10, color: 'rgba(255,107,53,0.6)',
                    letterSpacing: 2.5, textTransform: 'uppercase',
                  }}>
                    <Cpu size={11} color="#ff6b35" />
                    Attack Simulation — Multi-Vector Analysis
                  </div>
 
                  {ATTACK_TYPES.map((a, i) => (
                    <AttackRow key={a.name} {...a} entropy={entropy} index={i} />
                  ))}
 
                  <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(255,107,53,0.05)',
                    border: '1px solid rgba(255,107,53,0.12)',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 11, color: 'rgba(200,160,100,0.5)',
                    lineHeight: 1.6, letterSpacing: 0.3,
                  }}>
                    // Times are estimates based on theoretical maximum speeds. Real-world results vary with hashing algorithm, hardware, and password constraints.
                  </div>
                </motion.div>
 
              </motion.div>
            )}
          </AnimatePresence>
 
          {/* Empty state */}
          <AnimatePresence>
            {!password && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', paddingTop: 56 }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                  background: 'rgba(255,45,85,0.08)',
                  border: '1px solid rgba(255,45,85,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(255,45,85,0.1)',
                  animation: 'blink 3s ease-in-out infinite',
                }}>
                  <Cpu size={32} color="rgba(255,45,85,0.5)" />
                </div>
                <p style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 12, color: 'rgba(255,45,85,0.35)',
                  letterSpacing: 2.5, textTransform: 'uppercase',
                }}>
                  // Awaiting target password
                </p>
                <p style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 10, color: 'rgba(255,45,85,0.2)',
                  letterSpacing: 1.5, marginTop: 6,
                }}>
                  Enter a password to begin attack simulation
                </p>
              </motion.div>
            )}
          </AnimatePresence>
 
        </div>
      </div>
    </>
  );
}
