import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

export default function PasswordChecker() {

  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [breach, setBreach] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  // 🔐 RULES
  const rules: any = {
    length: password.length >= 10,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  // 🔥 STRENGTH CALC
  useEffect(() => {
    let score = 0;
    Object.values(rules).forEach(v => v && score++);
    setStrength(score);
  }, [password]);

  const getStrengthLabel = () => {
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Medium";
    if (strength === 4) return "Strong";
    return "Very Strong";
  };

  const getGradient = () => {
    if (strength <= 2) return "from-red-500 to-orange-500";
    if (strength === 3) return "from-yellow-500 to-amber-400";
    if (strength === 4) return "from-green-500 to-emerald-400";
    return "from-emerald-400 to-cyan-400";
  };

  // 🔥 SUGGESTIONS
  const suggestions: string[] = [];
  if (!rules.length) suggestions.push("Use at least 10 characters");
  if (!rules.upper) suggestions.push("Add uppercase letter");
  if (!rules.lower) suggestions.push("Add lowercase letter");
  if (!rules.number) suggestions.push("Add numbers");
  if (!rules.symbol) suggestions.push("Add special character");

  // 🔥 BACKEND BREACH CHECK
  const checkBreach = async () => {
    if (!password) return;

    setLoading(true);
    setBreach(null);

    try {
      const res = await fetch("http://localhost:5000/check-breach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (data.breached) {
        setBreach(data.count);
      } else {
        setBreach(0);
      }

    } catch (err) {
      console.error("Backend error:", err);
      setBreach(-1);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-2 text-primary text-glow">
          🔐 Password Security Checker
        </h1>
        <p className="text-muted-foreground mb-10">
          Check password strength & data breach exposure
        </p>

        {/* 🔥 TOP GRID */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* INPUT */}
          <GlassCard>
            <div className="flex items-center">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter secure password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-secondary rounded focus:ring-2 focus:ring-primary"
              />
              <button onClick={() => setShow(!show)} className="ml-2">
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </GlassCard>

          {/* STRENGTH */}
          <GlassCard>
            <div className="flex justify-between mb-2">
              <span>Strength</span>
              <span className="font-semibold">{getStrengthLabel()}</span>
            </div>

            <div className="w-full h-3 bg-secondary rounded">
              <motion.div
                className={`h-3 bg-gradient-to-r ${getGradient()}`}
                animate={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
          </GlassCard>

        </div>

        {/* 🔥 MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="space-y-6">

            {/* RULES */}
            <GlassCard>
              <h3 className="mb-3 text-primary font-semibold">
                Security Requirements
              </h3>

              {Object.entries({
                length: 'Minimum 10 characters',
                upper: 'Uppercase letter',
                lower: 'Lowercase letter',
                number: 'Number',
                symbol: 'Special character'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2 text-sm mb-1">
                  {rules[key]
                    ? <Check className="text-green-400" />
                    : <X className="text-red-400" />}
                  {label}
                </div>
              ))}
            </GlassCard>

            {/* SUGGESTIONS */}
            {suggestions.length > 0 && (
              <GlassCard>
                <h3 className="mb-2 text-yellow-400 font-semibold">
                  Suggestions
                </h3>
                {suggestions.map((s, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    ⚡ {s}
                  </p>
                ))}
              </GlassCard>
            )}

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* BREACH CHECK */}
            <GlassCard>
              <button
                disabled={!password || loading}
                onClick={checkBreach}
                className="w-full py-3 bg-gradient-to-r from-primary to-emerald-400 rounded-lg mb-4 font-semibold disabled:opacity-50"
              >
                {loading ? "Checking..." : "Check Data Breach"}
              </button>

              {loading && <Loader2 className="animate-spin mx-auto" />}

              {breach !== null && (
                <div className="text-center mt-3 flex flex-col items-center gap-2">

                  <ShieldAlert className="h-6 w-6" />

                  {breach > 0 && (
                    <p className="text-red-400 font-semibold">
                      Found in {breach} breaches 🚨
                    </p>
                  )}

                  {breach === 0 && (
                    <p className="text-green-400 font-semibold">
                      Safe password ✅
                    </p>
                  )}

                  {breach === -1 && (
                    <p className="text-yellow-400">
                      Backend Error ⚠️
                    </p>
                  )}
                </div>
              )}

            </GlassCard>

          </div>

        </div>

      </div>
    </div>
  );
}