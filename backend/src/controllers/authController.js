import { User } from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js';
import crypto from 'crypto';

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // التحقق من البيانات المدخلة
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'كلمات المرور غير متطابقة' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    // التحقق من وجود البريد الإلكتروني
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'هذا البريد الإلكتروني مسجل بالفعل' });
    }

    // إنشاء رمز التحقق من البريد
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // إنشاء المستخدم الجديد
    const user = new User({
      name,
      email,
      password,
      role: 'user',
      verificationToken,
      verificationTokenExpires,
      isEmailVerified: false,
    });

    await user.save();

    // إرسال رسالة التحقق
    const emailSent = await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({
      message: emailSent 
        ? 'تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد'
        : 'تم إنشاء الحساب، لكن حدثت مشكلة في إرسال رسالة التحقق',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'رمز التحقق مطلوب' });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'رمز التحقق غير صحيح أو انتهت صلاحيته' });
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    await user.save();

    // إرسال رسالة الترحيب
    await sendWelcomeEmail(user.email, user.name);

    // إنشاء token والبقاء في النظام
    const jwtToken = generateToken(user._id, user.role);

    res.json({
      message: 'تم تأكيد بريدك الإلكتروني بنجاح!',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'بيانات دخول غير صحيحة' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'بيانات دخول غير صحيحة' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'حسابك معطل' });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'هذا المستخدم موجود بالفعل' });
    }

    user = new User({
      name: email.split('@')[0],
      email,
      password,
      role: 'admin',
      isEmailVerified: true,
    });

    await user.save();
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'إذا كان البريد موجودًا سترسل له تعليمات إعادة التعيين' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    await sendPasswordResetEmail(user.email, user.name, otp);

    res.json({ message: 'تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني إن وُجد.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'كلمتا المرور غير متطابقتين' });
    }

    const user = await User.findOne({ email, resetPasswordToken: otp, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'الرمز غير صحيح أو انتهت صلاحيته' });

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    // optional: log the user in after reset
    const token = generateToken(user._id, user.role);

    res.json({ message: 'تم إعادة تعيين كلمة المرور بنجاح', token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message });
  }
};
