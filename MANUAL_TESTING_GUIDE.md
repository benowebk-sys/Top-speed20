# 🧪 Manual Testing Guide - دليل الاختبار اليدوي

## ✅ قبل البدء

```bash
# تأكد من:
✅ Backend running: npm start (cd backend)
✅ Frontend running: npm run dev (cd frontend)
✅ MongoDB Atlas connected
✅ Gmail configured
```

---

## 📋 Test Scenarios

### Test 1: Homepage & Navigation
**Steps:**
1. Open: http://192.168.1.6:5178
2. ✅ Logo should appear at top
3. ✅ "TOP SPEED" title visible
4. ✅ Featured cars displayed
5. ✅ Navigation menu shows links

**Expected Results:**
- Page loads in < 2 seconds
- No console errors (F12)
- All images visible
- Buttons clickable

---

### Test 2: User Registration
**Steps:**
1. Click "Signup" button
2. Enter: 
   - Email: `testuser@example.com`
   - Password: `TestPass123`
   - Confirm: `TestPass123`
3. Click "Sign Up"
4. ✅ See message: "Check your email"

**Expected Results:**
- ✅ No network error
- ✅ Email validation works
- ✅ Password hashing happens
- ✅ User created in database

**Check Email:**
1. Go to your email inbox (testuser@example.com)
2. ✅ Should receive verification email from ngtr613@gmail.com
3. Copy the verification token from email link
4. Paste in verification page
5. ✅ See: "Account verified! Redirecting to login..."

---

### Test 3: User Login
**Steps:**
1. After verification, go to `/login`
2. Enter:
   - Email: `testuser@example.com`
   - Password: `TestPass123`
3. Click "Login"

**Expected Results:**
- ✅ NO "Network Error"
- ✅ Redirected to homepage after login
- ✅ User email shown in top-right
- ✅ Logout button available
- ✅ JWT token saved in localStorage

**Verify Token:**
- Open Browser Console (F12)
- Run: `localStorage.getItem('token')`
- Should see long JWT string

---

### Test 4: Browse Cars
**Steps:**
1. Click "Explore Cars" or "Cars" menu
2. ✅ Should see 54 cars in grid
3. Click any car

**Expected Results:**
- ✅ All 54 cars load without errors
- ✅ Car images display
- ✅ Car specs visible:
  - Horsepower (HP)
  - Top Speed
  - Engine type
  - Price

---

### Test 5: Car Detail Page
**Steps:**
1. On car listing, click any car
2. ✅ See full specifications
3. ✅ See "Buy Now" button
4. Click "Buy Now"

**Expected Results:**
- Car details page loads
- Animated icon display
- Engine specs detailed
- Checkout button clickable

---

### Test 6: Checkout & QR Code
**Steps:**
1. From car detail, click "Buy Now"
2. ✅ See checkout page
3. ✅ Order summary displayed
4. ✅ QR code visible for Instapay

**Expected Results:**
- Correct car name & price shown
- QR code image loads
- "Scan to pay" text visible
- Back button works

---

### Test 7: Configurator
**Steps:**
1. From car detail, click "Customize"
2. ✅ See modification options
3. Try different modifications

**Expected Results:**
- Modifications list loads
- Performance calculations shown
- UI is responsive
- No errors

---

### Test 8: Logout
**Steps:**
1. Click logout button (top-right)
2. ✅ Should be redirected to login/signup

**Expected Results:**
- Token cleared from localStorage
- Session ended
- Can't access protected pages

---

### Test 9: Password Reset
**Steps:**
1. Go to Login page
2. Click "Forgot Password"
3. Enter your email
4. Click Submit

**Expected Results:**
- Email confirmation shown
- Check email for reset code
- Enter OTP code
- New password set
- Can login with new password

---

### Test 10: ErrorHandling
**Test Login with wrong password:**

Steps:
1. Go to login
2. Enter valid email: `testuser@example.com`
3. Enter wrong password: `WrongPass123`
4. Click Login

**Expected Results:**
- ✅ Error message: "بيانات دخول غير صحيحة"
- ✅ NOT "Network Error"
- ✅ Can try again

---

## 🔍 Browser Console Checks

**Open DevTools:** F12

### Check Network Tab
- [ ] All requests have status 200 or 201
- [ ] No 401, 403, or 500 errors
- [ ] API calls to: `192.168.1.6:5000/api/...`

### Check Console Tab
- [ ] No red error messages
- [ ] No CORS errors
- [ ] No undefined variables

### Check Storage Tab
- **localStorage:**
  - `token` - JWT string present
  - `user` - User object JSON

---

## 🎯 Feature Checklist

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage loads | ✅ | With logo & featured cars |
| Signup works | ✅ | Email verification sent |
| Email verification | ✅ | Token-based verification |
| Login works | ✅ | No network error |
| Logout works | ✅ | Token cleared |
| Browse 54 cars | ✅ | All cars from database |
| Car details | ✅ | Full specs displayed |
| Buy/Checkout | ✅ | QR code shown |
| Password reset | ✅ | OTP sent via email |
| Error messages | ✅ | User-friendly |
| Responsive design | ✅ | Mobile-friendly |
| Images load | ✅ | All 54 car images |
| Animations work | ✅ | Smooth transitions |

---

## ⚠️ Common Issues During Testing

### Issue: "Network Error" on Login
**Solution:**
1. Check Backend: `curl http://192.168.1.6:5000/api/health`
2. Check CORS: Should see `Access-Control-Allow-Origin` header
3. Restart Backend: `npm start` in backend folder
4. Clear Browser Cache: Ctrl+Shift+R

### Issue: Email Not Received
**Solution:**
1. Check Spam folder
2. Verify EMAIL_USER & EMAIL_PASS in backend/.env
3. Check MongoDB Atlas logs
4. Resend verification email

### Issue: Blank Page on Cars
**Solution:**
1. Check if cars table populated: `db.cars.count()`
2. Check API response: `curl http://192.168.1.6:5000/api/cars`
3. Run seed: `node backend/seed-full.js`

### Issue: Images Not Loading
**Solution:**
1. Check file exists: `ls frontend/public/images/cars/`
2. Check console for 404 errors
3. Verify image paths in database

---

## ✨ Test Report Template

```markdown
# TEST REPORT - Date: [DATE]

## Environment
- Frontend: http://192.168.1.6:5178
- Backend: http://192.168.1.6:5000
- Browser: [Chrome/Firefox/Safari]
- Device: [Desktop/Mobile]

## Test Results

### ✅ Passed
- [ ] Signup
- [ ] Email Verification
- [ ] Login
- [ ] Browse Cars
- [ ] Car Details
- [ ] Checkout
- [ ] Logout

### ❌ Failed
(None if all passed)

## Issues Found
(Create GitHub issue if needed)

## Notes
(Any observations)

## Signed By
Name: ___________
Date: ___________
```

---

## 🚀 Ready for Production?

Before going live, verify:
- [ ] All tests passed
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] All 54 cars visible
- [ ] Email works
- [ ] Auth flow complete
- [ ] Checkout functional
- [ ] QR code displays

### If ALL checked: ✅ READY FOR PRODUCTION!

---

