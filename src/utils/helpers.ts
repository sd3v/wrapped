// Format duration from milliseconds to mm:ss
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Format minutes to hours and minutes
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Get image URL at preferred size
export function getImageUrl(
  images: Array<{ url: string; height: number | null; width: number | null }>,
  preferredSize: 'small' | 'medium' | 'large' = 'medium'
): string {
  if (!images || images.length === 0) {
    return '/placeholder.jpg';
  }
  
  const sizeMap = {
    small: 64,
    medium: 300,
    large: 640,
  };
  
  const targetSize = sizeMap[preferredSize];
  
  // Find the image closest to the preferred size
  const sorted = [...images].sort((a, b) => {
    const aDiff = Math.abs((a.width || 0) - targetSize);
    const bDiff = Math.abs((b.width || 0) - targetSize);
    return aDiff - bDiff;
  });
  
  return sorted[0]?.url || images[0]?.url;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Get audio feature label
export function getAudioFeatureLabel(feature: string): string {
  const labels: Record<string, string> = {
    danceability: 'Danceability',
    energy: 'Energy',
    valence: 'Mood',
    acousticness: 'Acoustic',
    instrumentalness: 'Instrumental',
    speechiness: 'Vocal',
    liveness: 'Live Feel',
    tempo: 'Tempo',
  };
  return labels[feature] || feature;
}

// Get audio feature description
export function getAudioFeatureDescription(feature: string, value: number): string {
  const descriptions: Record<string, (v: number) => string> = {
    danceability: (v) => v > 0.7 ? 'Very danceable!' : v > 0.4 ? 'Moderately groovy' : 'More for listening',
    energy: (v) => v > 0.7 ? 'High energy!' : v > 0.4 ? 'Balanced energy' : 'Chill vibes',
    valence: (v) => v > 0.7 ? 'Very positive!' : v > 0.4 ? 'Mixed emotions' : 'Melancholic mood',
    acousticness: (v) => v > 0.7 ? 'Very acoustic' : v > 0.4 ? 'Some acoustic elements' : 'Mostly electronic',
    instrumentalness: (v) => v > 0.5 ? 'Mostly instrumental' : 'Vocals prominent',
    speechiness: (v) => v > 0.66 ? 'Spoken word' : v > 0.33 ? 'Some speech' : 'Mostly music',
    liveness: (v) => v > 0.8 ? 'Likely live' : 'Studio recording',
  };
  
  return descriptions[feature]?.(value) || '';
}

// Calculate mood based on audio features
export function getMoodFromFeatures(features: { valence: number; energy: number }): string {
  const { valence, energy } = features;
  
  if (valence > 0.6 && energy > 0.6) return '🎉 Energetic & Happy';
  if (valence > 0.6 && energy <= 0.6) return '😊 Peaceful & Content';
  if (valence <= 0.6 && energy > 0.6) return '🔥 Intense & Powerful';
  if (valence <= 0.4 && energy <= 0.4) return '🌙 Melancholic & Calm';
  return '🎵 Balanced & Versatile';
}

// Generate gradient based on position
export function getGradientByIndex(index: number): string {
  const gradients = [
    'from-spotify-green to-wrapped-teal',
    'from-wrapped-purple to-wrapped-pink',
    'from-wrapped-blue to-wrapped-purple',
    'from-wrapped-orange to-wrapped-yellow',
    'from-wrapped-pink to-wrapped-red',
    'from-wrapped-teal to-wrapped-blue',
    'from-wrapped-yellow to-wrapped-orange',
    'from-wrapped-red to-wrapped-purple',
  ];
  return gradients[index % gradients.length];
}

// Delay utility for staggered animations
export function staggerDelay(index: number, baseDelay = 0.1): number {
  return index * baseDelay;
}

// Clamp a number between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

