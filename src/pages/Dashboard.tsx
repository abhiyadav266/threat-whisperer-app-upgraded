import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { Bug, Lock, Gauge, AlertTriangle, History, ArrowRight, Shield, Activity } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
 
type StatsType = {
  scansToday: number;
  threatsBlocked: number;
  uptime: number;
};
 
const tools = [
  { title: 'Vulnerability Scanner', description: 'Scan URLs for vulnerabilities', icon: Bug, path: '/scanner', accent: '#00ff9d' },
  { title: 'Password Generator', description: 'Generate strong passwords', icon: Lock, path: '/password', accent: '#00e5ff' },
  { title: 'Strength Checker', description: 'Analyze password strength', icon: Gauge, path: '/strength', accent: '#7b61ff' },
  { title: 'Ransomware Guide', description: 'Learn protection strategies', icon: AlertTriangle, path: '/ransomware', accent: '#ff4d6d' },
  { title: 'Scan History', description: 'Track previous scans', icon: History, path: '/history', accent: '#ffd60a' },
];
 
/* ─── Scanline overlay ─── */
const Scanlines = () => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,157,0.015) 2px, rgba(0,255,157,0.015) 4px)',
      animation: 'scanMove 8s linear infinite',
    }}
  />
);
 
/* ─── Animated hex grid background ─── */
const HexGrid = () => (
  <svg
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.06, pointerEvents: 'none' }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="hex" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
        <polygon
          points="28,2 54,16 54,44 28,58 2,44 2,16"
          fill="none" stroke="#00ff9d" strokeWidth="0.8"
        />
        <polygon
          points="28,52 54,66 54,94 28,108 2,94 2,66"
          fill="none" stroke="#00ff9d" strokeWidth="0.8"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" />
  </svg>
);
 
/* ─── Particle field ─── */
const PARTICLE_COUNT = 28;
const Particles = () => {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      dur: Math.random() * 12 + 8,
      delay: Math.random() * -15,
    }))
  );
 
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.current.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#00ff9d',
            boxShadow: `0 0 ${p.size * 3}px #00ff9d`,
            animation: `floatParticle ${p.dur}s ${p.delay}s linear infinite`,
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
};
 
/* ─── Glitch text ─── */
const GlitchText = ({ text, className }: { text: string; className?: string }) => (
  <span className={className} data-text={text} style={{ position: 'relative' }}>
    {text}
  </span>
);
 
/* ─── Animated counter ─── */
const Counter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
 
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 1,
      ease: 'easeOut',
      onUpdate(v) { setDisplay(Math.floor(v)); },
    });
    prev.current = value;
    return controls.stop;
  }, [value]);
 
  return <>{display}{suffix}</>;
};
 
