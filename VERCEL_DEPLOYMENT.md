# Vercel Deployment Instructions - خطوات النشر على Vercel

## تنويه مهم - IMPORTANT ⚠️
هذا المشروع يحتوي على **أمامي (Frontend) وخلفي (Backend)**، لذا سنحتاج إلى نشر كليهما على Vercel.

---

## الخطوة الأولى: تحضير MongoDB Atlas

1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com)
2. تسجيل الدخول إلى حسابك
3. اختر database تحتوي على بيانات السيارات
4. احصل على Connection String:
   - اضغط على "Connect"
   - اختر "Connect your application"
   - انسخ الـ URI في الصيغة:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/topspeed?retryWrites=true&w=majority
   ```

---

## الخطوة الثانية: نشر Backend على Vercel

### 2.1 - من Vercel Dashboard:

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل الدخول بـ GitHub account
3. اضغط "Add New" → "Project"
4. ابحث عن repository: **`Top-speed20`**
5. اختر **`backend/`** كـ Root Directory
6. اضغط "Configure Project"
7. أضف Environment Variables:

```
DATABASE_URL = mongodb+srv://user:password@cluster.mongodb.net/topspeed?retryWrites=true&w=majority
FRONTEND_URL = https://your-frontend-url.vercel.app
JWT_SECRET = top_speed_secret_key_2026
EMAIL_USER = ngtr613@gmail.com
EMAIL_PASS = lbnuegpnxzuvenji
NODE_ENV = production
```

8. اضغط "Deploy"
9. انتظر انتهاء النشر (~2-3 دقائق)
10. احصل على الـ Backend URL من Vercel (مثلاً: `https://backend-name.vercel.app`)

---

## الخطوة الثالثة: نشر Frontend على Vercel

### 3.1 - من Vercel Dashboard:

1. اضغط "Add New" → "Project" مرة أخرى
2. ابحث عن نفس repository: **`Top-speed20`**
3. اختر **`frontend/`** كـ Root Directory
4. اضغط "Configure Project"
5. أضف Environment Variables:

```
VITE_API_URL = https://your-backend-url.vercel.app/api
```
(استبدل `your-backend-url` بالـ URL من النشر السابق)

6. اضغط "Deploy"
7. انتظر انتهاء النشر (~2-3 دقائق)

---

## الخطوة الرابعة: تحديث MongoDB Atlas IP Whitelist

**هام جداً!** Vercel يستخدم IPs مختلفة:

1. اذهب إلى MongoDB Atlas
2. اذهب إلى "Security" → "Network Access"
3. اضغط "Add IP Address"
4. أدخل `0.0.0.0/0` (سيسمح بـ جميع IPs - في الإنتاج استخدم IPs محددة)
   أو
5. اضغط "Allow Access from Anywhere" (الطريقة الأسهل لـ Testing)

---

## الخطوة الخامسة: اختبار النشر

### Test Frontend:
```
https://your-frontend-domain.vercel.app
```

### Test Backend API:
```
https://your-backend-domain.vercel.app/api/cars
```

### اختبر تسجيل حساب:
1. اضغط "Sign Up"
2. أدخل بريد إلكتروني وكلمة مرور
3. تحقق من وصول البريد الإلكتروني
4. أدخل OTP
5. سيتم إعادة التوجيه للـ Login

---

## الخطوة السادسة: ربط Domain مخصص (اختياري)

1. من Vercel Dashboard اختر كل project
2. اذهب إلى "Settings" → "Domains"
3. أضف domain مخصص (مثلاً: `topspeed.com`)
4. اتبع التعليمات لـ تحديث DNS settings

---

## مشاكل شائعة وحلولها

### المشكلة: "CORS Error" عند الاتصال بـ API
**الحل:**
- تأكد من أن `FRONTEND_URL` في backend .env صحيح
- أعد تشغيل Backend deployment

### المشكلة: صور السيارات لا تظهر
**الحل:**
- تأكد من وجود الصور في `frontend/public/images/cars/`
- أعد بناء Frontend: اضغط "Redeploy"

### المشكلة: البريد الإلكتروني لم يُرسل
**الحل:**
- تحقق من صحة `EMAIL_USER` و `EMAIL_PASS`
- تأكد من تفعيل "App Passwords" في Gmail

### المشكلة: قاعدة البيانات لا تتصل
**الحل:**
- تحقق من `DATABASE_URL` في MongoDB Atlas
- أضيف Vercel IPs إلى MongoDB whitelist

---

## الخطوات بما بعد النشر

✅ تم نشر Backend و Frontend بنجاح!

الآن يمكنك:
- مشاركة الرابط مع المستخدمين
- جمع feedback
- مراقبة الأداء من Vercel Dashboard
- تحديث الأسعار والسيارات من قاعدة البيانات
- إضافة ميزات جديدة وإعادة النشر

---

## أوامر مفيدة

```bash
# عرض logs من Vercel
vercel logs

# معاينة قبل النشر
vercel preview

# نشر على الإنتاج
vercel --prod

# تحديث variables
vercel env
```

---

## دعم إضافي

- [Vercel Docs](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/concepts/serverless-functions/supported-languages#node.js)
- [MongoDB Atlas Docs](https://docs.mongodb.com/)

تم بنجاح! 🎉
