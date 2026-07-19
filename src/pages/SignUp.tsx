import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  UtensilsCrossed
} from 'lucide-react';
export const SignUp: React.FC = () => {
  const { signUp, googleSignIn } = useApp();
  const navigate = useNavigate();

  // Field states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin' | 'sub-admin' | 'deliveryman'>('user');

  // Validation feedback
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors(null);
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setErrors("Password does not match!");
      setIsSubmitting(false);
      return;
    }

    try {
      // Direct signup to MongoDB Atlas via AppContext
      const result = await signUp({
        name,
        email,
        phone,
        password,
        role
      });

      if (result && result.success) {
        toast.success("✅ Registration Success!", {
          position: "top-right",
          autoClose: 1500,
          theme: "colored",
        });

        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      } else {
        setErrors(result.error || "Registration failed!");
      }
    } catch (err: any) {
      console.error(err);
      setErrors(err.message || "Registration failed!");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div id="signup-page" className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl max-w-md w-full p-8 flex flex-col gap-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white mx-auto mb-3">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Create Bhola Online Account</h2>
          <p className="text-xs text-gray-400 mt-1">Get your favorite food delivered directly to your doorstep.</p>
        </div>

        {errors && (
          <div className="bg-red-50 border border-red-100 text-red-800 rounded-xl p-3 text-xs font-bold leading-relaxed">
            {errors}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Your Full Name</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <UserIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Rahman"
                className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. tanvir@bhola.com"
                className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Mobile Phone (11 digits)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="tel"
                required
                name="phone"
                maxLength={11}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01712345678"
                className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          {/* Password */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Secure Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Sign Up Free</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>



        <hr className="border-gray-100" />

        {/* Alternate Navigation Link */}
        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/signin" className="font-extrabold text-orange-500 hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
      <ToastContainer aria-label="Bhola Toast" />
    </div>
  );
};
