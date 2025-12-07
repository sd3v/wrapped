import { motion } from 'framer-motion';
import type { SpotifyTrack } from '../../types/spotify';
import { formatDuration, getImageUrl, getGradientByIndex } from '../../utils/helpers';

interface TopTracksListProps {
  tracks: SpotifyTrack[];
  limit?: number;
}

export function TopTracksList({ tracks, limit = 10 }: TopTracksListProps) {
  const displayTracks = tracks.slice(0, limit);

  return (
    <div className="space-y-3">
      {displayTracks.map((track, index) => (
        <motion.a
          key={track.id}
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, x: 8 }}
          className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group border border-transparent hover:border-white/10"
        >
          {/* Rank */}
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold ${
            index < 3 
              ? `bg-gradient-to-br ${getGradientByIndex(index)} text-white` 
              : 'bg-white/10 text-spotify-light'
          }`}>
            {index + 1}
          </div>

          {/* Album Art */}
          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={getImageUrl(track.album.images, 'small')}
              alt={track.album.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate group-hover:text-spotify-green transition-colors">
              {track.name}
            </p>
            <p className="text-sm text-spotify-light truncate">
              {track.artists.map(a => a.name).join(', ')}
            </p>
          </div>

          {/* Duration */}
          <span className="text-sm text-spotify-light hidden sm:block">
            {formatDuration(track.duration_ms)}
          </span>

          {/* Popularity indicator */}
          <div className="hidden md:flex items-center gap-1">
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-spotify-green rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${track.popularity}%` }}
                transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
              />
            </div>
          </div>

          {/* External link icon */}
          <svg 
            className="w-4 h-4 text-spotify-light opacity-0 group-hover:opacity-100 transition-opacity" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.a>
      ))}
    </div>
  );
}

export default TopTracksList;

