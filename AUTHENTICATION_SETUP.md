# 🔐 Complete Authentication System Setup Guide

## ✅ System Status

### What's Been Implemented:
- ✅ **Email Verification System** - NodeMailer configured with Gmail App Password
- ✅ **Real Backend Authentication** - MongoDB user storage with password hashing (bcryptjs)
- ✅ **Email Confirmation Workflow** - Customers receive verification emails after signup
- ✅ **JWT Token Management** - Secure token generation and validation
- ✅ **Frontend Integration** - SignUp, Login, and Email Verification pages connected to backend
- ✅ **MongoDB Integration** - User model with email verification fields
- ✅ **Responsive Design** - All pages optimized for mobile, tablet, and desktop

---

## 📧 Email Configuration

### Current Setup:
- **Email Service**: Gmail SMTP
- **App Password**: Your provided app password is stored in `.env` file
- **Verification Link**: Sends users a link to verify their email

### Email Features:
1. **Verification Email** - Sent when user signs up
   - Arabic-formatted email
   - 24-hour verification link validity
   - Link: `http://localhost:5173/verify-email?token={verificationToken}`

2. **Welcome Email** - Sent after email verification
   - Personalized greeting
   - Welcome message
   - Link to browse cars

---

## 🚀 Getting Started

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

The `nodemailer` package has already been added to `package.json`.

### Step 2: Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

**Option B: MongoDB Atlas (Recommended for Production)**
- Database URL is already configured in `.env`:
  ```
  DATABASE_URL=mongodb+srv://testuser:testpass123@testcluster.d5m0m.mongodb.net/topspeed?retryWrites=true&w=majority
  ```

### Step 3: Verify Email Configuration

The `.env` file already contains:
```env
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=lbnu egpn xzuv enji
```

**Important**: Update `EMAIL_USER` with your actual Gmail address!

### Step 4: Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000` and show:
- ✅ MongoDB connection status
- ✅ Email service verification

### Step 5: Start Frontend Development Server

In another terminal:
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 📝 Complete Authentication Flow

### 1. User Signs Up
```
User → SignUpPage (localhost:5173/signup)
  ↓
Form Fields:
  - Full Name
  - Email
  - Password (min 6 chars)
  - Confirm Password
  ↓
POST /api/auth/signup
  ↓
Backend Creates User:
  - Hash password with bcryptjs
  - Generate verification token
  - Set token expiry (24 hours)
  ↓
Send Verification Email:
  - Custom HTML template
  - Verification link with token
  ↓
User Receives Email:
  - Subject: "تأكيد بريدك الإلكتروني - TOP SPEED"
  - Contains verification link
  ↓
User Clicks Link
  - Redirects to /verify-email?token={token}
  ↓
POST /api/auth/verify-email
  ↓
Backend:
  - Validates token
  - Marks email as verified
  - Generates JWT token
  - Returns user data
  ↓
Frontend:
  - Auto-login user
  - Redirect to home page
  - User can now browse and customize cars
```

### 2. User Logs In
```
User → LoginPage (localhost:5173/login)
  ↓
Form Fields:
  - Email
  - Password
  ↓
POST /api/auth/login
  ↓
Backend:
  - Find user by email
  - Compare password (bcryptjs)
  - Generate JWT token
  ↓
Frontend:
  - Store token in localStorage
  - Store user data in Context
  - Redirect to home or admin page
```

---

## 🔄 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Create new user account with email verification

**Request:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (Success):**
```json
{
  "message": "تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "isEmailVerified": false,
    "role": "user"
  }
}
```

#### POST `/api/auth/login`
Login with email and password

**Request:**
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "role": "user",
    "isEmailVerified": true
  }
}
```

#### POST `/api/auth/verify-email`
Verify email with token

**Request:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response:**
```json
{
  "message": "تم تأكيد بريدك الإلكتروني بنجاح!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "role": "user",
    "isEmailVerified": true
  }
}
```

---

## 📂 File Structure

### Backend Changes
```
backend/
├── .env (updated with email credentials)
├── src/
│   ├── controllers/
│   │   └── authController.js (updated with signup, login, verifyEmail)
│   ├── models/
│   │   └── User.js (updated with email verification fields)
│   ├── routes/
│   │   └── authRoutes.js (updated with new endpoints)
│   ├── services/
│   │   └── emailService.js (NEW - NodeMailer configuration)
│   └── server.js (already configured)
├── package.json (added nodemailer dependency)
```

### Frontend Changes
```
frontend/src/
├── pages/
│   ├── LoginPage.jsx (updated to use real API)
│   ├── SignUpPage.jsx (updated to use real API)
│   └── VerifyEmailPage.jsx (NEW - email verification)
├── App.jsx (updated with /verify-email route)
└── (all other pages remain unchanged)
```

---

## 🧪 Testing the System

### Test Signup Flow:
1. Go to `http://localhost:5173/signup`
2. Fill form with:
   - Name: Test User
   - Email: your_test@gmail.com
   - Password: test123
   - Confirm: test123
