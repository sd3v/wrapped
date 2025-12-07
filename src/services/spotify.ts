import { SPOTIFY_CONFIG } from '../config/spotify';
import { authService } from './auth';
import type {
  SpotifyUser,
  SpotifyTrack,
  SpotifyArtist,
  SpotifyAudioFeatures,
  SpotifyRecentlyPlayed,
  SpotifyPagingObject,
  SpotifyCursorPagingObject,
  GenreData,
  AudioFeatureAverage,
  WrappedData,
} from '../types/spotify';

// Rate limiting configuration
const RATE_LIMIT_DELAY = 100; // ms between requests
let lastRequestTime = 0;

// Colors for genre visualization
const GENRE_COLORS = [
  '#1DB954', '#4ECDC4', '#C577F2', '#FF6B9D', '#FF8C42',
  '#FFD93D', '#4B9FFF', '#FF4757', '#2ED573', '#5352ED',
  '#FFA502', '#FF6B81', '#70A1FF', '#7BED9F', '#ECCC68',
];

// Rate limiter
async function rateLimitedFetch(url: string, options: RequestInit): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  return fetch(url, options);
}

// API request helper with automatic token refresh and retry
async function spotifyFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const token = await authService.getAccessToken();
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_CONFIG.API_BASE_URL}${endpoint}`;
  
  const response = await rateLimitedFetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  // Handle rate limiting
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
    console.warn(`Rate limited. Retrying after ${retryAfter} seconds...`);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return spotifyFetch<T>(endpoint, options, retryCount + 1);
  }
  
  // Handle token expiry
  if (response.status === 401 && retryCount < 1) {
    await authService.refreshToken();
    return spotifyFetch<T>(endpoint, options, retryCount + 1);
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API request failed: ${response.status}`);
  }
  
  return response.json();
}

