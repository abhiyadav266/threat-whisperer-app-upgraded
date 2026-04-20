import { motion } from 'framer-motion';
import { AlertTriangle, Shield, HardDrive, Mail, Wifi, FileWarning } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SeverityBadge from '@/components/SeverityBadge';

const threats = [
  {
    icon: FileWarning,
    title: 'WannaCry',
    desc: 'Exploits SMB vulnerability to spread across networks. Encrypts files and demands Bitcoin payment.',
    severity: 'Critical',
    impact: 'Mass file encryption, business shutdown'
  },
  {
    icon: Mail,
    title: 'Phishing Attacks',
    desc: 'Malicious email attachments that deploy ransomware payloads.',
    severity: 'High',
    impact: 'Credential theft + malware execution'
  },
  {
    icon: Wifi,
    title: 'RDP Exploits',
    desc: 'Brute-force attacks on exposed Remote Desktop services.',
    severity: 'High',
    impact: 'Full system takeover'
  },
  {
    icon: HardDrive,
    title: 'Drive-by Downloads',
    desc: 'Compromised websites auto-install malware silently.',
    severity: 'Medium',
    impact: 'Silent infection'
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
  'Monitor logs and network traffic'
];

export default function Ransomware() {
  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* 🔥 Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-high" />
            <h1 className="text-3xl font-bold text-foreground">
              Ransomware Guide
            </h1>
          </div>

          <p className="text-muted-foreground mb-10">
            Learn how ransomware attacks work and how to defend against them.
          </p>

          {/* 🔥 THREATS */}
          <h2 className="text-xl font-semibold mb-4">⚠️ Common Threats</h2>

          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {threats.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <GlassCard className="h-full border border-border/40 hover:border-primary/40 transition">

                  <div className="flex items-start gap-4">

                    <div className="p-3 rounded-lg bg-primary/10">
                      <t.icon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold">{t.title}</h3>
                        <SeverityBadge severity={t.severity} />
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {t.desc}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        💥 Impact: {t.impact}
                      </p>
                    </div>

                  </div>

                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* 🔥 PREVENTION */}
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Prevention Tips
          </h2>

          <GlassCard>
            <ul className="grid md:grid-cols-2 gap-4">
              {tips.map((tip, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  {tip}
                </motion.li>
              ))}
            </ul>
          </GlassCard>

        </motion.div>
      </div>
    </div>
  );
}