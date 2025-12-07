import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/ui';

export function Callback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleCallback, error } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    if (code) {
      handleCallback(code)
        .then(() => {
          setStatus('success');
          setTimeout(() => navigate('/dashboard'), 1500);
        })
        .catch(() => {
          setStatus('error');
          setTimeout(() => navigate('/'), 3000);
        });
    } else {
      setStatus('error');
      setTimeout(() => navigate('/'), 3000);
    }
  }, [searchParams, handleCallback, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-spotify-dark via-spotify-black to-[#1a1a2e]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {status === 'processing' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-6"
            >
              <svg className="w-20 h-20 text-spotify-green" viewBox="0 0 496 512" fill="currentColor">
                <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">Connecting to Spotify...</h2>
            <p className="text-spotify-light">Please wait while we authenticate your account</p>
          </>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-spotify-green/20 flex items-center justify-center">
              <motion.svg
                className="w-10 h-10 text-spotify-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </motion.svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Successfully Connected!</h2>
            <p className="text-spotify-light">Redirecting to your dashboard...</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-wrapped-red/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-wrapped-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
            <p className="text-spotify-light mb-4">{error || 'Something went wrong. Please try again.'}</p>
            <p className="text-sm text-spotify-light/50">Redirecting back to login...</p>
          </motion.div>
        )}

        {status === 'processing' && (
          <div className="mt-8">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Callback;

