import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  Lock, 
  ArrowRight,
  UtensilsCrossed,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const SignIn: React.FC = () => {
  const { login, googleSignIn } = useApp();
  const navigate = useNavigate();

  // Field states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Validation feedback
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    if (!emailOrPhone.trim()) return setErrors('Please specify your email or phone.');
    if (!password) return setErrors('Please specify your password.');

    setIsSubmitting(true);

    Promise.resolve(login(emailOrPhone.trim(), password)).then((response) => {
      setIsSubmitting(false);

      if (response.success) {
        navigate('/dashboard');
      } else {
        setErrors(response.error || 'Invalid credentials.');
      }
    }).catch((err) => {
      console.error(err);
      setIsSubmitting(false);
      setErrors('Something went wrong during sign in. Please try again.');
    });
  };

  const handleGoogleSignIn = () => {
    setErrors(null);
    setIsSubmitting(true);
    googleSignIn()
      .then((response) => {
        setIsSubmitting(false);
        if (response.success) {
          navigate('/dashboard');
        } else {
          setErrors(response.error || 'Google Sign In failed.');
        }
      })
      .catch((err) => {
        console.error(err);
        setIsSubmitting(false);
        setErrors('Google Sign In failed. Please try again.');
      });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotFeedback(true);
    setTimeout(() => {
      setForgotFeedback(false);
      setForgotModalOpen(false);
      setForgotEmail('');
    }, 3000);
  };

  return (
    <div id="signin-page" className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl max-w-md w-full p-8 flex flex-col gap-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white mx-auto mb-3">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Sign In to Bhola Online</h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">Order hot local food in Sadar, Char Fashion, and Lalmohan.</p>
        </div>

        {errors && (
          <div className="bg-red-50 border border-red-100 text-red-800 rounded-xl p-3 text-xs font-bold leading-relaxed">
            {errors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email or phone */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Email or Phone Number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="e.g. demo@bhola.com or 01700000000"
                className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">Your Password</label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[10px] font-extrabold text-orange-500 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-xs font-black uppercase tracking-wider text-white shadow hover:shadow-md transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>



        {/* Demo Account Box */}
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 text-[11px] leading-relaxed font-semibold text-amber-800">
          <span className="font-extrabold uppercase text-amber-600 block mb-2 flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> Ready-to-Test Multi-Role Demo Profiles
          </span>
          <p className="text-xs text-amber-900 mb-3 leading-tight">
            Click any profile below to login instantly as a specific role and explore their custom dashboard:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmailOrPhone('demo@bhola.com');
                setPassword('123456');
                login('demo@bhola.com', '123456');
                navigate('/dashboard');
              }}
              className="bg-white hover:bg-orange-50 border border-amber-200 p-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-95 text-xs"
            >
              <span className="block font-black text-orange-600 text-[10px]">Normal User (গ্রাহক)</span>
              <span className="block text-[9px] text-gray-400 font-mono truncate">demo@bhola.com</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmailOrPhone('admin@bhola.com');
                setPassword('123456');
                login('admin@bhola.com', '123456');
                navigate('/dashboard');
              }}
              className="bg-white hover:bg-orange-50 border border-amber-200 p-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-95 text-xs"
            >
              <span className="block font-black text-red-600 text-[10px]">System Admin (এডমিন)</span>
              <span className="block text-[9px] text-gray-400 font-mono truncate">admin@bhola.com</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmailOrPhone('subadmin@bhola.com');
                setPassword('123456');
                login('subadmin@bhola.com', '123456');
                navigate('/dashboard');
              }}
              className="bg-white hover:bg-orange-50 border border-amber-200 p-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-95 text-xs"
            >
              <span className="block font-black text-indigo-600 text-[10px]">Sub-Admin (সহকারী এডমিন)</span>
              <span className="block text-[9px] text-gray-400 font-mono truncate">subadmin@bhola.com</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmailOrPhone('deliveryman@bhola.com');
                setPassword('123456');
                login('deliveryman@bhola.com', '123456');
                navigate('/dashboard');
              }}
              className="bg-white hover:bg-orange-50 border border-amber-200 p-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-95 text-xs"
            >
              <span className="block font-black text-green-600 text-[10px]">Deliveryman (ডেলিভারি)</span>
              <span className="block text-[9px] text-gray-400 font-mono truncate">deliveryman@bhola.com</span>
            </button>
          </div>
          <span className="block text-[9px] text-amber-600 font-bold text-center mt-2.5 bg-white/60 py-1 rounded-lg">Password: 123456 for all accounts</span>
        </div>

        <hr className="border-gray-100" />

        {/* Alternate Navigation Link */}
        <p className="text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-extrabold text-orange-500 hover:underline">
            Create Account Free
          </Link>
        </p>

      </div>

      {/* Forgot Password Mock Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 max-w-sm w-full shadow-2xl animate-scale-up">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500 mb-4">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">Recover Your Password</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Specify your registered email. We will send you instructions to reset your password.
            </p>

            {forgotFeedback ? (
              <div className="bg-green-50 text-green-800 text-xs font-bold p-3 rounded-xl border border-green-100 mb-4">
                Recovery instructions sent! Please check your spam folder if not received.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2 px-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="flex-1 py-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white transition-colors shadow"
                  >
                    Send Recovery
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
