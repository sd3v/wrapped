import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSpotifyData } from '../hooks/useSpotifyData';
import { Button, Card, LoadingSpinner, StatCard, TimeRangeSelector } from '../components/ui';
import { TopTracksList, TopArtistsGrid, GenreCloud } from '../components/wrapped';
import { GenreChart } from '../components/charts';
import { formatMinutes, getImageUrl, getMoodFromFeatures } from '../utils/helpers';

export function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data, isLoading, error, timeRange, setTimeRange, refetch } = useSpotifyData();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-dark via-spotify-black to-[#1a1a2e]">
        <div className="text-center">
          <LoadingSpinner size="lg" message="Loading your music data..." />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-4 text-spotify-light text-sm"
          >
            This might take a moment...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-spotify-dark via-spotify-black to-[#1a1a2e] px-4">
        <Card variant="glass" className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-wrapped-red/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-wrapped-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Data</h2>
          <p className="text-spotify-light mb-6">{error || 'Something went wrong. Please try again.'}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-dark via-spotify-black to-[#1a1a2e]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-spotify-green/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-wrapped-purple/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-spotify-dark/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-spotify-green" viewBox="0 0 496 512" fill="currentColor">
                <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
              </svg>
              <span className="font-bold text-lg hidden sm:block" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Your Wrapped
              </span>
            </div>

            {/* User info & logout */}
            <div className="flex items-center gap-4">
              {data.user && (
                <div className="hidden sm:flex items-center gap-3">
                  {data.user.images[0] && (
                    <img
                      src={getImageUrl(data.user.images, 'small')}
                      alt={data.user.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-white font-medium">{data.user.display_name}</span>
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={timeRange}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Welcome section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                <span className="text-white">Hey, </span>
                <span className="gradient-text">{data.user?.display_name?.split(' ')[0] || 'there'}!</span>
              </h1>
              <p className="text-spotify-light text-lg mb-8">
                Here's what you've been listening to
              </p>
              
              {/* Time range selector */}
              <div className="flex justify-center mb-8">
                <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
              </div>
            </motion.section>

            {/* Stats overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={
                    <svg className="w-6 h-6 text-spotify-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  }
                  value={data.topTracks.length}
                  label="Top Tracks"
                  index={0}
                />
                <StatCard
                  icon={
                    <svg className="w-6 h-6 text-wrapped-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                  value={data.uniqueArtists}
                  label="Unique Artists"
                  index={1}
                />
                <StatCard
                  icon={
                    <svg className="w-6 h-6 text-wrapped-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  }
                  value={data.genres.length}
                  label="Genres Explored"
                  index={2}
                />
                <StatCard
                  icon={
                    <svg className="w-6 h-6 text-wrapped-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  value={formatMinutes(data.totalMinutesListened)}
                  label="Est. Listening Time"
                  index={3}
                />
              </div>
            </motion.section>

            {/* Your Music Mood - only show if audio features are available */}
            {(data.averageFeatures.energy > 0 || data.averageFeatures.valence > 0) && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <Card variant="gradient" padding="lg" className="text-center relative overflow-hidden">
                  <div className="absolute inset-0 animated-gradient opacity-10" />
                  <div className="relative z-10">
                    <p className="text-sm text-spotify-light mb-2 uppercase tracking-wider">Your Music Mood</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      {getMoodFromFeatures(data.averageFeatures)}
                    </h2>
                    <p className="text-spotify-light max-w-md mx-auto">
                      Based on the energy and mood of your most played tracks
                    </p>
                  </div>
                </Card>
              </motion.section>
            )}

            {/* Top Tracks */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Your Top Tracks
                </h2>
                {data.topTracks[0] && (
                  <span className="text-sm text-spotify-light">
                    #{1} is <span className="text-spotify-green font-medium">{data.topTracks[0].name}</span>
                  </span>
                )}
              </div>
              <Card variant="glass" padding="lg">
                <TopTracksList tracks={data.topTracks} limit={10} />
              </Card>
            </motion.section>

            {/* Top Artists */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Your Top Artists
                </h2>
                {data.topArtists[0] && (
                  <span className="text-sm text-spotify-light">
                    #{1} is <span className="text-wrapped-purple font-medium">{data.topArtists[0].name}</span>
                  </span>
                )}
              </div>
              <TopArtistsGrid artists={data.topArtists} limit={12} />
            </motion.section>

            {/* Two column layout for genres */}
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              {/* Genre Distribution */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Your Genres
                </h2>
                <Card variant="glass" padding="lg" className="h-full">
                  <GenreChart genres={data.genres} />
                </Card>
              </motion.section>

              {/* Genre Cloud */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  Genre Cloud
                </h2>
                <Card variant="gradient" padding="lg" className="h-full flex items-center justify-center min-h-[400px]">
                  <GenreCloud genres={data.genres} limit={20} />
                </Card>
              </motion.section>
            </div>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center py-8 border-t border-white/5"
            >
              <p className="text-spotify-light/50 text-sm">
                Data provided by Spotify Web API • Your listening data stays private
              </p>
              <p className="text-spotify-light/30 text-xs mt-2">
                Built with React, TypeScript, and love for music
              </p>
            </motion.footer>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Dashboard;

