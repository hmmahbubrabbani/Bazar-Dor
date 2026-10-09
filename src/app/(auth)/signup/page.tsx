"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      const errMessage = "পাসওয়ার্ড দুটি মিলছে না। অনুগ্রহ করে মিলিয়ে লিখুন।";
      setError(errMessage);
      toast.error(errMessage);
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/signin",
      });

      if (authError) {
        throw new Error(authError.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।");
      }

      toast.success("সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে! দয়া করে সাইন ইন করুন।");

      setTimeout(() => {
        router.push("/signin");
      }, 1000);

    } catch (err: any) {
      const errMsg = err.message || "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err: any) {
      setError("গুগল দিয়ে সাইন ইন করতে ব্যর্থ হয়েছে।");
      toast.error("গুগল দিয়ে সাইন ইন করতে ব্যর্থ হয়েছে।");
    }
  };

  const handleGithubLogin = async () => {
    setError("");
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (err: any) {
      setError("গিটহ্যাব দিয়ে সাইন ইন করতে ব্যর্থ হয়েছে।");
      toast.error("গিটহ্যাব দিয়ে সাইন ইন করতে ব্যর্থ হয়েছে।");
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 bg-[rgb(240,245,240)]">
      
      <div className="text-center space-y-1.5 mb-6">
        <h1 className="text-3xl font-black text-[rgb(29,39,31)]">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-xs md:text-sm text-base-content/60 font-medium">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="max-w-md w-full bg-[rgb(250,252,250)] p-8 rounded-3xl border border-green-100 shadow-sm space-y-6">
        
        {error && (
          <div className="bg-error/10 border border-error/20 text-error text-xs p-3 rounded-xl font-semibold text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[rgb(29,39,31)] mb-1.5">
              নাম
            </label>
            <input 
              type="text" 
              required
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              name="bazar-dor-signup-name"
              className="w-full bg-white border border-green-200 text-sm h-12 px-4 rounded-xl focus:outline-none focus:border-green-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[rgb(29,39,31)] mb-1.5">
              ইমেইল
            </label>
            <input 
              type="email" 
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              name="bazar-dor-signup-email"
              className="w-full bg-white border border-green-200 text-sm h-12 px-4 rounded-xl focus:outline-none focus:border-green-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[rgb(29,39,31)] mb-1.5">
              পাসওয়ার্ড
            </label>
            <input 
              type="password" 
              required
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              name="bazar-dor-signup-pass"
              className="w-full bg-white border border-green-200 text-sm h-12 px-4 rounded-xl focus:outline-none focus:border-green-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[rgb(29,39,31)] mb-1.5">
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input 
              type="password" 
              required
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              name="bazar-dor-signup-confirmpass"
              className="w-full bg-white border border-green-200 text-sm h-12 px-4 rounded-xl focus:outline-none focus:border-green-600 shadow-xs"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#008236] hover:bg-[#006b2c] text-white font-semibold h-12 rounded-xl shadow-sm text-sm transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-400 font-medium">অথবা</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white hover:bg-gray-50 text-[rgb(29,39,31)] border border-green-200 font-medium h-11 rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.18 21.32 7.23 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.44 8.15 0 9.92 0 12s.44 3.85 1.2 5.4l4.08-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.68 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
            </svg>
            Google দিয়ে চালিয়ে যান
          </button>

          <button 
            type="button"
            onClick={handleGithubLogin}
            className="w-full bg-white hover:bg-gray-50 text-[rgb(29,39,31)] border border-green-200 font-medium h-11 rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-center text-xs text-base-content/70 font-medium">
          অ্যাকাউন্ট আছে? <Link href="/signin" className="text-[#008236] font-bold hover:underline">সাইন ইন করুন</Link>
        </p>

      </div>

      <div className="mt-6">
        <Link href="/" className="text-xs text-base-content/50 hover:text-[rgb(29,39,31)] font-medium transition-colors">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>

    </div>
  );
}