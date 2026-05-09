import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader2, LogOut, ArrowLeft, BookOpen, Mail } from 'lucide-react';
import { useProfile } from '../../../hooks/user/useProfile';
import { useAuth } from '../../../hooks/user/useAuth';

type VerificationStatus = 'verifying' | 'success' | 'error';

const VerifyEmailChange = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  const { verifyEmailChange } = useProfile();
  const { logout } = useAuth();

  const prefix = 'VerifyEmailChange';

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setErrorMessage(t(`${prefix}.message.noToken`));
      return;
    }

    verifyToken(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, t]);

  const verifyToken = async (token: string) => {
    try {
      await verifyEmailChange(token);
      setStatus('success');
    } catch (error: unknown) {
      console.error('Verify email change error:', error);
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t(`${prefix}.message.genericError`)
      );
    }
  };

  // Countdown & auto redirect
  useEffect(() => {
    if (status !== 'success') return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }

    handleLogoutAndRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, countdown]);

  const handleLogoutAndRedirect = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error during email change:', error);
      localStorage.clear();
    } finally {
      navigate('/login', {
        state: {
          message: t(`${prefix}.success.main`),
          email: searchParams.get('email')
        },
        replace: true
      });
    }
  };

  const handleGoToLogin = () => {
    handleLogoutAndRedirect();
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={handleGoToHome}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{t(`${prefix}.backToHome`)}</span>
        </button>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-500" />
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-700 to-orange-600 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
                BookStore
              </span>
            </div>
          </div>

          {/* Verifying */}
          {status === 'verifying' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-amber-600 dark:text-amber-400 animate-spin" />
                </div>
              </div>

              <h1 className="text-3xl font-serif font-bold text-center text-gray-900 dark:text-white mb-3">
                {t(`${prefix}.title.verifying`)}
              </h1>

              <p className="text-center text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {t(`${prefix}.message.verifying`)}
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 dark:text-blue-300 font-semibold mb-1">
                      {t(`${prefix}.processing.title`)}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                      {t(`${prefix}.processing.desc`)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <h1 className="text-3xl font-serif font-bold text-center text-gray-900 dark:text-white mb-3">
                {t(`${prefix}.title.success`)}
              </h1>

              <p className="text-center text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {t(`${prefix}.success.main`)}
              </p>

              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <LogOut className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 dark:text-blue-300 font-semibold mb-1">
                      {t(`${prefix}.success.reloginRequired`)}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                      {t(`${prefix}.success.reloginDesc`)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3 text-green-700 dark:text-green-400 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-semibold">{t(`${prefix}.success.redirecting`)}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t(`${prefix}.success.countdown`, { count: countdown })}</span>
                  </div>
                </div>

                <button
                  onClick={handleGoToLogin}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 text-white py-3.5 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  {t(`${prefix}.success.loginNow`)}
                </button>
              </div>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <h1 className="text-3xl font-serif font-bold text-center text-gray-900 dark:text-white mb-3">
                {t(`${prefix}.title.error`)}
              </h1>

              <p className="text-center text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {errorMessage}
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleGoToLogin}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white py-3.5 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {t(`${prefix}.error.goToLogin`)}
                </button>

                <button
                  onClick={handleGoToHome}
                  className="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3.5 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                >
                  {t(`${prefix}.error.goToHome`)}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {t(`${prefix}.error.needHelp`)}{' '}
                  <button
                    onClick={() => navigate('/support')}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-semibold hover:underline"
                  >
                    {t(`${prefix}.error.contactSupport`)}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
          {t(`${prefix}.footer.note`)}
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailChange;