import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';
import { Bug, Lock, Gauge, AlertTriangle, History, ArrowRight, Shield, Activity } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

type StatsType = {
  scansToday: number;
  threatsBlocked: number;
  uptime: number;
};

const tools = [
  { title: 'Vulnerability Scanner', description: 'Scan URLs for vulnerabilities', icon: Bug, path: '/scanner' },
  { title: 'Password Generator', description: 'Generate strong passwords', icon: Lock, path: '/password' },
  { title: 'Strength Checker', description: 'Analyze password strength', icon: Gauge, path: '/strength' },
  { title: 'Ransomware Guide', description: 'Learn protection strategies', icon: AlertTriangle, path: '/ransomware' },
  { title: 'Scan History', description: 'Track previous scans', icon: History, path: '/history' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<StatsType>({
    scansToday: 0,
    threatsBlocked: 0,
    uptime: 0
  });

  const [displayStats, setDisplayStats] = useState<StatsType>({
    scansToday: 0,
    threatsBlocked: 0,
    uptime: 0
  });

  // 🔥 FETCH STATS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/stats");
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

  // 🔥 ANIMATION COUNTERS
  useEffect(() => {
    animate(displayStats.scansToday, stats.scansToday, {
      duration: 0.8,
      onUpdate(value) {
        setDisplayStats(prev => ({ ...prev, scansToday: Math.floor(value) }));
      }
    });

    animate(displayStats.threatsBlocked, stats.threatsBlocked, {
      duration: 0.8,
      onUpdate(value) {
        setDisplayStats(prev => ({ ...prev, threatsBlocked: Math.floor(value) }));
      }
    });

    animate(displayStats.uptime, stats.uptime, {
      duration: 0.8,
      onUpdate(value) {
        setDisplayStats(prev => ({ ...prev, uptime: Math.floor(value) }));
      }
    });

  }, [stats]);

  return (
    <div className="dashboard-bg">

      {/* 🔥 BACKGROUND EFFECTS */}
      <div className="light light1"></div>
      <div className="light light2"></div>

      <div className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
              <Shield className="h-4 w-4" />
              Security Toolkit v2.0
            </div>

            <h1 className="text-5xl font-bold mb-4 text-white">
              Secure<span className="text-green-400 text-glow">Scan</span>
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Advanced cybersecurity toolkit for vulnerability scanning and threat analysis.
            </p>
          </motion.div>

          {/* 🔥 STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">

            <GlassCard className="flex items-center gap-4">
              <Activity className="text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{displayStats.scansToday}</p>
                <p className="text-gray-400">Scans Today</p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4">
              <Shield className="text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{displayStats.threatsBlocked}</p>
                <p className="text-gray-400">Threats Found</p>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center gap-4">
              <Gauge className="text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {(displayStats.uptime / 60).toFixed(1)} min
                </p>
                <p className="text-gray-400">Uptime</p>
              </div>
            </GlassCard>

          </div>

          {/* 🔥 TOOLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <GlassCard
                  hoverable
                  onClick={() => navigate(tool.path)}
                  className="group"
                >
                  <tool.icon className="mb-4 text-green-400" />
                  <h2 className="font-semibold mb-2 text-white">{tool.title}</h2>
                  <p className="text-sm text-gray-400">{tool.description}</p>

                  <div className="opacity-0 group-hover:opacity-100 transition mt-2 text-green-400 flex items-center gap-1">
                    Open <ArrowRight size={16} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}