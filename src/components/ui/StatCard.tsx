import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  index?: number;
  gradient?: string;
}

export function StatCard({ icon, value, label, index = 0, gradient }: StatCardProps) {
  const gradientClasses = [
    'stat-gradient-1',
    'stat-gradient-2',
    'stat-gradient-3',
    'stat-gradient-4',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${gradient || gradientClasses[index % 4]} rounded-2xl p-6 border border-white/10 card-hover`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-white/10 rounded-xl">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-spotify-light">{label}</p>
      </div>
    </motion.div>
  );
}

export default StatCard;