/* ─── Stat card ─── */
const StatCard = ({ icon: Icon, label, value, suffix }: { icon: any; label: string; value: number; suffix?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      position: 'relative',
      borderRadius: 12,
      padding: '20px 24px',
      background: 'rgba(0,20,15,0.7)',
      border: '1px solid rgba(0,255,157,0.2)',
      backdropFilter: 'blur(16px)',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', gap: 16,
    }}
  >
    {/* corner accent */}
    <div style={{
      position: 'absolute', top: 0, left: 0, width: 40, height: 40,
      borderTop: '2px solid #00ff9d', borderLeft: '2px solid #00ff9d',
      borderTopLeftRadius: 12,
    }} />
    <div style={{
      position: 'absolute', bottom: 0, right: 0, width: 40, height: 40,
      borderBottom: '2px solid #00ff9d', borderRight: '2px solid #00ff9d',
      borderBottomRightRadius: 12,
    }} />
 
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: 'rgba(0,255,157,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      border: '1px solid rgba(0,255,157,0.25)',
    }}>
      <Icon size={20} color="#00ff9d" />
    </div>
    <div>
      <p style={{
        fontSize: 26, fontWeight: 700, color: '#fff',
        fontFamily: '"Share Tech Mono", monospace',
        lineHeight: 1.1,
        textShadow: '0 0 12px rgba(0,255,157,0.5)',
      }}>
        <Counter value={value} suffix={suffix} />
      </p>
      <p style={{ fontSize: 12, color: 'rgba(0,255,157,0.6)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: '"Share Tech Mono", monospace', marginTop: 2 }}>
        {label}
      </p>
    </div>
  </motion.div>
);
 
/* ─── Tool card ─── */
const ToolCard = ({
  title, description, icon: Icon, path, accent, index, onClick
}: {
  title: string; description: string; icon: any; path: string; accent: string; index: number; onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.35 + index * 0.09, type: 'spring', stiffness: 120 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: 14,
        padding: 24,
        cursor: 'pointer',
        background: hovered
          ? `rgba(0,12,8,0.9)`
          : 'rgba(0,16,10,0.65)',
        border: `1px solid ${hovered ? accent : 'rgba(0,255,157,0.15)'}`,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        transition: 'border-color 0.25s, background 0.25s',
        boxShadow: hovered ? `0 0 32px ${accent}22, inset 0 0 32px ${accent}08` : 'none',
      }}
    >
      {/* scan line effect on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          animation: 'scanLineTool 1.2s linear infinite',
          zIndex: 1,
        }} />
      )}
 
      {/* top-left corner bracket */}
      <div style={{
        position: 'absolute', top: 10, left: 10, width: 16, height: 16,
        borderTop: `1.5px solid ${hovered ? accent : 'rgba(0,255,157,0.3)'}`,
        borderLeft: `1.5px solid ${hovered ? accent : 'rgba(0,255,157,0.3)'}`,
        transition: 'border-color 0.25s',
      }} />
      <div style={{
        position: 'absolute', bottom: 10, right: 10, width: 16, height: 16,
        borderBottom: `1.5px solid ${hovered ? accent : 'rgba(0,255,157,0.3)'}`,
        borderRight: `1.5px solid ${hovered ? accent : 'rgba(0,255,157,0.3)'}`,
        transition: 'border-color 0.25s',
      }} />
 
      {/* icon */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${accent}15`,
        border: `1px solid ${accent}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
        transition: 'background 0.25s, box-shadow 0.25s',
        boxShadow: hovered ? `0 0 16px ${accent}44` : 'none',
      }}>
        <Icon size={22} color={accent} />
      </div>
 
      <h2 style={{
        fontSize: 15, fontWeight: 600, color: '#e8fff4',
        fontFamily: '"Share Tech Mono", monospace',
        marginBottom: 6, letterSpacing: 0.5,
      }}>
        {title}
      </h2>
      <p style={{ fontSize: 13, color: 'rgba(150,200,180,0.7)', lineHeight: 1.5, fontFamily: 'system-ui, sans-serif' }}>
        {description}
      </p>
 
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.2 }}
        style={{
          marginTop: 14, display: 'flex', alignItems: 'center', gap: 6,
          color: accent, fontSize: 12, fontFamily: '"Share Tech Mono", monospace',
          letterSpacing: 1.5,
        }}
      >
        OPEN <ArrowRight size={13} />
      </motion.div>
    </motion.div>
  );
};
 
