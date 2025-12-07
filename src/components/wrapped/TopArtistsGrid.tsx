import { motion } from 'framer-motion';
import type { SpotifyArtist } from '../../types/spotify';
import { getImageUrl, formatNumber, getGradientByIndex } from '../../utils/helpers';

interface TopArtistsGridProps {
  artists: SpotifyArtist[];
  limit?: number;
}

export function TopArtistsGrid({ artists, limit = 12 }: TopArtistsGridProps) {
  const displayArtists = artists.slice(0, limit);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {displayArtists.map((artist, index) => (
        <motion.a
          key={artist.id}
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -8, scale: 1.05 }}
          className="group relative"
        >
          {/* Rank badge for top 3 */}
          {index < 3 && (
            <div className={`absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br ${getGradientByIndex(index)} shadow-lg`}>
              {index + 1}
            </div>
          )}

          <div className="aspect-square rounded-2xl overflow-hidden relative">
            {/* Artist Image */}
            <img
              src={getImageUrl(artist.images, 'medium')}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-br ${getGradientByIndex(index)}`} />
            
            {/* Artist Info */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="font-bold text-white text-sm truncate group-hover:text-spotify-green transition-colors">
                {artist.name}
              </p>
              <p className="text-xs text-spotify-light/80 truncate">
                {formatNumber(artist.followers.total)} followers
              </p>
            </div>
          </div>

          {/* Genres tooltip */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-4">
            <div className="bg-spotify-gray px-3 py-2 rounded-lg shadow-xl border border-white/10 max-w-[200px]">
              <p className="text-xs text-spotify-light truncate">
                {artist.genres.slice(0, 3).join(' • ') || 'No genres'}
              </p>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}

export default TopArtistsGrid;

