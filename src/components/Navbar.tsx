"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import NavLinks from "@/components/NavLinks";
import { authClient } from "@/lib/auth-client"; // BetterAuth ক্লায়েন্ট

export default function Navbar() {
  const [banglaDate, setBanglaDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // BetterAuth থেকে রিয়েল-টাইম সেশন ডাটা ফেচ করা
  const { data: session, isPending } = authClient.useSession();

  // হাইড্রেশন মিসম্যাচ এড়াতে কম্পোনেন্ট মাউন্ট হওয়ার পর ডেট সেট করা
  useEffect(() => {
    setIsMounted(true);
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("bn-BD", options).format(today);
    setBanglaDate(formattedDate);
  }, []);

  // সাইন আউট হ্যান্ডলার
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/signin"; // সাইন আউটের পর সাইন-ইন পেজে রিডাইরেক্ট
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgb(250,252,250)]/95 backdrop-blur-md border-b border-green-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* প্রথম সারি: লোগো + বাংলা তারিখ এবং অথ বাটন / ড্রপডাউন */}
        <div className="flex items-center justify-between py-3 border-b border-green-100">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative bg-green-50 rounded-xl border border-green-100 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-xs">
              <Image 
                src="/logo-icon.png" 
                alt="বাজার দর লোগো" 
                width={28} 
                height={28} 
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-[rgb(29,39,31)]">
                বাজার দর
              </h1>
              <p className="text-[11px] text-green-700 font-semibold">
                {isMounted ? banglaDate : "লোড হচ্ছে..."}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="w-6 h-6 rounded-full animate-pulse bg-green-100"></div>
            ) : session?.user ? (
              /* ইউজার লগইন করা থাকলে ড্রপডাউন মেনু দেখাবে */
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-2.5 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-2xl transition cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {session.user.name?.charAt(0).toUpperCase() || "👤"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-[rgb(29,39,31)] leading-tight">
                      {session.user.name}
                    </p>
                    <p className="text-[10px] text-base-content/60 truncate max-w-[120px]">
                      {session.user.email}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-2xl border border-green-100 w-56 mt-2 space-y-1 text-xs">
                  <li className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="font-bold text-[rgb(29,39,31)] text-sm truncate">{session.user.name}</p>
                    <p className="text-gray-500 text-[11px] truncate">{session.user.email}</p>
                  </li>
                  <li>
                    <Link href="/profile" className="font-semibold text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl py-2">
                      👤 আমার প্রোফাইল
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleSignOut}
                      className="font-semibold text-error hover:bg-error/10 rounded-xl py-2 text-left w-full"
                    >
                      🚪 সাইন আউট
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              /* ইউজার লগইন না করা থাকলে সাইন ইন / সাইন আপ বাটন দেখাবে */
              <div className="flex items-center gap-2">
                <Link href="/signin" className="btn btn-sm btn-ghost font-medium">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-sm bg-green-600 hover:bg-green-700 text-white shadow-sm border-none">
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* দ্বিতীয় সারি: Suspense বাউন্ডারির ভেতরে ক্যাটাগরি ন্যাভিগেশন লিঙ্কস */}
        <Suspense fallback={<div className="py-3 text-xs text-gray-400">ক্যাটাগরি লোড হচ্ছে...</div>}>
          <NavLinks />
        </Suspense>

      </div>
    </header>
  );
}