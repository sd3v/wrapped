// Spotify Configuration - Uses environment variables for security
// Create a .env file with VITE_SPOTIFY_CLIENT_ID=your_client_id

export const SPOTIFY_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '',
  
  REDIRECT_URI: typeof window !== 'undefined' 
    ? `${window.location.origin}/callback`
    : 'http://127.0.0.1:5173/callback',
  
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read',
    'user-read-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
  ].join(' '),
  
  AUTH_ENDPOINT: 'https://accounts.spotify.com/authorize',
  TOKEN_ENDPOINT: 'https://accounts.spotify.com/api/token',
  API_BASE_URL: 'https://api.spotify.com/v1',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  TOKEN_EXPIRY: 'spotify_token_expiry',
  CODE_VERIFIER: 'spotify_code_verifier',
} as const;

export const TIME_RANGES = {
  short_term: {
    label: 'Last 4 Weeks',
    description: 'Your recent favorites',
    value: 'short_term' as const,
  },
  medium_term: {
    label: 'Last 6 Months',
    description: 'Your recent history',
    value: 'medium_term' as const,
  },
  long_term: {
    label: 'All Time',
    description: 'Since you started',
    value: 'long_term' as const,
  },
} as const;

export type TimeRange = keyof typeof TIME_RANGES;
