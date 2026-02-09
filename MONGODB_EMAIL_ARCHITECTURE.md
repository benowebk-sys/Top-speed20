# 🏗️ MongoDB + Email Authentication Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    TOP SPEED AUTHENTICATION SYSTEM               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│  http://localhost:5173                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐      │
│  │  LoginPage   │  │  SignUpPage  │  │ VerifyEmailPage  │      │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘      │
│         │                 │                    │                 │
│         └─────────────────┼────────────────────┘                 │
│                           │                                       │
│                    POST API Requests                             │
│                           │                                       │
│                    AuthContext (State)                           │
│                    localStorage (Token)                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                    HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
│  http://localhost:5000                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/auth)                                  │   │
│  │  ├── POST /signup  (Create user + Email verification)   │   │
│  │  ├── POST /login   (Email/Password authentication)      │   │
│  │  └── POST /verify-email  (Confirm email with token)     │   │
│  └──────────────────────┬─────────────────────────────────┘   │
│                        │                                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Controllers (authController.js)                        │    │
│  │  ├── signup() - Validates, creates user, sends email   │    │
│  │  ├── login() - Authenticates, generates JWT token      │    │
│  │  └── verifyEmail() - Validates token, confirms email   │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │                                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Services (emailService.js)                             │    │
│  │  ├── sendVerificationEmail()                            │    │
│  │  ├── sendWelcomeEmail()                                 │    │
│  │  └── verifyEmailConnection()                            │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │                                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  NodeMailer (Gmail SMTP)                                │    │
│  │  ├── Service: Gmail                                     │    │
│  │  ├── User: EMAIL_USER (your gmail)                      │    │
│  │  └── Password: EMAIL_APP_PASSWORD                       │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │                                         │
│                    📧 Send Emails                              │
│                       │                                         │
│                    Gmail SMTP Server                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                    Database Connection
                            │
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB (Database)                            │
│  MongoDB Atlas (Cloud) or Local Instance                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Database: topspeed                                              │
│  Collection: users                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Document Example:                                         │  │
│  │ {                                                         │  │
│  │   _id: ObjectId("..."),                                  │  │
│  │   name: "أحمد محمد",                                     │  │
│  │   email: "ahmed@example.com",                            │  │
│  │   password: "$2a$10$...", (hashed with bcrypt)          │  │
│  │   role: "user",                                           │  │
│  │   isActive: true,                                         │  │
│  │   isEmailVerified: true,                                 │  │
│  │   verificationToken: null,                               │  │
│  │   verificationTokenExpires: null,                        │  │
│  │   createdAt: ISODate("2026-02-08T..."),                 │  │
│  │   updatedAt: ISODate("2026-02-08T...")                  │  │
│  │ }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

### SignUp Flow
```
User → SignUp Page
         ↓
    [Fill Form]
    Name, Email, Password
         ↓
    [Client Validation]
    ✓ All fields
    ✓ Password length ≥ 6
    ✓ Passwords match
    ✓ Valid email
         ↓
    POST /api/auth/signup
         ↓
    Backend Processing:
    1. Check if email already exists
    2. Generate verification token
    3. Hash password with bcryptjs
    4. Create user in MongoDB
    5. Send verification email
         ↓
    Response: "Check email for confirmation"
         ↓
    User Inbox
    📧 Verification Email Received
         ↓
    User clicks "تأكيد البريد الإلكتروني"
         ↓
    Browser → /verify-email?token=xxx
         ↓
    POST /api/auth/verify-email
         ↓
    Backend:
    1. Find user by token
    2. Check token expiry (24h)
    3. Mark email as verified
    4. Generate JWT token
    5. Delete verification token
    6. Send welcome email
         ↓
    Frontend:
    1. Auto-login (store token)
    2. Store user data
    3. Redirect to home page
         ↓
    ✅ Account Ready to Use!
```

### Login Flow
```
User → Login Page
         ↓
    [Fill Form]
    Email, Password
         ↓
    POST /api/auth/login
         ↓
    Backend Processing:
    1. Find user by email
    2. Compare password (bcryptjs)
    3. Check if account is active
    4. Generate JWT token
         ↓
    Response: {token, user}
         ↓
    Frontend:
    1. Store token in localStorage
    2. Store user in AuthContext
    3. Redirect to home/admin
         ↓
    ✅ Logged In!
```

---

## Security Implementation

### 1. Password Security
```
User Password: "password123"
        ↓
bcryptjs.hash(password, saltRounds: 10)
        ↓
Hashed: "$2a$10$nOUIs5kJ7naTuBv/1A2.6OPST9/PgBkqqs...."
        ↓
Stored in Database
        ↓
Login Attempt: "password123"
        ↓
bcryptjs.compare(password, hashedPassword)
        ↓
✓ Match → Authenticate
✗ No Match → Reject
```

### 2. Email Verification
```
Signup Request
        ↓
Generate Token: crypto.randomBytes(32).toString('hex')
Set Expiry: Now + 24 hours
        ↓
Store in Database:
verificationToken: "a1b2c3d4..."
verificationTokenExpires: 2026-02-09T12:30:00Z
        ↓
Send Email with Link:
http://localhost:5173/verify-email?token=a1b2c3d4...
        ↓
Verification Click
        ↓
Backend Validates:
1. Token exists
2. Token hasn't expired
3. Same as one in database
        ↓
If Valid:
- Mark isEmailVerified = true
- Delete token and expiry
- Generate JWT
        ↓
If Invalid:
- Reject with error message
- User must request new email
```