// Fetch all pages of a paginated endpoint
async function fetchAllPages<T>(
  endpoint: string,
  limit = 50,
  maxItems = 50
): Promise<T[]> {
  const allItems: T[] = [];
  let offset = 0;
  
  while (allItems.length < maxItems) {
    const url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}limit=${Math.min(limit, maxItems - allItems.length)}&offset=${offset}`;
    const data = await spotifyFetch<SpotifyPagingObject<T>>(url);
    
    allItems.push(...data.items);
    
    if (!data.next || allItems.length >= maxItems) {
      break;
    }
    
    offset += limit;
  }
  
  return allItems.slice(0, maxItems);
}

// Spotify API Service
export const spotifyService = {
  // Get current user profile
  async getCurrentUser(): Promise<SpotifyUser> {
    return spotifyFetch<SpotifyUser>('/me');
  },

  // Get user's top tracks
  async getTopTracks(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit = 50
  ): Promise<SpotifyTrack[]> {
    return fetchAllPages<SpotifyTrack>(`/me/top/tracks?time_range=${timeRange}`, 50, limit);
  },

  // Get user's top artists
  async getTopArtists(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit = 50
  ): Promise<SpotifyArtist[]> {
    return fetchAllPages<SpotifyArtist>(`/me/top/artists?time_range=${timeRange}`, 50, limit);
  },

  // Get recently played tracks
  async getRecentlyPlayed(limit = 50): Promise<SpotifyRecentlyPlayed[]> {
    const data = await spotifyFetch<SpotifyCursorPagingObject<SpotifyRecentlyPlayed>>(
      `/me/player/recently-played?limit=${Math.min(limit, 50)}`
    );
    return data.items;
  },

  // Get audio features for multiple tracks
  // NOTE: This endpoint was restricted by Spotify in late 2024
  // It now requires extended quota mode approval
  async getAudioFeatures(trackIds: string[]): Promise<SpotifyAudioFeatures[]> {
    if (trackIds.length === 0) return [];
    
    try {
      const allFeatures: SpotifyAudioFeatures[] = [];
      const batchSize = 100; // Spotify allows up to 100 IDs per request
      
      for (let i = 0; i < trackIds.length; i += batchSize) {
        const batch = trackIds.slice(i, i + batchSize);
        const data = await spotifyFetch<{ audio_features: (SpotifyAudioFeatures | null)[] }>(
          `/audio-features?ids=${batch.join(',')}`
        );
        
        // Filter out null values (tracks without audio features)
        const validFeatures = data.audio_features.filter((f): f is SpotifyAudioFeatures => f !== null);
        allFeatures.push(...validFeatures);
      }
      
      return allFeatures;
    } catch (error) {
      // Audio features endpoint is restricted - return empty array
      // The app will show default/unavailable state for audio features
      console.warn('Audio features unavailable (Spotify API restriction):', error);
      return [];
    }
  },

  // Extract and count genres from artists
  extractGenres(artists: SpotifyArtist[]): GenreData[] {
    const genreCounts: Record<string, number> = {};
    
    artists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    const totalGenres = Object.values(genreCounts).reduce((a, b) => a + b, 0);
    
    const sortedGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, count], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count,
        percentage: Math.round((count / totalGenres) * 100),
        color: GENRE_COLORS[index % GENRE_COLORS.length],
      }));
    
    return sortedGenres;
  },

  // Calculate average audio features
  calculateAverageFeatures(features: SpotifyAudioFeatures[]): AudioFeatureAverage {
    if (features.length === 0) {
      return {
        danceability: 0,
        energy: 0,
        valence: 0,
        acousticness: 0,
        instrumentalness: 0,
        speechiness: 0,
        liveness: 0,
        tempo: 0,
      };
    }
    
    const sum = features.reduce(
      (acc, f) => ({
        danceability: acc.danceability + f.danceability,
        energy: acc.energy + f.energy,
        valence: acc.valence + f.valence,
        acousticness: acc.acousticness + f.acousticness,
        instrumentalness: acc.instrumentalness + f.instrumentalness,
        speechiness: acc.speechiness + f.speechiness,
        liveness: acc.liveness + f.liveness,
        tempo: acc.tempo + f.tempo,
      }),
      {
        danceability: 0,
        energy: 0,
        valence: 0,
        acousticness: 0,
        instrumentalness: 0,
        speechiness: 0,
        liveness: 0,
        tempo: 0,
      }
    );
    
    const count = features.length;
    
    return {
      danceability: Math.round((sum.danceability / count) * 100) / 100,
      energy: Math.round((sum.energy / count) * 100) / 100,
      valence: Math.round((sum.valence / count) * 100) / 100,
      acousticness: Math.round((sum.acousticness / count) * 100) / 100,
      instrumentalness: Math.round((sum.instrumentalness / count) * 100) / 100,
      speechiness: Math.round((sum.speechiness / count) * 100) / 100,
      liveness: Math.round((sum.liveness / count) * 100) / 100,
      tempo: Math.round(sum.tempo / count),
    };
  },

  // Estimate total listening time from recently played (approximation)
  calculateListeningStats(
    recentlyPlayed: SpotifyRecentlyPlayed[],
    topTracks: SpotifyTrack[]
  ): { totalMinutes: number; uniqueArtists: number; totalTracks: number } {
    // Calculate total duration from recently played
    const recentMinutes = recentlyPlayed.reduce(
      (acc, item) => acc + item.track.duration_ms / 60000,
      0
    );
    
    // Estimate based on average listening (this is a rough estimate)
    // Spotify doesn't provide actual listening time through the API
    const estimatedDailyMinutes = recentMinutes / Math.min(recentlyPlayed.length / 10, 1);
    const estimatedTotalMinutes = Math.round(estimatedDailyMinutes * 30); // Monthly estimate
    
    // Count unique artists
    const artistIds = new Set<string>();
    recentlyPlayed.forEach(item => {
      item.track.artists.forEach(artist => artistIds.add(artist.id));
    });
    topTracks.forEach(track => {
      track.artists.forEach(artist => artistIds.add(artist.id));
    });
    
    return {
      totalMinutes: Math.max(estimatedTotalMinutes, recentMinutes),
      uniqueArtists: artistIds.size,
      totalTracks: recentlyPlayed.length + topTracks.length,
    };
  },

  // Fetch all wrapped data for a time range
  async getWrappedData(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'
  ): Promise<WrappedData> {
    // Fetch data in parallel where possible
    const [user, topTracks, topArtists, recentlyPlayed] = await Promise.all([
      this.getCurrentUser(),
      this.getTopTracks(timeRange, 50),
      this.getTopArtists(timeRange, 50),
      this.getRecentlyPlayed(50),
    ]);
    
    // Get audio features for top tracks
    const trackIds = topTracks.map(track => track.id);
    const audioFeatures = await this.getAudioFeatures(trackIds);
    
    // Process data
    const genres = this.extractGenres(topArtists);
    const averageFeatures = this.calculateAverageFeatures(audioFeatures);
    const stats = this.calculateListeningStats(recentlyPlayed, topTracks);
    
    return {
      user,
      topTracks,
      topArtists,
      recentlyPlayed,
      audioFeatures,
      genres,
      averageFeatures,
      totalMinutesListened: stats.totalMinutes,
      totalTracksPlayed: stats.totalTracks,
      uniqueArtists: stats.uniqueArtists,
    };
  },
};

export default spotifyService;

