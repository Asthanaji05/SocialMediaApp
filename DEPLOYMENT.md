# Moscownpur Circles - Render Deployment Guide

## 🚀 Quick Deploy to Render (Monorepo)

This guide will help you deploy both the frontend and backend as a single unified service on Render.

### Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas database
- Supabase account
- Google OAuth credentials

---

## Step 1: Prepare Your Repository

1. **Commit all changes:**
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

2. **Ensure these files exist:**
- ✅ `render.yaml` (deployment config)
- ✅ `build.sh` (build script)
- ✅ `backend/server.js` (updated with static file serving)

---

## Step 2: Deploy on Render

### Option A: Blueprint Deployment (Recommended)

1. Go to [render.com](https://render.com) and sign in
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click **"Apply"**

### Option B: Manual Deployment

1. Go to [render.com](https://render.com) and sign in
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `moscownpur-circles`
   - **Runtime**: `Node`
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `cd backend && NODE_ENV=production npm start`
   - **Plan**: `Free`

---

## Step 3: Add Environment Variables

In Render Dashboard → Environment:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REALM_SUPABASE_URL=https://rqhyepbqlokrccsrpnlc.supabase.co
REALM_SUPABASE_ANON_KEY=your_supabase_anon_key
REALM_SUPABASE_ACCESS_TOKEN=your_supabase_service_role_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=10000
FRONTEND_URL=https://moscownpur-circles.onrender.com
```

**Note:** Replace `moscownpur-circles` with your actual Render service name.

---

## Step 4: Post-Deployment Configuration

### 1. Update Supabase Redirect URLs

Go to Supabase Dashboard → Authentication → URL Configuration:

Add these URLs:
- `https://your-app-name.onrender.com/login`
- `https://your-custom-domain.com/login` (if using custom domain)

### 2. Update Google OAuth

Go to Google Cloud Console → Credentials:

Add to **Authorized redirect URIs**:
- `https://your-app-name.onrender.com`
- `https://rqhyepbqlokrccsrpnlc.supabase.co/auth/v1/callback`

### 3. Update MongoDB Network Access

In MongoDB Atlas:
- Go to Network Access
- Add `0.0.0.0/0` to allow connections from Render
- Or add Render's IP addresses (check Render docs for current IPs)

---

## Step 5: Verify Deployment

1. **Check Build Logs** in Render dashboard
2. **Visit your app**: `https://your-app-name.onrender.com`
3. **Test features**:
   - ✅ Login/Signup
   - ✅ Moscownpur ID authentication
   - ✅ Real-time features (WebSockets)
   - ✅ Profile sync

---

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure `build.sh` has execute permissions
- Verify all dependencies are in `package.json`

### App Crashes
- Check runtime logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string

### CORS Errors
- Verify `FRONTEND_URL` environment variable
- Check `server.js` CORS configuration
- Ensure Supabase/Google OAuth URLs are updated

### WebSocket Issues
- Render's free tier may have limitations
- Check Socket.IO connection in browser console
- Verify CORS settings include your Render URL

---

## Custom Domain (Optional)

1. In Render Dashboard → Settings → Custom Domain
2. Add your domain (e.g., `circles.moscownpur.com`)
3. Update DNS records as instructed by Render
4. Update environment variables and OAuth settings with new domain

---

## Monitoring

- **Logs**: Render Dashboard → Logs
- **Metrics**: Render Dashboard → Metrics
- **Alerts**: Set up in Render Dashboard → Settings

---

## Free Tier Limitations

- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ 750 hours/month free (enough for one service)
- ⚠️ Cold starts may take 30-60 seconds

**Tip:** Upgrade to paid tier ($7/month) for:
- ✅ No spin-down
- ✅ Faster performance
- ✅ More resources

---

## Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Your deployment logs in Render dashboard

---

**🎉 Your Moscownpur Circles is now live!**
