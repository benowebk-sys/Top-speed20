import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageTransition } from '../components/Animations';
import { Header, Footer } from '../components/Layout';
import { Navigation } from '../components/Navigation';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setError('رمز التحقق غير صحيح');
          setLoading(false);
          return;
        }

        try {
          const { data } = await (await import('../services/api')).authService.verifyEmail(token);
          setSuccess(true);
          login(data.token, data.user);
          setTimeout(() => navigate('/'), 2000);
        } catch (err) {
          setError(err?.response?.data?.error || err.message || 'فشل التحقق من البريد الإلكتروني');
        }
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء التحقق');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, login, navigate]);

  return (
    <PageTransition>
      <Navigation />
      <Header title="التحقق من البريد" subtitle="تأكيد بريدك الإلكتروني" />

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center py-8">
        <div className="max-w-md w-full mx-auto px-3 sm:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8 text-center"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex justify-center mb-4"
                >
                  <Mail className="w-16 h-16 text-red-600" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">جاري التحقق من بريدك</h2>
                <p className="text-gray-400 text-sm">يرجى الانتظار...</p>
              </>
            ) : success ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">تم التحقق بنجاح!</h2>
                <p className="text-gray-400 text-sm mb-4">بريدك الإلكتروني تحقق منه بنجاح</p>
                <p className="text-gray-500 text-xs">إعادة توجيه إلى الصفحة الرئيسية...</p>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">خطأ في التحقق</h2>
                <div className="bg-red-900/20 border border-red-600 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm mb-4">
                  {error}
                </div>
                <p className="text-gray-400 text-sm">
                  <a href="/login" className="text-red-600 hover:text-red-500 font-semibold">
                    عودة إلى تسجيل الدخول
                  </a>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </PageTransition>
  );
};
