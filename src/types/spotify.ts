// Spotify API Types

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
  country: string;
  product: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  artists: Pick<SpotifyArtist, 'id' | 'name'>[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Pick<SpotifyArtist, 'id' | 'name'>[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
}

export interface SpotifyRecentlyPlayed {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    uri: string;
  } | null;
}

export interface SpotifyPagingObject<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface SpotifyCursorPagingObject<T> {
  items: T[];
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  next: string | null;
}

// App-specific types
export interface GenreData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AudioFeatureAverage {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  liveness: number;
  tempo: number;
}

export interface WrappedData {
  user: SpotifyUser | null;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyRecentlyPlayed[];
  audioFeatures: SpotifyAudioFeatures[];
  genres: GenreData[];
  averageFeatures: AudioFeatureAverage;
  totalMinutesListened: number;
  totalTracksPlayed: number;
  uniqueArtists: number;
}

export interface TimeRangeData {
  short_term: WrappedData;
  medium_term: WrappedData;
  long_term: WrappedData;
}

// Token types
export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

