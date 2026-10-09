"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Banner() {
  const [banglaDate, setBanglaDate] = useState("");

 
  useEffect(() => {
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

  return (
    <section className="bg-[rgb(240,245,240)] py-8 md:py-10">
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[rgb(250,252,250)] rounded-3xl p-6 md:p-10 shadow-sm border border-green-100">
          
          
          <div className="space-y-4 text-center md:text-left">
            <span className="font-bold text-green-600 text-sm md:text-base tracking-wide bg-green-50 px-3 py-1 rounded-full inline-block border border-green-200 shadow-sm">
              {banglaDate || "লোড হচ্ছে..."}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[rgb(29,39,31)]">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="text-base-content/70 text-base md:text-lg">
              চাল, ডাল, তেল, সব্জি, মাছ, মাংস, ডিম ও মসলার দাম — বাজার ভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <div className="pt-2 flex justify-center md:justify-start">
              <a href="#সব-পণ্য" className="btn bg-green-600 hover:bg-green-700 text-white btn-sm sm:btn-md shadow-lg border-none">
                সব পণ্য দেখুন
              </a>
            </div>
          </div>

        
          <div className="flex justify-center md:justify-end">
            <div className="w-64 md:w-80 relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/bazar-hero.png"
                alt="বাজার দর হিরো ইমেজ"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}