/* ══════════════════ DASHBOARD ══════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
 
  const [stats, setStats] = useState<StatsType>({
    scansToday: 0, threatsBlocked: 0, uptime: 0
  });
 
  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);
 
  return (
    <>
      {/* ── Global Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');
 
        @keyframes scanMove {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100px; }
        }
        @keyframes floatParticle {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-80px) translateX(20px); opacity: 0; }
        }
        @keyframes scanLineTool {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.85); opacity: 0.8; }
          50%  { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.85); opacity: 0.8; }
        }
        @keyframes glitchA {
          0%, 95%, 100% { clip-path: none; transform: none; }
          96% { clip-path: polygon(0 15%, 100% 15%, 100% 30%, 0 30%); transform: translateX(-3px); }
          97% { clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%); transform: translateX(3px); }
          98% { clip-path: none; transform: none; }
        }
        @keyframes glitchB {
          0%, 93%, 100% { clip-path: none; transform: none; opacity: 0; }
          94% { clip-path: polygon(0 40%, 100% 40%, 100% 55%, 0 55%); transform: translateX(4px); opacity: 0.5; color: #00e5ff; }
          95% { clip-path: polygon(0 80%, 100% 80%, 100% 90%, 0 90%); transform: translateX(-4px); opacity: 0.5; color: #ff4d6d; }
          96% { clip-path: none; transform: none; opacity: 0; }
        }
        .hero-title {
          position: relative;
          display: inline-block;
        }
        .hero-title::before,
        .hero-title::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hero-title::before {
          animation: glitchA 6s infinite;
          color: #00e5ff;
        }
        .hero-title::after {
          animation: glitchB 6s infinite;
        }
        @keyframes borderTrace {
          0%   { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes statusBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
 
      {/* ── Background layers ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #003322 0%, #000d06 50%, #000000 100%)',
      }} />
      <HexGrid />
      <Particles />
      <Scanlines />
 
      {/* ── Glowing orbs ── */}
      <div style={{
        position: 'fixed', top: '-20%', left: '10%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0,255,157,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '5%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
 
      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
 
          {/* ── Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 100,
                background: 'rgba(0,255,157,0.08)',
                border: '1px solid rgba(0,255,157,0.25)',
                color: '#00ff9d',
                fontSize: 11, letterSpacing: 2.5,
                fontFamily: '"Share Tech Mono", monospace',
                marginBottom: 28,
                textTransform: 'uppercase',
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#00ff9d',
                boxShadow: '0 0 8px #00ff9d',
                animation: 'statusBlink 1.8s ease-in-out infinite',
                display: 'inline-block',
              }} />
              <Shield size={12} />
              Security Toolkit v2.0
            </motion.div>
 
            {/* Title */}
            <div style={{ marginBottom: 18 }}>
              <h1
                className="hero-title"
                data-text="SecureScan"
                style={{
                  fontSize: 'clamp(48px, 8vw, 82px)',
                  fontWeight: 900,
                  fontFamily: '"Orbitron", sans-serif',
                  color: '#e8fff4',
                  letterSpacing: '-1px',
                  lineHeight: 1.05,
                  textShadow: '0 0 40px rgba(0,255,157,0.2)',
                }}
              >
                Secure<span style={{
                  color: '#00ff9d',
                  textShadow: '0 0 30px rgba(0,255,157,0.8), 0 0 60px rgba(0,255,157,0.4)',
                }}>Scan</span>
              </h1>
            </div>
 
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                color: 'rgba(150,210,185,0.65)',
                fontSize: 15,
                maxWidth: 540,
                margin: '0 auto',
                lineHeight: 1.7,
                fontFamily: '"Share Tech Mono", monospace',
                letterSpacing: 0.5,
              }}
            >
              Advanced cybersecurity toolkit for vulnerability scanning and threat analysis.
            </motion.p>
 
            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{
                width: 160, height: 1, margin: '28px auto 0',
                background: 'linear-gradient(90deg, transparent, #00ff9d, transparent)',
              }}
            />
          </motion.div>
 
          {/* ── Stats ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}>
            <StatCard icon={Activity} label="Scans Today" value={stats.scansToday} />
            <StatCard icon={Shield} label="Threats Found" value={stats.threatsBlocked} />
            <StatCard
              icon={Gauge}
              label="Uptime"
              value={Math.round(stats.uptime / 60 * 10) / 10}
              suffix=" min"
            />
          </div>
 
          {/* ── Section label ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 24,
            }}
          >
            <span style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 11, letterSpacing: 3,
              color: 'rgba(0,255,157,0.5)',
              textTransform: 'uppercase',
            }}>// SECURITY MODULES</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(0,255,157,0.2), transparent)' }} />
          </motion.div>
 
          {/* ── Tools Grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}>
            {tools.map((tool, i) => (
              <ToolCard
                key={tool.path}
                {...tool}
                index={i}
                onClick={() => navigate(tool.path)}
              />
            ))}
          </div>
 
        </div>
      </div>
    </>
  );
}
