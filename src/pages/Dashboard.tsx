import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bug, Lock, Gauge, AlertTriangle, History, ArrowRight, Shield, Activity } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const tools = [
  { title: 'Vulnerability Scanner', description: 'Scan URLs for security vulnerabilities and get detailed reports', icon: Bug, path: '/scanner', color: 'text-critical' },
  { title: 'Password Generator', description: 'Generate cryptographically strong passwords instantly', icon: Lock, path: '/password', color: 'text-primary' },
  { title: 'Strength Checker', description: 'Analyze password strength with entropy calculations', icon: Gauge, path: '/strength', color: 'text-info' },
  { title: 'Ransomware Guide', description: 'Learn about ransomware threats and protection strategies', icon: AlertTriangle, path: '/ransomware', color: 'text-high' },
  { title: 'Scan History', description: 'Review past scans and track security improvements', icon: History, path: '/history', color: 'text-medium' },
];

const stats = [
  { label: 'Scans Today', value: '24', icon: Activity },
  { label: 'Threats Blocked', value: '142', icon: Shield },
  { label: 'Uptime', value: '99.9%', icon: Gauge },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-display mb-6">
            <Shield className="h-4 w-4" />
            Security Toolkit v2.0
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-4">
            Secure<span className="text-primary text-glow">Scan</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Advanced cybersecurity toolkit for vulnerability scanning, password management, and threat analysis.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tools Grid */}
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
                className="group h-full flex flex-col"
              >
                <div className={`p-3 rounded-lg bg-secondary w-fit mb-4 ${tool.color}`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-display font-semibold text-foreground mb-2">{tool.title}</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-1 font-body">{tool.description}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Open tool <ArrowRight className="h-4 w-4" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
