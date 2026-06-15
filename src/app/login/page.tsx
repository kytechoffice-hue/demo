'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chat/Chatbot';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import { 
  KeyRound, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Info, 
  X, 
  Check, 
  Lock,
  Smartphone
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();
  const { t } = useLang();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Form toggles & visibility states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Input fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  // Auto-fill logic
  const handleAutoFill = (selectedEmail: string, selectedPass: string) => {
    setEmail(selectedEmail);
    setPassword(selectedPass);
    setShowHelpPopup(false);
  };

  // Handle Login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setFeedbackMsg({ type: '', text: '' });

    try {
      if (isRegisterMode) {
        if (!name.trim()) {
          setFeedbackMsg({ type: 'error', text: 'Please enter your name.' });
          setLoading(false);
          return;
        }
        const result = await register(name, email, password);
        if (result.success) {
          setFeedbackMsg({ type: 'success', text: result.message });
          setIsRegisterMode(false); // Shift to login mode
          setPassword(''); // Reset password
        } else {
          setFeedbackMsg({ type: 'error', text: result.message });
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          setFeedbackMsg({ type: 'success', text: result.message });
          // Redirect based on role
          setTimeout(() => {
            if (result.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          }, 800);
        } else {
          setFeedbackMsg({ type: 'error', text: result.message });
        }
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-900/40 relative overflow-hidden">
        {/* Decorative backdrop gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* LOGIN CONTAINER CARD */}
        <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-3xl shadow-xl overflow-hidden p-8 relative z-10 animate-fadeIn">
          
          {/* Header branding */}
          <div className="text-center mb-8 space-y-2">
            <div className="relative h-12 w-12 mx-auto overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-100 dark:border-slate-700">
              <Image src="/logo-icon.png" alt="KY eStore" fill className="object-contain p-1" sizes="48px" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRegisterMode 
                ? 'Join KY eStore for a technology-driven shopping experience.' 
                : 'Access your profile, orders, and personalized smart choices.'}
            </p>
          </div>

          {/* Form alert feedbacks */}
          {feedbackMsg.text && (
            <div className={`p-4 mb-6 rounded-2xl text-xs font-semibold border ${
              feedbackMsg.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400' 
                : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40 text-red-650 text-red-500 dark:text-red-400'
            }`}>
              {feedbackMsg.text}
            </div>
          )}

          {/* AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* NAME INPUT (Register Only) */}
            {isRegisterMode && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue-500/50 text-slate-700 dark:text-slate-200"
                  />
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>
              </div>
            )}

            {/* EMAIL INPUT */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Email Address</label>
                <button
                  type="button"
                  onClick={() => setShowHelpPopup(true)}
                  className="text-[10px] font-bold text-primary-blue-500 hover:underline flex items-center gap-0.5"
                >
                  <Info className="h-3 w-3" /> Get Test Accounts
                </button>
              </div>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setShowHelpPopup(true)} // Show credentials helper modal on focus!
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue-500/50 text-slate-700 dark:text-slate-200"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              {/* GORGEOUS POPUP MODAL / POPUP OVERLAY ON EMAIL FOCUS */}
              {showHelpPopup && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 z-20 animate-slideUp">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-orange-400 animate-pulse" />
                      Test Accounts Popup
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowHelpPopup(false)}
                      className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-slate-300 leading-normal mb-3">
                    Click a credential card below to auto-fill the login form instantly!
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAutoFill('buyer@gmail.com', 'buyer')}
                      className="text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 p-2.5 rounded-xl transition-all hover:scale-102 flex flex-col"
                    >
                      <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Customer</span>
                      <span className="text-[10px] font-bold truncate mt-0.5">buyer@gmail.com</span>
                      <span className="text-[8px] text-slate-400 mt-0.5">Pass: buyer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutoFill('admin@kystore.com', 'admin')}
                      className="text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 p-2.5 rounded-xl transition-all hover:scale-102 flex flex-col"
                    >
                      <span className="text-[9px] font-bold text-primary-blue-450 text-blue-400 uppercase tracking-wider">Administrator</span>
                      <span className="text-[10px] font-bold truncate mt-0.5">admin@kystore.com</span>
                      <span className="text-[8px] text-slate-400 mt-0.5">Pass: admin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">Password</label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => alert("Simulation: A password reset link has been dispatched to your email.")}
                    className="text-[10px] font-bold text-slate-400 hover:text-primary-blue-500"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue-500/50 text-slate-700 dark:text-slate-200"
                />
                <KeyRound className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-blue-500 to-primary-blue-650 bg-primary-blue-500 hover:bg-primary-blue-600 text-white font-extrabold rounded-xl text-xs transition-all hover:scale-102 shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isRegisterMode ? 'Sign Up' : 'Log In'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-6 text-center shrink-0">
            <span className="absolute inset-x-0 top-1/2 border-t border-slate-100 dark:border-slate-700 -translate-y-1/2"></span>
            <span className="relative bg-white dark:bg-slate-800 px-3 text-[10px] text-slate-400 uppercase font-semibold">Or Continue With</span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => alert("Simulation: Logging in using Google OAuth...")}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              {/* Custom Google vector icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 15.01 1 12 1 7.24 1 3.2 3.73 1.24 7.74l3.87 3C6.02 7.71 8.78 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.98 3.38-4.89 3.38-8.49z" />
                <path fill="#FBBC05" d="M5.11 10.74C4.88 11.41 4.75 12.11 4.75 13s.13 1.59.36 2.26l-3.87 3C.44 16.73 0 14.92 0 13s.44-3.73 1.24-5.26l3.87 3z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.22 0-5.98-2.67-6.89-5.7l-3.87 3C3.2 20.27 7.24 23 12 23z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const phone = prompt("Enter your 10-digit phone number:");
                if (phone) {
                  alert(`Simulation: An OTP verification code has been dispatched to ${phone}. Enter in prompt.`);
                  const otp = prompt("Enter the 6-digit OTP code received:");
                  if (otp === "123456" || otp) {
                    handleAutoFill('buyer@gmail.com', 'buyer');
                    alert("OTP login successful! Press Login.");
                  }
                }
              }}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Smartphone className="h-4 w-4 text-accent-orange-500" />
              <span>OTP Login</span>
            </button>
          </div>

          {/* Toggle between register and login */}
          <div className="text-center text-xs">
            <span className="text-slate-550 text-slate-400">
              {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setFeedbackMsg({ type: '', text: '' });
              }}
              className="font-extrabold text-primary-blue-500 hover:underline"
            >
              {isRegisterMode ? 'Log In' : 'Sign Up'}
            </button>
          </div>

        </div>

      </main>

      <Footer />
      <Chatbot />
    </>
  );
}
