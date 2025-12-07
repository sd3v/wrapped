import { useState, useEffect, useCallback } from 'react';
import { spotifyService } from '../services/spotify';
import type { WrappedData } from '../types/spotify';
import type { TimeRange } from '../config/spotify';

interface UseSpotifyDataReturn {
  data: WrappedData | null;
  isLoading: boolean;
  error: string | null;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  refetch: () => Promise<void>;
}

export function useSpotifyData(initialTimeRange: TimeRange = 'medium_term'): UseSpotifyDataReturn {
  const [data, setData] = useState<WrappedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const wrappedData = await spotifyService.getWrappedData(timeRange);
      setData(wrappedData);
    } catch (err) {
      console.error('Failed to fetch Spotify data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    refetch: fetchData,
  };
}

export default useSpotifyData;

