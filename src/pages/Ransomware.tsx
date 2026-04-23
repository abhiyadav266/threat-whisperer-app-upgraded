import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Shield,
  HardDrive,
  Mail,
  Wifi,
  FileWarning,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SeverityBadge from '@/components/SeverityBadge';

/* ---------------------------------------------------------- */
/* FIX:
   Your error was from style prop on GlassCard component.
   If GlassCard props don't accept style, wrap GlassCard inside div.
   No design changed. Only issue fixed.
*/
/* ---------------------------------------------------------- */

const threats = [
  {
    icon: FileWarning,
    title: 'WannaCry',
    desc: 'Exploits SMB vulnerability to spread across networks. Encrypts files and demands Bitcoin payment.',
    severity: 'Critical',
    impact: 'Mass file encryption, business shutdown',
    color: '#ff2d55',
  },
  {
    icon: Mail,
    title: 'Phishing Attacks',
    desc: 'Malicious email attachments that deploy ransomware payloads.',
    severity: 'High',
    impact: 'Credential theft + malware execution',
    color: '#ff9f0a',
  },
  {
    icon: Wifi,
    title: 'RDP Exploits',
    desc: 'Brute-force attacks on exposed Remote Desktop services.',
    severity: 'High',
    impact: 'Full system takeover',
    color: '#ff9f0a',
  },
  {
    icon: HardDrive,
    title: 'Drive-by Downloads',
    desc: 'Compromised websites auto-install malware silently.',
    severity: 'Medium',
    impact: 'Silent infection',
    color: '#ffd60a',
  },
];

const tips = [
  'Keep all software updated with latest patches',
  'Maintain offline backups (3-2-1 rule)',
  'Enable multi-factor authentication (MFA)',
  'Avoid opening unknown email attachments',
  'Disable unused services (SMBv1, RDP)',
  'Use EDR/antivirus solutions',
  'Segment networks to reduce spread',
  'Monitor logs and network traffic',
];

const Scanlines = () => (
  <div
    aria-hidden
    style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 50,
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,140,0.018) 2px, rgba(0,255,140,0.018) 4px)',
    }}
  />
);

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const cols = Math.floor(canvas.width / 18);
    const drops = Array(cols).fill(1);
    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF'.split('');

    let raf = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];

        const brightness = Math.random();

        ctx.fillStyle =
          brightness > 0.95
            ? '#ffffff'
            : brightness > 0.7
            ? '#00ff8c'
            : 'rgba(0,200,100,0.4)';

        ctx.font = '14px monospace';
        ctx.fillText(char, i * 18, drops[i] * 18);

        if (drops[i] * 18 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.07,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

const GLITCH_CHARS = '!@#$%^&*<>[]{}|0123456789';

function useGlitchText(original: string, active: boolean) {
  const [text, setText] = useState(original);

  useEffect(() => {
    if (!active) {
      setText(original);
      return;
    }

    let iter = 0;

    const id = setInterval(() => {
      setText(
        original
          .split('')
          .map((ch, i) =>
            i < iter
              ? ch
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          )
          .join('')
      );

      iter += 0.4;

      if (iter >= original.length) clearInterval(id);
    }, 30);

    return () => clearInterval(id);
  }, [active, original]);

  return text;
}

const ThreatCard = ({ t, i }: { t: (typeof threats)[0]; i: number }) => {
  const [hovered, setHovered] = useState(false);
  const title = useGlitchText(t.title, hovered);
  const Icon = t.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      {/* FIXED HERE */}
      <div
        style={{
          border: `1px solid ${
            hovered ? `${t.color}80` : 'rgba(255,255,255,0.08)'
          }`,
          background: hovered
            ? `linear-gradient(135deg, ${t.color}08 0%, rgba(0,0,0,0.6) 100%)`
            : 'rgba(10,10,15,0.7)',
          boxShadow: hovered
            ? `0 0 24px ${t.color}30, inset 0 0 24px ${t.color}08`
            : 'none',
          borderRadius: 16,
        }}
      >
        <GlassCard className="h-full transition-all duration-300">
          <div className="flex items-start gap-4">
            <div
              style={{
                padding: 12,
                borderRadius: 8,
                background: `${t.color}18`,
                border: `1px solid ${t.color}40`,
                flexShrink: 0,
              }}
            >
              <Icon style={{ width: 20, height: 20, color: t.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1 gap-2">
                <h3
                  className="font-bold tracking-widest uppercase text-sm"
                  style={{
                    fontFamily: 'monospace',
                    color: hovered ? t.color : '#e2e8f0',
                  }}
                >
                  {title}
                </h3>

                <SeverityBadge severity={t.severity} />
              </div>

              <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                {t.desc}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  fontSize: 11,
                  color: `${t.color}cc`,
                  fontFamily: 'monospace',
                }}
              >
                <span>{'>'}</span>
                <span>IMPACT:</span>
                <span>{t.impact}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

const TipRow = ({ tip }: { tip: string }) => (
  <li
    style={{
      padding: '6px 8px',
      fontSize: 13,
      color: '#94a3b8',
      fontFamily: 'monospace',
    }}
  >
    › {tip}
  </li>
);

const CyberStat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ textAlign: 'center', fontFamily: 'monospace' }}>
    <div
      style={{
        fontSize: 28,
        fontWeight: 900,
        color: '#00ff8c',
      }}
    >
      {value}
    </div>

    <div
      style={{
        fontSize: 10,
        color: '#64748b',
        letterSpacing: 3,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  </div>
);

const Cursor = () => (
  <motion.span
    animate={{ opacity: [1, 0] }}
    transition={{ duration: 0.7, repeat: Infinity }}
    style={{
      display: 'inline-block',
      width: 10,
      height: '1em',
      background: '#00ff8c',
      marginLeft: 4,
    }}
  />
);

export default function Ransomware() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(160deg, #010508 0%, #020d0a 40%, #050510 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <MatrixRain />
      <Scanlines />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 900,
          margin: '0 auto',
          padding: '48px 20px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <AlertTriangle style={{ width: 36, height: 36, color: '#ff2d55' }} />

          <h1
            style={{
              fontSize: '42px',
              fontWeight: 900,
              fontFamily: 'monospace',
              color: '#00ff8c',
            }}
          >
            Ransomware Guide
          </h1>

          <Cursor />
        </div>

        <p style={{ color: '#64748b', marginBottom: 36 }}>
          Learn how ransomware attacks operate and how to defend against them.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 12,
            marginBottom: 30,
          }}
        >
          <CyberStat value="$1.1T" label="Damages" />
          <CyberStat value="66%" label="Orgs Hit" />
          <CyberStat value="21 Days" label="Recovery" />
          <CyberStat value="4,611" label="Daily Attacks" />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {threats.map((t, i) => (
            <ThreatCard key={i} t={t} i={i} />
          ))}
        </div>

        {/* FIXED HERE ALSO */}
        <div
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(0,255,140,0.15)',
            borderRadius: 16,
          }}
        >
          <GlassCard>
            <ul
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              {tips.map((tip, i) => (
                <TipRow key={i} tip={tip} />
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
