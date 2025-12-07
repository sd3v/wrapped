import { SPOTIFY_CONFIG, STORAGE_KEYS } from '../config/spotify';
import type { TokenData } from '../types/spotify';

// PKCE Helper functions
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

function base64urlEncode(input: ArrayBuffer): string {
  const bytes = new Uint8Array(input);
  let str = '';
  bytes.forEach((byte) => {
    str += String.fromCharCode(byte);
  });
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const hashed = await sha256(verifier);
  return base64urlEncode(hashed);
}

// Auth Service
export const authService = {
  // Generate and store code verifier, then redirect to Spotify
  async login(): Promise<void> {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Store code verifier for later use
    localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);
    
    const params = new URLSearchParams({
      client_id: SPOTIFY_CONFIG.CLIENT_ID,
      response_type: 'code',
      redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
      scope: SPOTIFY_CONFIG.SCOPES,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      show_dialog: 'true',
    });
    
    window.location.href = `${SPOTIFY_CONFIG.AUTH_ENDPOINT}?${params.toString()}`;
  },

  // Exchange authorization code for tokens
  async handleCallback(code: string): Promise<TokenData> {
    const codeVerifier = localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found. Please try logging in again.');
    }
    
    const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: SPOTIFY_CONFIG.CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Failed to exchange code for tokens');
    }
    
    const data: TokenData = await response.json();
    
    // Store tokens
    this.setTokens(data);
    
    // Clean up code verifier
    localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
    
    return data;
  },

  // Refresh access token
  async refreshToken(): Promise<TokenData | null> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      return null;
    }
    
    try {
      const response = await fetch(SPOTIFY_CONFIG.TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: SPOTIFY_CONFIG.CLIENT_ID,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });
      
      if (!response.ok) {
        this.logout();
        return null;
      }
      
      const data: TokenData = await response.json();
      this.setTokens(data);
      
      return data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return null;
    }
  },

  // Store tokens in localStorage
  setTokens(data: TokenData): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
    if (data.refresh_token) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
    }
    
    // Calculate expiry time (subtract 60 seconds for safety margin)
    const expiryTime = Date.now() + (data.expires_in - 60) * 1000;
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
  },

  // Get current access token (refresh if needed)
  async getAccessToken(): Promise<string | null> {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const expiryTime = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    
    if (!accessToken) {
      return null;
    }
    
    // Check if token is expired or about to expire
    if (expiryTime && Date.now() >= parseInt(expiryTime, 10)) {
      const refreshedData = await this.refreshToken();
      return refreshedData?.access_token || null;
    }
    
    return accessToken;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Logout
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  },
};

export default authService;

