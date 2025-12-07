import { motion } from 'framer-motion';
import type { GenreData } from '../../types/spotify';

interface GenreCloudProps {
  genres: GenreData[];
  limit?: number;
}

export function GenreCloud({ genres, limit = 15 }: GenreCloudProps) {
  const displayGenres = genres.slice(0, limit);
  const maxCount = Math.max(...displayGenres.map(g => g.count), 1);

  // Shuffle genres for more interesting layout
  const shuffledGenres = [...displayGenres].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center py-4">
      {shuffledGenres.map((genre, index) => {
        const sizeRatio = genre.count / maxCount;
        const fontSize = 11 + sizeRatio * 14;
        const padding = sizeRatio > 0.7 ? 'px-5 py-2.5' : sizeRatio > 0.4 ? 'px-4 py-2' : 'px-3 py-1.5';
        
        return (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              delay: index * 0.04, 
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.15, 
              y: -6,
              rotate: Math.random() > 0.5 ? 3 : -3,
            }}
            className="relative group cursor-default"
          >
            <div
              className={`${padding} rounded-full transition-all duration-300 border-2 backdrop-blur-sm`}
              style={{
                backgroundColor: `${genre.color}15`,
                borderColor: `${genre.color}40`,
                boxShadow: sizeRatio > 0.5 ? `0 0 20px ${genre.color}20` : 'none',
              }}
            >
              <span
                className="font-bold whitespace-nowrap tracking-wide"
                style={{
                  fontSize: `${fontSize}px`,
                  color: genre.color,
                  textShadow: sizeRatio > 0.6 ? `0 0 10px ${genre.color}50` : 'none',
                }}
              >
                {genre.name}
              </span>
            </div>

            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${genre.color}30 0%, transparent 70%)`,
                filter: 'blur(8px)',
              }}
            />

            {/* Tooltip with percentage */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform group-hover:-translate-y-1">
              <div className="bg-spotify-dark/95 px-3 py-1.5 rounded-lg shadow-xl border border-white/10">
                <span className="text-xs text-white font-bold">{genre.percentage}%</span>
                <span className="text-xs text-spotify-light ml-1">of your music</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default GenreCloud;

