import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { AudioFeatureAverage } from '../../types/spotify';
import { getAudioFeatureLabel, getAudioFeatureDescription } from '../../utils/helpers';

interface AudioFeaturesChartProps {
  features: AudioFeatureAverage;
  isAvailable?: boolean;
}

export function AudioFeaturesChart({ features, isAvailable = true }: AudioFeaturesChartProps) {
  // Check if we have valid data
  const hasData = isAvailable && (
    features.danceability > 0 ||
    features.energy > 0 ||
    features.valence > 0
  );

  if (!hasData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
          <svg className="w-8 h-8 text-spotify-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Audio Analysis Unavailable</h3>
        <p className="text-sm text-spotify-light max-w-xs">
          Spotify has restricted the audio features API. This feature requires extended quota approval.
        </p>
        <a 
          href="https://developer.spotify.com/documentation/web-api/concepts/quota-modes"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-xs text-spotify-green hover:underline"
        >
          Learn more about Spotify API quotas →
        </a>
      </motion.div>
    );
  }

  const data = [
    { feature: 'Danceability', value: features.danceability * 100, fullMark: 100 },
    { feature: 'Energy', value: features.energy * 100, fullMark: 100 },
    { feature: 'Mood', value: features.valence * 100, fullMark: 100 },
    { feature: 'Acoustic', value: features.acousticness * 100, fullMark: 100 },
    { feature: 'Live Feel', value: features.liveness * 100, fullMark: 100 },
    { feature: 'Vocal', value: (1 - features.instrumentalness) * 100, fullMark: 100 },
  ];

  const featureDescriptions = [
    { key: 'danceability', label: 'Danceability', value: features.danceability },
    { key: 'energy', label: 'Energy', value: features.energy },
    { key: 'valence', label: 'Mood', value: features.valence },
    { key: 'acousticness', label: 'Acousticness', value: features.acousticness },
  ];

  return (
    <div className="space-y-6">
      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[300px] sm:h-[350px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid 
              stroke="rgba(255,255,255,0.1)" 
              strokeDasharray="3 3"
            />
            <PolarAngleAxis 
              dataKey="feature" 
              tick={{ fill: '#B3B3B3', fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#B3B3B3', fontSize: 10 }}
              axisLine={false}
              tickCount={5}
            />
            <Radar
              name="Your Music"
              dataKey="value"
              stroke="#1DB954"
              fill="#1DB954"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#282828',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [`${Math.round(value)}%`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Feature bars */}
      <div className="grid grid-cols-2 gap-4">
        {featureDescriptions.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-spotify-light">{getAudioFeatureLabel(item.key)}</span>
              <span className="text-white font-medium">{Math.round(item.value * 100)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, #1DB954, ${item.value > 0.5 ? '#4ECDC4' : '#C577F2'})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${item.value * 100}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-spotify-light/70">
              {getAudioFeatureDescription(item.key, item.value)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Average Tempo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center justify-center gap-4 p-4 bg-white/5 rounded-xl"
      >
        <div className="text-center">
          <p className="text-3xl font-bold text-spotify-green">{features.tempo}</p>
          <p className="text-sm text-spotify-light">Average BPM</p>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="text-center">
          <p className="text-lg text-white">
            {features.tempo < 100 ? '🐢 Slow & Steady' : features.tempo < 120 ? '🚶 Moderate Pace' : '🏃 Fast & Energetic'}
          </p>
          <p className="text-xs text-spotify-light">Your tempo preference</p>
        </div>
      </motion.div>
    </div>
  );
}

export default AudioFeaturesChart;

