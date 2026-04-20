import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Timer } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

function calculateEntropy(pw: string) {
  let charset = 0;

  if (/[a-z]/.test(pw)) charset += 26;
  if (/[A-Z]/.test(pw)) charset += 26;
  if (/[0-9]/.test(pw)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) charset += 32;

  const entropy = pw.length * Math.log2(charset || 1);
  return entropy;
}

function estimateCrackTime(entropy: number) {
  const guessesPerSecond = 1e9; // 1 billion guesses/sec
  const seconds = Math.pow(2, entropy) / guessesPerSecond;

  if (seconds < 60) return "Instantly 😬";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.floor(seconds / 86400)} days`;
  return `${Math.floor(seconds / 31536000)} years 🔥`;
}

export default function AttackSimulator() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const entropy = useMemo(() => calculateEntropy(password), [password]);
  const crackTime = useMemo(() => estimateCrackTime(entropy), [entropy]);

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-3xl mx-auto px-4 py-12">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          <h1 className="text-4xl font-bold mb-2 text-primary text-glow">
            ⚔️ Password Attack Simulator
          </h1>

          <p className="text-muted-foreground mb-8">
            See how fast a hacker can crack your password
          </p>

          {/* INPUT */}
          <GlassCard className="mb-6">
            <div className="flex items-center">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-secondary rounded"
              />
              <button onClick={() => setShow(!show)} className="ml-2">
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </GlassCard>

          {password && (
            <>
              {/* ENTROPY */}
              <GlassCard className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="text-primary" />
                  <span>Entropy</span>
                </div>

                <p className="text-2xl font-bold">{entropy.toFixed(2)} bits</p>
              </GlassCard>

              {/* CRACK TIME */}
              <GlassCard className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="text-red-400" />
                  <span>Estimated Crack Time</span>
                </div>

                <p className="text-2xl font-bold text-red-400">
                  {crackTime}
                </p>
              </GlassCard>

              {/* ATTACK INFO */}
              <GlassCard>
                <h3 className="font-semibold mb-2">Attack Simulation</h3>

                <p className="text-sm text-muted-foreground">
                  A hacker using GPU brute-force (~1B guesses/sec) would take:
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {crackTime}
                </p>
              </GlassCard>
            </>
          )}

        </motion.div>
      </div>
    </div>
  );
}