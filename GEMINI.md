# Gemini's Scratchpad

## Project Overview: Maitrilok
- **Type**: Social Media Platform
- **Stack**: MERN (MongoDB, Express, React, Node)
- **Frontend**: `Frontend/` (Vite, React, Tailwind CSS)
- **Backend**: `backend/` (Express, Mongoose)
- **Database**: MongoDB (Atlas)
- **Auth**: JWT, Google OAuth

## Observations
- [x] Clean up Frontend dependencies (remove backend packages).
- [x] Add `start` and `dev` scripts to backend `package.json`.
- [x] Set up ShadCN UI (initialized & button added).
- [x] Clean up Frontend dependencies (remove backend packages).
- [x] Add `start` and `dev` scripts to backend `package.json`.
- [x] Set up ShadCN UI (initialized & button added).
- [x] Rebrand to "Moscownpur Circles" (Logo, Fonts, Home Page).
- [x] Redesign Navbar (Floating Glass Island).
- [x] Redesign Profile Page (Immersive Tabbed UI).
- [x] Unique Reach (Impression) Tracking:
    - [x] Private to creator (only owner sees reach).
    - [x] Unique viewer logic (tracked via `viewers` array in Post schema).
    - [x] Frontend observer to trigger reach on 50% visibility.
- [x] Real-time Pulse (WebSockets):
    - [x] Centralized socket utility (`socket.js`).
    - [x] Live Feed: New creations appear instantly.
    - [x] Live Updates: Edits and Likes sync across all orbits in real-time.
- [x] Trending Intelligence:
    - [x] Automated Hashtag extraction from descriptions.
    - [x] Real-time Trending sidebar (recalculated & broadcasted on every post/edit).
- [x] Navigation Polish:
    - [x] "Bookmarks" sidebar link mapped to `Profile > Saved` tab.
    - [x] Deep-linking support for Profile tabs via URL search params.
- [x] UI/UX & Bug Fixes:
    - [x] Redesigned SearchBar (Glassmorphism, Avatars, Glowing states).
    - [x] Fixed "Ghost/Blank Post" creation glitch (corrected `user.image` reference).
    - [x] Hardened backend against `CastError` for invalid Signal IDs.
- **Port config**: Backend runs on 3000 (default), allows CORS from 5173.
