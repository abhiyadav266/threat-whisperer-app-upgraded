import { motion } from 'framer-motion';
import { AlertTriangle, Shield, HardDrive, Mail, Wifi, FileWarning } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const threats = [
  { icon: FileWarning, title: 'WannaCry', desc: 'Exploits SMB vulnerability to spread across networks. Encrypts files and demands Bitcoin payment.', severity: 'Critical' },
  { icon: Mail, title: 'Phishing Attacks', desc: 'Malicious email attachments that deploy ransomware payloads when opened.', severity: 'High' },
  { icon: Wifi, title: 'RDP Exploits', desc: 'Brute-force attacks on exposed Remote Desktop Protocol services.', severity: 'High' },
  { icon: HardDrive, title: 'Drive-by Downloads', desc: 'Compromised websites that automatically download malware to visitors.', severity: 'Medium' },
];

const tips = [
  'Keep all software and OS updated with latest patches',
  'Maintain regular offline backups (3-2-1 rule)',
  'Use multi-factor authentication everywhere',
  'Train employees on phishing awareness',
  'Segment networks to limit lateral movement',
  'Deploy endpoint detection and response (EDR) tools',
  'Disable unnecessary services like SMBv1 and RDP',
  'Monitor network traffic for anomalies',
];

export default function Ransomware() {
  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-high" />
            <h1 className="text-3xl font-bold text-foreground">Ransomware Guide</h1>
          </div>
          <p className="text-muted-foreground mb-8 font-body">Understanding threats and protection strategies</p>

          {/* Threats */}
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">Common Threats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {threats.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-high/10">
                      <t.icon className="h-5 w-5 text-high" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{t.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 font-body">{t.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Prevention */}
          <h2 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Prevention Tips
          </h2>
          <GlassCard>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground font-body">
                  <span className="w-2 h-2 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