### 3. JWT Token
```
Login Successful
        ↓
generateToken(userId, role)
        ↓
JWT.sign({
  id: userId,
  role: role,
  iat: now,
  exp: now + 7days
}, JWT_SECRET)
        ↓
Returns:
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM4OTgwMDAwLCJleHAiOjE3Mzk1ODUwMDB9.signature"
        ↓
Frontend stores in localStorage
        ↓
Sent with each API request:
Authorization: Bearer {token}
```

---

## Configuration Files

### .env (Backend)
```env
# Database
DATABASE_URL=mongodb+srv://testuser:testpass123@testcluster.d5m0m.mongodb.net/topspeed?retryWrites=true&w=majority

# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_APP_PASSWORD=lbnu egpn xzuv enji

# JWT
JWT_SECRET=top_speed_secret_key_2026

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Server
BACKEND_PORT=5000
NODE_ENV=development
```

### How Email App Passwords Work
```
Gmail Regular Password: Not recommended for apps
        ↓
Enable 2-Factor Authentication
        ↓
Generate App Password (Gmail Settings)
        ↓
Special 16-character password: "lbnu egpn xzuv enji"
        ↓
Use in NODE application
        ↓
Secure because:
- Only works with Gmail
- Can be revoked anytime
- Not your actual password
- Specific to one app
```

---

## Email Templates

### Verification Email
```
To: student@example.com
Subject: تأكيد بريدك الإلكتروني - TOP SPEED

────────────────────────────────
أهلا وسهلا أحمد! 🚗

شكراً لتسجيلك في TOP SPEED

برجاء تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:

[تأكيد البريد الإلكتروني] ← Link
────────────────────────────────
```

### Welcome Email
```
To: student@example.com
Subject: أهلا وسهلا في TOP SPEED!

────────────────────────────────
أهلا وسهلا أحمد! 🚗

تم تأكيد بريدك الإلكتروني بنجاح!

يمكنك الآن الاستمتاع باختيار وتخصيص سيارتك الحلم

[استعرض السيارات] ← Link
────────────────────────────────
```

---

## Database Operations

### User Creation
```javascript
// 1. Validate input
if (!email || !password) throw new Error('Required fields');

// 2. Check if exists
const existing = await User.findOne({ email });
if (existing) throw new Error('Email already registered');

// 3. Create user
const user = new User({
  name,
  email,
  password,      // Will be hashed automatically
  role: 'user',
  verificationToken,
  verificationTokenExpires,
  isEmailVerified: false
});

// 4. Save (triggers pre-hook to hash password)
await user.save();

// 5. Return user data
return { id, name, email, isEmailVerified: false };
```

### Email Verification
```javascript
// 1. Find user by token
const user = await User.findOne({
  verificationToken: token,
  verificationTokenExpires: { $gt: Date.now() }  // Not expired
});

if (!user) throw new Error('Invalid or expired token');

// 2. Update user
user.isEmailVerified = true;
user.verificationToken = null;
user.verificationTokenExpires = null;

// 3. Save
await user.save();

// 4. Return with JWT
return {
  token: generateJWT(user),
  user: { id, name, email, role, isEmailVerified: true }
};
```

### Login
```javascript
// 1. Find user
const user = await User.findOne({ email });
if (!user) throw new Error('Invalid credentials');

// 2. Compare password
const isValid = await user.comparePassword(password);
if (!isValid) throw new Error('Invalid credentials');

// 3. Check if active
if (!user.isActive) throw new Error('Account disabled');

// 4. Generate token
const token = generateToken(user._id, user.role);

// 5. Return
return { token, user: { id, name, email, role } };
```

---

## Testing Checklist

- [ ] SignUp page renders correctly
- [ ] Form validation works (client-side)
- [ ] Signup creates user in MongoDB
- [ ] Verification email is sent
- [ ] Verification email contains correct link
- [ ] Clicking link verifies email
- [ ] Welcome email is sent after verification
- [ ] Login with verified account works
- [ ] JWT token is generated
- [ ] Token is stored in localStorage
- [ ] User is redirected correctly
- [ ] Admin role redirects to /admin
- [ ] User role redirects to /
- [ ] Wrong password shows error
- [ ] Unknown email shows error
- [ ] Navigation shows user info when logged in
- [ ] Logout clears token and context

---

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to secure random string
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Update `EMAIL_USER` to production email
- [ ] Use production MongoDB Atlas connection
- [ ] Enable HTTPS (all endpoints)
- [ ] Configure CORS properly (production domain only)
- [ ] Add rate limiting to auth endpoints
- [ ] Add password reset functionality
- [ ] Enable email domain verification
- [ ] Set up monitoring for failed login attempts
- [ ] Add 2FA option for users
- [ ] Backup database regularly

---

**Last Updated**: February 8, 2026
**Status**: ✅ Ready for Testing
