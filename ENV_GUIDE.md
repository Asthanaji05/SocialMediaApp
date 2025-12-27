# Environment Variables Guide

This document explains all environment variables needed for Moscownpur Circles.

## 📋 Quick Setup

1. Copy `.env.example` files:
   ```bash
   # Frontend
   cp Frontend/.env.example Frontend/.env
   
   # Backend
   cp backend/.env.example backend/.env
   ```

2. Fill in your actual values in the `.env` files

---

## 🔐 Backend Environment Variables

### Database
- **`MONGODB_URI`** - MongoDB connection string
  - Get from: [MongoDB Atlas](https://cloud.mongodb.com)
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Server
- **`PORT`** - Server port (default: 3000)
- **`NODE_ENV`** - Environment (`development` or `production`)

### Authentication
- **`SESSION_SECRET`** - Secret for session encryption
  - Generate: `openssl rand -base64 32`
- **`JWT_SECRET`** - Secret for JWT tokens
  - Generate: `openssl rand -base64 32`

### Google OAuth
- **`GOOGLE_CLIENT_ID`** - Google OAuth Client ID
- **`GOOGLE_CLIENT_SECRET`** - Google OAuth Client Secret
  - Get from: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Supabase (Moscownpur RealM)
- **`REALM_SUPABASE_URL`** - Supabase project URL
- **`REALM_SUPABASE_ANON_KEY`** - Supabase anonymous key
- **`REALM_SUPABASE_ACCESS_TOKEN`** - Supabase service role key
  - Get from: [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API

### Firebase (Optional)
- **`VITE_FIREBASE_*`** - Firebase configuration for file uploads
  - Get from: [Firebase Console](https://console.firebase.google.com)

### Production Only
- **`FRONTEND_URL`** - Frontend URL for CORS (e.g., `https://your-app.onrender.com`)

---

## 🎨 Frontend Environment Variables

### Google OAuth
- **`GOOGLE_CLIENT_ID`** - Same as backend
- **`GOOGLE_CLIENT_SECRET`** - Same as backend

### Supabase (Moscownpur RealM)
- **`VITE_REALM_SUPABASE_URL`** - Same as backend `REALM_SUPABASE_URL`
- **`VITE_REALM_SUPABASE_ANON_KEY`** - Same as backend `REALM_SUPABASE_ANON_KEY`
- **`VITE_REALM_SUPABASE_ACCESS_TOKEN`** - Same as backend `REALM_SUPABASE_ACCESS_TOKEN`
- **`VITE_SUPABASE_URL`** - Fallback URL (same as `VITE_REALM_SUPABASE_URL`)

### Firebase (Optional)
- **`VITE_FIREBASE_*`** - Same as backend Firebase config

### Production Only
- **`VITE_API_URL`** - Backend API URL (e.g., `https://your-backend.onrender.com`)

---

## 🚀 Render Deployment

When deploying to Render, add these environment variables in the Render Dashboard:

### Required
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REALM_SUPABASE_URL=your_supabase_url
REALM_SUPABASE_ANON_KEY=your_anon_key
REALM_SUPABASE_ACCESS_TOKEN=your_service_role_key
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
PORT=10000
FRONTEND_URL=https://your-app.onrender.com
```

### Optional
```env
SESSION_SECRET=your_session_secret
VITE_FIREBASE_API_KEY=your_firebase_key
# ... other Firebase variables
```

---

## 🔒 Security Notes

- ⚠️ **Never commit `.env` files** to Git
- ✅ `.env` files are already in `.gitignore`
- ✅ Only commit `.env.example` files
- 🔐 Use strong, random secrets for `JWT_SECRET` and `SESSION_SECRET`
- 🔐 Keep `REALM_SUPABASE_ACCESS_TOKEN` (service role key) secret

---

## 🧪 Testing Locally

1. Ensure all variables are set in both `.env` files
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd Frontend && npm run dev`
4. Visit: `http://localhost:5173`

---

## 📚 Additional Resources

- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Setup](https://supabase.com/docs/guides/getting-started)
- [Firebase Setup](https://firebase.google.com/docs/web/setup)
