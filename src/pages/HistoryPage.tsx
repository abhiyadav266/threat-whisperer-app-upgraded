import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Trash2,
  ExternalLink,
  ShieldOff,
  Database,
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SeverityBadge from '@/components/SeverityBadge';

interface ScanEntry {
  id: number;
  url: string;
  date: string;
  issues: number;
  severity: string;
}

/* ─── Scanlines overlay ─────────────────────────────────────── */
const Scanlines = () => (
  <div
    aria-hidden
    style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 50,
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,140,0.015) 2px, rgba(0,255,140,0.015) 4px)',
    }}
  />
);

/* ─── Animated grid background ─────────────────────────────── */
const CyberGrid = () => (
  <div
    aria-hidden
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(rgba(0,255,140,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,255,140,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}
  />
);

/* ─── Blinking cursor ───────────────────────────────────────── */
const Cursor = () => (
  <motion.span
    animate={{ opacity: [1, 0] }}
    transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
    style={{
      display: 'inline-block',
      width: 10,
      height: '1.1em',
      background: '#00ff8c',
      verticalAlign: 'middle',
      marginLeft: 6,
    }}
    aria-hidden
  />
);

/* ─── Severity color map ────────────────────────────────────── */
const severityColor: Record<string, string> = {
  Critical: '#ff2d55',
  High: '#ff9f0a',
  Medium: '#ffd60a',
  Low: '#00ff8c',
  Info: '#00ccff',
};

const getSevColor = (s: string) => severityColor[s] ?? '#94a3b8';

/* ─── Single history row ────────────────────────────────────── */
const HistoryRow = ({
  entry,
  index,
  onRemove,
}: {
  entry: ScanEntry;
  index: number;
  onRemove: (id: number) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [removing, setRemoving] = useState(false);
  const col = getSevColor(entry.severity);

  const handleRemove = async () => {
    setRemoving(true);
    setTimeout(() => onRemove(entry.id), 350);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -30, scale: 0.97 }}
      animate={
        removing
          ? { opacity: 0, x: 60, scale: 0.95 }
          : { opacity: 1, x: 0, scale: 1 }
      }
      exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      {/* left accent bar */}
      <motion.div
        animate={{ scaleY: hovered ? 1 : 0.4, opacity: hovered ? 1 : 0.3 }}
        style={{
          position: 'absolute',
          left: 0,
          top: 4,
          bottom: 4,
          width: 3,
          borderRadius: 99,
          background: col,
          boxShadow: `0 0 8px ${col}`,
          transformOrigin: 'center',
        }}
      />

      {/* corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <motion.span
          key={c}
          aria-hidden
          animate={{ opacity: hovered ? 0.8 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            width: 10,
            height: 10,
            borderColor: col,
            borderStyle: 'solid',
            borderWidth: 0,
            zIndex: 10,
            ...(c === 'tl' && {
              top: -1,
              left: -1,
              borderTopWidth: 2,
              borderLeftWidth: 2,
            }),
            ...(c === 'tr' && {
              top: -1,
              right: -1,
              borderTopWidth: 2,
              borderRightWidth: 2,
            }),
            ...(c === 'bl' && {
              bottom: -1,
              left: -1,
              borderBottomWidth: 2,
              borderLeftWidth: 2,
            }),
            ...(c === 'br' && {
              bottom: -1,
              right: -1,
              borderBottomWidth: 2,
              borderRightWidth: 2,
            }),
          }}
        />
      ))}

      {/* scan flash */}
      {hovered && (
        <motion.div
          aria-hidden
          initial={{ top: 0, opacity: 0.5 }}
          animate={{ top: '100%', opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${col}, transparent)`,
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      )}

      {/* FIXED STYLE ERROR */}
      <div
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${col}06 0%, rgba(0,0,0,0.55) 100%)`
            : 'rgba(5,10,15,0.65)',
          border: `1px solid ${
            hovered ? col + '40' : 'rgba(255,255,255,0.06)'
          }`,
          boxShadow: hovered ? `0 0 20px ${col}18` : 'none',
          transition: 'background 0.25s, border 0.25s, box-shadow 0.25s',
          borderRadius: 16,
        }}
      >
        <GlassCard>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              paddingLeft: 20,
            }}
          >
            {/* left */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                minWidth: 0,
              }}
            >
              <motion.div
                animate={hovered ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.35 }}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  background: `${col}15`,
                  border: `1px solid ${col}35`,
                  flexShrink: 0,
                }}
              >
                <ExternalLink
                  style={{ width: 15, height: 15, color: col }}
                />
              </motion.div>

              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: 600,
                    color: hovered ? '#e2e8f0' : '#94a3b8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                    letterSpacing: 0.5,
                  }}
                >
                  {entry.url}
                </p>

                <p
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 10,
                    color: '#334155',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginTop: 2,
                  }}
                >
                  {'> '}
                  {entry.date}
                </p>
              </div>
            </div>

            {/* right */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  letterSpacing: 2,
                  padding: '3px 10px',
                  borderRadius: 4,
                  border: `1px solid ${col}35`,
                  color: col,
                  background: `${col}10`,
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.issues} ISSUES
              </div>

              <SeverityBadge severity={entry.severity} />

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                style={{
                  padding: 7,
                  borderRadius: 6,
                  border: '1px solid rgba(255,45,85,0.2)',
                  background: 'rgba(255,45,85,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2
                  style={{
                    width: 14,
                    height: 14,
                    color: '#ff2d55',
                  }}
                />
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

/* ─── Main page ─────────────────────────────────────────────── */
export default function HistoryPage() {
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:5000/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const remove = async (id: number) => {
    await fetch(`http://localhost:5000/history/${id}`, {
      method: 'DELETE',
    });
    fetchHistory();
  };

  const clearAll = async () => {
    setClearing(true);
    await fetch('http://localhost:5000/history', {
      method: 'DELETE',
    });
    await fetchHistory();
    setClearing(false);
  };

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
      <CyberGrid />
      <Scanlines />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 860,
          margin: '0 auto',
          padding: '48px 20px 80px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 10,
              color: '#00ff8c',
              letterSpacing: 4,
              marginBottom: 14,
            }}
          >
            {'// SYSTEM > SCAN_HISTORY_LOG'}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 30,
            }}
          >
            <div style={{ display: 'flex', gap: 14 }}>
              <Database
                style={{
                  width: 32,
                  height: 32,
                  color: '#00ff8c',
                }}
              />

              <h1
                style={{
                  fontSize: 'clamp(22px,4vw,36px)',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Scan History <Cursor />
              </h1>
            </div>

            {history.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={clearAll}
                disabled={clearing}
                style={{
                  padding: '9px 18px',
                  color: '#ff2d55',
                  background: 'rgba(255,45,85,0.07)',
                  border: '1px solid rgba(255,45,85,0.35)',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                {clearing ? 'Purging...' : 'Clear All'}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Empty state */}
        {history.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* FIXED STYLE ERROR */}
            <div
              style={{
                textAlign: 'center',
                padding: '64px 24px',
                border: '1px solid rgba(0,255,140,0.1)',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: 16,
              }}
            >
              <GlassCard>
                <ShieldOff
                  style={{
                    width: 48,
                    height: 48,
                    margin: '0 auto 16px',
                    color: '#1e4035',
                  }}
                />

                <p
                  style={{
                    fontFamily: 'monospace',
                    color: '#334155',
                    letterSpacing: 3,
                    fontSize: 13,
                  }}
                >
                  NO RECORDS FOUND
                </p>
              </GlassCard>
            </div>
          </motion.div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <AnimatePresence mode="popLayout">
              {history.map((entry, i) => (
                <HistoryRow
                  key={entry.id}
                  entry={entry}
                  index={i}
                  onRemove={remove}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
