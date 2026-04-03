const severityColors: Record<string, string> = {
  critical: 'bg-critical/20 text-critical border-critical/30',
  high: 'bg-high/20 text-high border-high/30',
  medium: 'bg-medium/20 text-medium border-medium/30',
  low: 'bg-low/20 text-low border-low/30',
  info: 'bg-info/20 text-info border-info/30',
};

export default function SeverityBadge({ severity }: { severity: string }) {
  const key = severity.toLowerCase();
  const colors = severityColors[key] || severityColors.info;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-display font-semibold border ${colors}`}>
      {severity}
    </span>
  );
}
