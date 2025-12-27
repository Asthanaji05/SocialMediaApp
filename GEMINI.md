# Gemini's Scratchpad

## Project Overview: Maitrilok
- **Type**: Social Media Platform
- **Stack**: MERN (MongoDB, Express, React, Node)
- **Frontend**: `Frontend/` (Vite, React, Tailwind CSS)
- **Backend**: `backend/` (Express, Mongoose)
- **Database**: MongoDB (Atlas)
- **Auth**: JWT, Google OAuth

## Observations
- **Frontend Dependencies**: `Frontend/package.json` contains standard backend packages (`express`, `mongoose`, `passport`, `ejs`). These are likely unnecessary in the frontend build and might be a remnant of a previous structure or a mistake.
- **Backend Scripts**: `backend/package.json` lacks a `start` or `dev` script. It defaults to `test` which errors.
- **Port config**: Backend runs on 3000 (default), allows CORS from 5173.

