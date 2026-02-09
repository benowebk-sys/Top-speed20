# ⚡ Quick Start - Email + MongoDB + Authentication

## Step-by-Step Setup (5 minutes)

### 1. Update Email Configuration
```bash
# Edit backend/.env
# Change this line to your Gmail address:
EMAIL_USER=your_actual_gmail@gmail.com
# Keep this as is (it's your app password):
EMAIL_APP_PASSWORD=lbnu egpn xzuv enji
```

**How to get Gmail App Password:**
1. Go to myaccount.google.com
2. Select "Security" in left menu
3. Enable "2-Step Verification" if not already
4. Go back to Security
5. Find "App passwords"
6. Select Mail and Windows Computer
7. Copy the 16-character password
8. Paste into `.env` as `EMAIL_APP_PASSWORD`

### 2. Install Backend Dependencies
```bash
cd backend
npm install
# (nodemailer is already in package.json)
```

### 3. Start MongoDB

**Option A: Using Local MongoDB**
```bash
# Windows - in another terminal
mongod
```

**Option B: Using MongoDB Atlas (Already Configured)**
- MongoDB Atlas connection already in `.env`
- No setup needed, just make sure connection string is correct

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

Expected output:
```
✅ TOP SPEED Backend running on http://localhost:5000
✅ MongoDB connected successfully
✅ Email service is ready
```

### 5. Start Frontend Server
```bash
# In another terminal
cd frontend
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
```

---

## 🧪 Testing the Complete Flow

### Test 1: Sign Up with Email Verification

1. Go to **http://localhost:5173/signup**

2. Fill the form:
   ```
   Full Name: Test User
   Email: your_actual_email@gmail.com
   Password: test123
   Confirm: test123
   ```

3. Click "Create Account"

4. Wait for success message: "تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد"

5. **Check your email inbox** for:
   - From: your_actual_gmail@gmail.com
   - Subject: تأكيد بريدك الإلكتروني - TOP SPEED
   - Contains: "تأكيد البريد الإلكتروني" button

6. **Click the verification link**

7. You'll be:
   - Marked as verified in database
   - Auto-logged in
   - Redirected to home page
   - See "Test User" in navigation

8. **Check email again** for welcome email

### Test 2: Login

1. Go to **http://localhost:5173/logout** or refresh page

2. Check navigation - should show "Login" button

3. Click "Login" → Go to `/login`

4. Enter credentials:
   ```
   Email: your_actual_email@gmail.com
   Password: test123
   ```

5. Click Login

6. Should redirect to home page

7. Navigation should show your name

### Test 3: Error Handling

1. Try signing up with same email → Error: "هذا البريد الإلكتروني مسجل بالفعل"

2. Try login with wrong password → Error: "بيانات دخول غير صحيحة"

3. Try login with unknown email → Error: "بيانات دخول غير صحيحة"

4. Try signup with non-matching passwords → Error: "كلمات المرور غير متطابقة"

---

## 🔍 Verify Everything is Working

### Backend Console (npm run dev output)

After signup, you should see:
```
✅ Verification email sent to user@gmail.com
```

### Database (MongoDB)

Check users collection:
```javascript
db.users.findOne({ email: "your_actual_email@gmail.com" })
```

Should show:
```javascript
{
  _id: ObjectId(...),
  name: "Test User",
  email: "your_actual_email@gmail.com",
  password: "$2a$10$...", // hashed
  role: "user",
  isEmailVerified: true, // after clicking link
  verificationToken: null, // cleared after verification
  verificationTokenExpires: null,
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

### Frontend Browser

Check localStorage after login:
```javascript
// Open Chrome DevTools (F12)
// Go to Application → Local Storage → http://localhost:5173
// Should have:
// - auth_token: "eyJhbGciOi..."
// - auth_user: {"id":"...","name":"Test User",...}
```

---

## 🚀 Next Steps After Testing

After confirming signup/login/email works:

### 1. Test Google OAuth (Optional)
- Follow `GOOGLE_OAUTH_SETUP.md`
- Add Google login button

### 2. Add More Features
- Password reset
- Email verification resend
- 2-Factor authentication

### 3. Customize Email Templates
- Edit `backend/src/services/emailService.js`
- Change colors, text, templates

### 4. Deploy to Production
- Deploy backend to Heroku/Railway
- Deploy frontend to Vercel
- Update URLs in both environments

---

## 🆘 Troubleshooting

### "Email service verification failed"
```
❌ Email service is not ready

Solution:
1. Check EMAIL_USER in .env (should be your Gmail)
2. Check EMAIL_APP_PASSWORD is 16 characters
3. Restart backend: npm run dev
```

### "MongoDB connection warning"
```
⚠️ MongoDB connection warning: ...

Solution:
1. Start mongod (if using local)
2. Or verify MongoDB Atlas URL in .env
3. Check internet connection
```

### "Email not received"
```
Solution:
1. Check spam/promotions folder
2. Verify EMAIL_USER matches Gmail sending
3. Check backend logs for "email sent"
4. Restart NodeMailer: npm run dev
```

### "Verification link not working"
```
Solution:
1. Check FRONTEND_URL in .env = http://localhost:5173
2. Make sure frontend is running (npm run dev)
3. Check token hasn't expired (24h limit)
4. Check browser console for errors (F12)
```

### "Login not working"
```
Solution:
1. Make sure backend is running on port 5000
2. Check browser network tab (F12)
3. Verify email is verified (check database)
4. Clear browser cache: Ctrl+Shift+Del
```

---

## 📞 Support Commands

```bash
# Reset everything (delete all users)
# In MongoDB compass or CLI:
use topspeed
db.users.deleteMany({})

# Check email service
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'

# Check backend is running
curl http://localhost:5000/api/health
# Should return: {"status":"Backend is running"}

# Check frontend is running
curl http://localhost:5173
# Should return HTML

# View MongoDB connection
# Check console: "✅ MongoDB connected successfully"

# View email service
# Check console: "✅ Email service is ready"
```

---

## 🎉 Success Indicators

✅ **System is Working When:**

- SignUp creates user in MongoDB
- Verification email arrives within seconds
- Clicking link verifies email instantly
- Login works with verified account
- User data shows in navbar
- Token persists in localStorage
- Refresh page keeps user logged in
- Backend shows no errors
- Frontend shows no console errors

---

**You're all set! Start testing now! 🚀**

Questions? Check:
- `AUTHENTICATION_SETUP.md` - Complete documentation
- `MONGODB_EMAIL_ARCHITECTURE.md` - System architecture
- `backend/.env` - Configuration values
- Backend terminal - Logs and errors
