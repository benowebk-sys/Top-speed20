# Vercel Deployment Guide

## Option 1: Vercel Dashboard (Recommended - Easy)

### Steps:
1. **Go to Vercel**: https://vercel.com
2. **Log in or Sign up** with GitHub account
3. **Import Project**:
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Search for repository: `Top-speed20`
   - Click "Import"

4. **Configure Project**:
   - **Project Name**: `top-speed` (or your preferred name)
   - **Framework Preset**: Select "Other"
   - **Root Directory**: Leave as is or select `./`

5. **Environment Variables** (Critical!):
   
   **For Frontend** (`frontend/` folder):
   ```
   VITE_API_URL=YOUR_BACKEND_URL
   ```
   (Will be set after backend is deployed)

   **For Backend** (`backend/` folder):
   ```
   DATABASE_URL=YOUR_MONGODB_URL
   FRONTEND_URL=YOUR_FRONTEND_URL
   JWT_SECRET=top_speed_secret_key_2026
   EMAIL_USER=ngtr613@gmail.com
   EMAIL_PASS=lbnuegpnxzuvenji
   BACKEND_PORT=3000 (Vercel assigns this)
   ```

6. **Deployment Order**:
   - **Deploy Backend First** (Set as root project or separate project)
   - Then **Deploy Frontend** (Update VITE_API_URL with backend URL)

---

## Option 2: Using Vercel CLI (Advanced)

### Install Vercel CLI:
```bash
npm i -g vercel
```

### Deploy Backend:
```bash
cd backend
vercel --prod
```

### Deploy Frontend:
```bash
cd frontend
vercel --prod
```

---

## Important URLs:
- **GitHub Repository**: https://github.com/benowebk-sys/Top-speed20
- **MongoDB Atlas**: https://cloud.mongodb.com (Update connection string if needed)
- **Email Service**: Gmail SMTP with app password

---

## Post-Deployment Checklist:
- [ ] Backend API is accessible
- [ ] Frontend connects to backend
- [ ] Email verification works
- [ ] QR code payment page displays
- [ ] All 54 cars load from database
- [ ] Authentication flow (signup → verify → login) works

---

## Troubleshooting:
- **CORS errors**: Update FRONTEND_URL in backend .env
- **Images not loading**: Ensure car images are in `frontend/public/images/cars/`
- **Email not sending**: Check Gmail app password validity
- **Database connection**: Verify MongoDB Atlas IP whitelist includes Vercel IPs

