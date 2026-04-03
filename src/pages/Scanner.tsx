import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SeverityBadge from '@/components/SeverityBadge';

interface VulnResult {
  type: string;
  severity: string;
  vulnerable: boolean;
  cvss: number;
  description: string;
  impact: string;
  mitigation: string;
  references?: string;
}

const mockResults: VulnResult[] = [
  { type: 'SQL Injection', severity: 'Critical', vulnerable: true, cvss: 9.8, description: 'User input not sanitized in login form', impact: 'Full database compromise', mitigation: 'Use parameterized queries', references: 'https://owasp.org/www-community/attacks/SQL_Injection' },
  { type: 'XSS (Reflected)', severity: 'High', vulnerable: true, cvss: 7.5, description: 'Reflected XSS in search parameter', impact: 'Session hijacking, defacement', mitigation: 'Encode output, use CSP headers' },
  { type: 'CSRF Protection', severity: 'Medium', vulnerable: true, cvss: 5.3, description: 'Missing CSRF tokens on state-changing requests', impact: 'Unauthorized actions on behalf of user', mitigation: 'Implement CSRF tokens' },
  { type: 'SSL/TLS', severity: 'Low', vulnerable: false, cvss: 2.0, description: 'Valid SSL certificate detected', impact: 'N/A', mitigation: 'N/A' },
  { type: 'HTTP Headers', severity: 'Info', vulnerable: false, cvss: 0, description: 'Security headers properly configured', impact: 'N/A', mitigation: 'N/A' },
];

export default function Scanner() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VulnResult[] | null>(null);

  const scan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
    // Simulate scan
    await new Promise(r => setTimeout(r, 2500));
    setResults(mockResults);
    setLoading(false);
  };

  const vulnCount = results?.filter(r => r.vulnerable).length || 0;

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vulnerability Scanner</h1>
          <p className="text-muted-foreground mb-8 font-body">Enter a URL to scan for common security vulnerabilities</p>

          {/* Search */}
          <GlassCard className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && scan()}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-body"
                />
              </div>
              <button
                onClick={scan}
                disabled={loading || !url.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {loading ? 'Scanning...' : 'Scan'}
              </button>
            </div>
          </GlassCard>

          {/* Loading animation */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-primary font-display">Scanning target...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Summary */}
                <GlassCard className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-body">Scan Complete</p>
                      <p className="text-2xl font-display font-bold text-foreground">
                        {vulnCount} {vulnCount === 1 ? 'Issue' : 'Issues'} Found
                      </p>
                    </div>
                    <div className={`p-4 rounded-full ${vulnCount > 0 ? 'bg-critical/10' : 'bg-primary/10'}`}>
                      {vulnCount > 0
                        ? <XCircle className="h-8 w-8 text-critical" />
                        : <CheckCircle2 className="h-8 w-8 text-primary" />
                      }
                    </div>
                  </div>
                </GlassCard>

                {/* Individual results */}
                <div className="space-y-4">
                  {results.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <GlassCard>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {r.vulnerable
                              ? <XCircle className="h-5 w-5 text-critical flex-shrink-0" />
                              : <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            }
                            <h3 className="font-display font-semibold text-foreground">{r.type}</h3>
                          </div>
                          <SeverityBadge severity={r.severity} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 font-body">{r.description}</p>
                        {r.vulnerable && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="p-3 rounded-md bg-secondary">
                              <p className="text-muted-foreground text-xs mb-1 font-display">Impact</p>
                              <p className="text-foreground font-body">{r.impact}</p>
                            </div>
                            <div className="p-3 rounded-md bg-secondary">
                              <p className="text-muted-foreground text-xs mb-1 font-display">Mitigation</p>
                              <p className="text-foreground font-body">{r.mitigation}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground font-display">CVSS: {r.cvss}</span>
                          {r.references && (
                            <a href={r.references} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                              Reference <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