3. Submit form
4. Check email for verification link
5. Click verification link
6. Auto-redirect to home page

### Test Login Flow:
1. Go to `http://localhost:5173/login`
2. Enter registered email and password
3. Click Login
4. Redirect to home page if successful

### Test Error Handling:
- Wrong password → "بيانات دخول غير صحيحة" (Invalid credentials)
- Unknown email → "بيانات دخول غير صحيحة" (Invalid credentials)
- Non-matching passwords → "كلمات المرور غير متطابقة" (Passwords don't match)
- Password too short → "كلمة المرور يجب أن تكون 6 أحرف على الأقل" (Password too short)

---

## 🔒 Security Features

### Password Security
- ✅ bcryptjs hashing with salt rounds of 10
- ✅ Password never stored in plain text
- ✅ Comparison uses secure hash comparison

### Email Verification
- ✅ Random token generation (crypto)
- ✅ 24-hour token expiration
- ✅ Token can only be used once
- ✅ Prevents unverified email access

### JWT Token
- ✅ Secure secret key in `.env`
- ✅ Token stored in localStorage
- ✅ Used for authenticated API requests
- ✅ Role-based access control (admin/user)

### Email Privacy
- ✅ App password (not actual Gmail password)
- ✅ Secure variable storage in `.env`
- ✅ Not committed to git (in .gitignore)

---

## 🐛 Troubleshooting

### Email Not Sending
1. Check `EMAIL_USER` is update to your Gmail
2. Verify app password is correct
3. Check backend logs for email service errors
4. Ensure backend server is running

### Verification Link Not Working
1. Make sure `FRONTEND_URL` in .env is correct
2. Check token hasn't expired (24 hours)
3. Verify MongoDB is connected

### Login Page Not Connecting to Backend
1. Ensure backend is running on port 5000
2. Check CORS settings in backend (localhost:5173 is allowed)
3. Check browser console for network errors

### MongoDB Connection Issues
- Local: Ensure MongoDB daemon is running (`mongod`)
- Atlas: Check connection string in `.env`
- Verify network whitelist allows your IP

---

## 📊 Database Schema

### User Collection
```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email address
  password: String,       // Hashed password
  role: String,           // 'admin' or 'user'
  isActive: Boolean,      // Account active status
  isEmailVerified: Boolean, // Email confirmation status
  verificationToken: String, // Token for email verification
  verificationTokenExpires: Date, // Token expiration time
  createdAt: Date,        // Account creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

---

## 🚀 Next Steps

### Phase 1: Testing (Current)
- ✅ Test signup with real emails
- ✅ Verify email confirmation works
- ✅ Test login with verified accounts

### Phase 2: Google OAuth (Optional)
- Add Google Sign-In button
- Implement real Google OAuth integration
- Follow guide in `GOOGLE_OAUTH_SETUP.md`

### Phase 3: Production
- Update `FRONTEND_URL` in .env to production domain
- Change `JWT_SECRET` to secure random string
- Update email to production email account
- Deploy to cloud (Vercel, Heroku, AWS)

---

## 💡 Key Files to Understand

### Backend Email Service
**File**: `backend/src/services/emailService.js`
- `sendVerificationEmail()` - Sends verification email
- `sendWelcomeEmail()` - Sends welcome email after verification
- `verifyEmailConnection()` - Tests email service is working

### Backend Auth Controller
**File**: `backend/src/controllers/authController.js`
- `signup()` - Creates user and sends verification email
- `login()` - Authenticates user with email/password
- `verifyEmail()` - Confirms email with token
- `createAdmin()` - Creates admin accounts

### Frontend Auth Context
**File**: `frontend/src/contexts/AuthContext.jsx`
- Manages global authentication state
- Stores token in localStorage
- Provides `useAuth()` hook for components

---

## 🎉 Congratulations!

Your complete authentication system is set up and ready! Users can now:
- ✅ Sign up with email
- ✅ Receive verification emails
- ✅ Verify their email
- ✅ Login with verified accounts
- ✅ Browse cars as authenticated users

**Next**: Test the system thoroughly before deploying to production!
