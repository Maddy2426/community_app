# Billion Tags — Social Community App

Maddy

A production-ready social community mobile app built with **Expo SDK 56**, **React Native**, **TypeScript**, **Expo Router**, and **Redux Toolkit**.

## Features

- **Mock Authentication** — Login with username and email/mobile, persisted via AsyncStorage
- **Home Feed** — FlatList of posts with like, comment, share, and save actions
- **Create Post** — Text posts with optional image upload via Expo Image Picker
- **Comments** — View, add, and delete your own comments
- **Saved Posts** — Bookmark and manage saved posts
- **User Profile** — Stats, dark mode toggle, and logout
- **Bonus** — Search posts, pull-to-refresh, infinite scroll simulation, dark mode

## Tech Stack

| Technology | Purpose |
|---|---|
| Expo SDK 56 | React Native framework |
| TypeScript | Type safety |
| Expo Router | File-based navigation |
| Redux Toolkit | State management |
| AsyncStorage | Data persistence |
| Expo Image Picker | Photo uploads |
| Expo Linear Gradient | Purple gradient UI |

## Theme

| Token | Value |
|---|---|
| Primary | `#7C3AED` |
| Secondary | `#A855F7` |
| Background | `#F8F7FF` |
| Surface | `#FFFFFF` |
| Text | `#1F2937` |
| Border Radius | `16px` |

## Project Structure

```
src/
├── assets/          # App assets
├── components/      # Reusable UI components
├── screens/         # Screen components
├── navigation/      # Navigation notes (Expo Router in /app)
├── store/           # Redux slices and store
├── services/        # AsyncStorage & mock data
├── hooks/           # Custom hooks
├── types/           # TypeScript interfaces
└── utils/           # Theme, helpers, constants

app/                 # Expo Router routes
├── _layout.tsx      # Root layout with Redux & auth gate
├── login.tsx        # Login screen
├── comments/        # Comments stack screen
└── (tabs)/          # Bottom tab navigation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (iOS/Android) or iOS Simulator / Android Emulator

### Installation

```bash
# Clone and enter the project
cd Maddy

# Install dependencies
npm install

# Start the development server
npm start
```

### Run on Device

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web
```

Scan the QR code with **Expo Go** to run on a physical device.

## Usage

1. **Login** — Enter any username and a valid email or mobile number
2. **Browse Feed** — Scroll posts, search, pull to refresh, scroll for more
3. **Create Post** — Write text and optionally add a photo
4. **Interact** — Like, comment, share, or save posts
5. **Profile** — View stats, toggle dark mode, logout

## Redux Slices

| Slice | State |
|---|---|
| `authSlice` | User session and authentication |
| `postsSlice` | Posts, search, pagination |
| `savedPostsSlice` | Saved post IDs |

## Data Persistence

All data is stored locally using `@react-native-async-storage/async-storage`:

- User session
- Posts and comments
- Saved post IDs
- Theme preference

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Run on iOS |
| `npm run android` | Run on Android |
| `npm run web` | Run on web |

## License

MIT
