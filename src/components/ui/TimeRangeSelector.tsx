import { motion } from 'framer-motion';
import { TIME_RANGES, type TimeRange } from '../../config/spotify';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  const ranges = Object.values(TIME_RANGES);

  return (
    <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            value === range.value ? 'text-black' : 'text-spotify-light hover:text-white'
          }`}
        >
          {value === range.value && (
            <motion.div
              layoutId="timeRangeIndicator"
              className="absolute inset-0 bg-spotify-green rounded-full"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{range.label}</span>
        </button>
      ))}
    </div>
  );
}

export default TimeRangeSelector;

