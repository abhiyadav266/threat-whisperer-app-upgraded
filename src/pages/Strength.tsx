import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

function analyzePassword(pw: string) {
  if (!pw) return { score: 0, label: 'Enter a password', color: 'bg-muted', tips: [] };

  let score = 0;
  const tips: string[] = [];

  if (pw.length >= 8) score += 1; else tips.push('Use at least 8 characters');
  if (pw.length >= 12) score += 1;
  if (pw.length >= 16) score += 1;
  if (/[a-z]/.test(pw)) score += 1; else tips.push('Add lowercase letters');
  if (/[A-Z]/.test(pw)) score += 1; else tips.push('Add uppercase letters');
  if (/[0-9]/.test(pw)) score += 1; else tips.push('Add numbers');
  if (/[^a-zA-Z0-9]/.test(pw)) score += 1; else tips.push('Add special characters');
  if (!/(.)\1{2,}/.test(pw)) score += 1; else tips.push('Avoid repeating characters');
  if (!/^(123|abc|password|qwerty)/i.test(pw)) score += 1; else tips.push('Avoid common patterns');

  const pct = Math.min(100, Math.round((score / 9) * 100));

  if (pct < 30) return { score: pct, label: 'Very Weak', color: 'bg-critical', tips };
  if (pct < 50) return { score: pct, label: 'Weak', color: 'bg-high', tips };
  if (pct < 70) return { score: pct, label: 'Fair', color: 'bg-medium', tips };
  if (pct < 90) return { score: pct, label: 'Strong', color: 'bg-info', tips };
  return { score: pct, label: 'Very Strong', color: 'bg-primary', tips };
}

export default function Strength() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const analysis = useMemo(() => analyzePassword(password), [password]);

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Strength Checker</h1>
          <p className="text-muted-foreground mb-8 font-body">Analyze the strength of your passwords</p>

          <GlassCard className="mb-6">
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                placeholder="Enter password to analyze..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-display text-lg"
              />
              <button
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {password && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-display text-foreground">{analysis.label}</span>
                  <span className="text-sm font-display text-muted-foreground">{analysis.score}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.score}%` }}
                    className={`h-full rounded-full ${analysis.color}`}
                  />
                </div>
              </div>
            )}
          </GlassCard>

          {password && analysis.tips.length > 0 && (
            <GlassCard>
              <h3 className="font-display font-semibold text-foreground mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {analysis.tips.map((tip, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}
