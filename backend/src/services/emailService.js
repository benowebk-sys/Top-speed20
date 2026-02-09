import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✉️ تأكيد بريدك الإلكتروني - TOP SPEED',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #dc2626; text-align: center;">أهلا وسهلا ${name}! 🚗</h2>
            <h3 style="color: #333; margin-top: 20px;">شكراً لتسجيلك في TOP SPEED</h3>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              برجاء تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                ✓ تأكيد البريد الإلكتروني
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              أو انسخ الرابط التالي:
            </p>
            <p style="background-color: #f0f0f0; padding: 10px; word-break: break-all; color: #0066cc;">
              ${verificationLink}
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              صلاحية هذا الرابط 24 ساعة فقط
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 TOP SPEED - منصة تخصيص السيارات الفاخرة
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    return false;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 أهلا وسهلا في TOP SPEED!',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #dc2626; text-align: center;">أهلا وسهلا ${name}! 🚗</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              تم تأكيد بريدك الإلكتروني بنجاح! 
            </p>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              يمكنك الآن الاستمتاع بكل متعة اختيار وتخصيص سيارتك الحلم من خلال منصتنا الرائعة.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/cars" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                🚗 استعرض السيارات
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2026 TOP SPEED - منصة تخصيص السيارات الفاخرة
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return false;
  }
};

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
};

export const sendPasswordResetEmail = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 رمز إعادة تعيين كلمة المرور - TOP SPEED',
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #dc2626; text-align: center;">إعادة تعيين كلمة المرور</h2>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">مرحباً ${name},</p>
            <p style="color: #666; line-height: 1.6; font-size: 16px;">استخدم رمز إعادة التعيين التالي لإعادة تعيين كلمة مرورك. هذا الرمز صالح لمدة ساعة واحدة.</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display:inline-block; background:#f0f0f0; padding:16px 24px; border-radius:8px; font-weight:bold; font-size:20px;">
                ${otp}
              </div>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">إذا لم تطلب إعادة تعيين كلمة المرور، فتجاهل هذا البريد.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© 2026 TOP SPEED</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email (OTP) sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    return false;
  }
};
