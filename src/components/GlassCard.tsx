import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function GlassCard({ children, className = '', onClick, hoverable = false }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.03, y: -4 } : undefined}
      whileTap={hoverable && onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`glass rounded-lg p-6 transition-shadow ${
        hoverable ? 'cursor-pointer hover:glow-primary' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
