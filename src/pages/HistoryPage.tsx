import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2, ExternalLink } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SeverityBadge from '@/components/SeverityBadge';

interface ScanEntry {
  id: number;
  url: string;
  date: string;
  issues: number;
  severity: string;
}

const initialHistory: ScanEntry[] = [
  { id: 1, url: 'https://example.com', date: '2026-04-03 14:30', issues: 3, severity: 'High' },
  { id: 2, url: 'https://testsite.org', date: '2026-04-02 09:15', issues: 1, severity: 'Medium' },
  { id: 3, url: 'https://secure-app.io', date: '2026-04-01 18:45', issues: 0, severity: 'Low' },
  { id: 4, url: 'https://mybank.com', date: '2026-03-30 11:00', issues: 5, severity: 'Critical' },
];

export default function HistoryPage() {
  const [history, setHistory] = useState(initialHistory);

  const remove = (id: number) => setHistory(prev => prev.filter(h => h.id !== id));
  const clearAll = () => setHistory([]);

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Scan History</h1>
              <p className="text-muted-foreground font-body">{history.length} scans recorded</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm rounded-lg border border-critical/30 text-critical hover:bg-critical/10 transition-colors font-display"
              >
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-body">No scan history yet</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {history.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <GlassCard className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="hidden sm:flex p-2 rounded-lg bg-secondary">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-sm text-foreground truncate">{entry.url}</p>
                        <p className="text-xs text-muted-foreground font-body">{entry.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-sm font-display text-muted-foreground">{entry.issues} issues</span>
                      <SeverityBadge severity={entry.severity} />
                      <button
                        onClick={() => remove(entry.id)}
                        className="p-2 text-muted-foreground hover:text-critical transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
