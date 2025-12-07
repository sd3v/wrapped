# 🎵 Spotify Wrapped

Your personal Spotify analytics dashboard - see your top tracks, artists, and genres.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)

## 🚀 Quick Start

### 1. Create a Spotify App

Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and create a new app.

Set the **Redirect URI** to:
```
http://127.0.0.1:5173/callback
```

### 2. Setup

```bash
# Clone & install
git clone <repo>
cd wrapped
npm install

# Add your Client ID
cp .env.example .env
# Edit .env and add your VITE_SPOTIFY_CLIENT_ID

# Run
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) 🎉

## 📁 Project Structure

```
src/
├── components/     # UI & chart components
├── config/         # Spotify config (uses .env)
├── hooks/          # React hooks
├── pages/          # Login, Callback, Dashboard
├── services/       # Auth & API services
└── types/          # TypeScript types
```

## ⚠️ Note

The Spotify Audio Features API is restricted since late 2024 and requires [extended quota approval](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

---

Built with React, TypeScript, Tailwind CSS, Framer Motion & Recharts
