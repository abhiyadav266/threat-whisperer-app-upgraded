import { useState, useEffect } from 'react';
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

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanEntry[]>([]);

  // 🔥 FETCH HISTORY
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 🔥 DELETE ONE
  const remove = async (id: number) => {
    await fetch(`http://localhost:5000/history/${id}`, {
      method: "DELETE"
    });
    fetchHistory();
  };

  // 🔥 CLEAR ALL
  const clearAll = async () => {
    await fetch(`http://localhost:5000/history`, {
      method: "DELETE"
    });
    fetchHistory();
  };

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-4xl mx-auto px-4 py-12">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Scan History</h1>
            <p className="text-muted-foreground">{history.length} scans recorded</p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm rounded-lg border text-critical"
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto mb-4" />
            <p>No scan history yet</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {history.map((entry, i) => (
              <motion.div key={entry.id}>
                <GlassCard className="flex items-center justify-between">

                  <div className="flex items-center gap-4">
                    <ExternalLink className="h-4 w-4" />
                    <div>
                      <p className="text-sm">{entry.url}</p>
                      <p className="text-xs text-muted-foreground">{entry.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span>{entry.issues} issues</span>
                    <SeverityBadge severity={entry.severity} />

                    <button onClick={() => remove(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}