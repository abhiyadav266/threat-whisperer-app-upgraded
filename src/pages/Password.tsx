import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, RefreshCw, Check } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const chars = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function Password() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = '';
    if (options.upper) pool += chars.upper;
    if (options.lower) pool += chars.lower;
    if (options.numbers) pool += chars.numbers;
    if (options.symbols) pool += chars.symbols;
    if (!pool) pool = chars.lower;

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += pool[array[i] % pool.length];
    }
    setPassword(result);
    setCopied(false);
  }, [length, options]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Password Generator</h1>
          <p className="text-muted-foreground mb-8 font-body">Generate cryptographically secure passwords</p>

          {/* Output */}
          <GlassCard className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 bg-secondary rounded-lg font-display text-lg tracking-wider text-foreground break-all min-h-[52px]">
                {password || <span className="text-muted-foreground">Click generate...</span>}
              </div>
              {password && (
                <button onClick={copy} className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
              )}
            </div>
          </GlassCard>

          {/* Controls */}
          <GlassCard>
            <div className="space-y-6">
              {/* Length */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-display text-foreground">Length</label>
                  <span className="text-sm font-display text-primary">{length}</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={64}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(options) as (keyof typeof options)[]).map((key) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      options[key] ? 'border-primary/50 bg-primary/5' : 'border-border bg-secondary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={() => setOptions(prev => ({ ...prev, [key]: !prev[key] }))}
                      className="accent-primary"
                    />
                    <span className="text-sm font-body text-foreground capitalize">{key}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={generate}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-display font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Generate Password
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
