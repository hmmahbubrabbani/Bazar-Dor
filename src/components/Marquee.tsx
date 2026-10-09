"use client";

import React, { useEffect, useState } from "react";
import MarqueeText from "react-marquee-text";
import { fetchBazarApi } from "@/lib/api";


const getBanglaUnit = (unit: string) => {
  const map: Record<string, string> = {
    kg: "কেজি",
    g: "গ্রাম",
    gm: "গ্রাম",
    litre: "লিটার",
    l: "লিটার",
    pcs: "টি",
    piece: "টি",
    hali: "হালি",
    dozen: "ডজন",
    packet: "প্যাকেট",
  };
  return map[unit?.toLowerCase()] || unit;
};

const toBengaliNumber = (num: number | string) => {
  if (num === undefined || num === null) return "০";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => (/[0-9]/.test(digit) ? bengaliDigits[Number(digit)] : digit))
    .join("");
};

export default function Marquee() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchBazarApi("/products");
        setProducts(data?.products || data || []);
      } catch (error) {
        console.error("Failed to fetch products for marquee:", error);
      }
    }
    loadProducts();
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-[rgb(250,252,250)] text-[rgb(29,39,31)] py-2.5 overflow-hidden border-b border-green-100 text-sm shadow-xs w-full">
      <div className="flex items-center whitespace-nowrap overflow-hidden">
        <MarqueeText direction="right" duration={35}>
          <div className="inline-flex items-center space-x-6 py-0.5">
            {products.map((product: any, index: number) => {
              const displayName = product.nameBn || product.name;
              const displayPrice = product.today || product.price || 0;
              const displayEmoji = product.emoji || product.image || "📦";
              const displayUnit = getBanglaUnit(product.unit);

              let isUp = false;
              let isDown = false;
              let pctValue = 0;

              if (typeof product.change === "object" && product.change !== null) {
                isUp = product.change.dir === "up";
                isDown = product.change.dir === "down";
                pctValue = product.change.pct || 0;
              } else if (typeof product.change === "number") {
                isUp = product.change > 0;
                isDown = product.change < 0;
                pctValue = Math.abs(product.change);
              }

              const changeColor = isUp ? "text-error font-bold" : isDown ? "text-success font-bold" : "text-base-content/50";
              const arrow = isUp ? "▲" : isDown ? "▼" : "—";

              return (
                <div 
                  key={product?._id || product?.id || index} 
                  className="inline-flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-xl shadow-xs border border-green-100 shrink-0"
                >
                  <span>{displayEmoji}</span>
                  <span className="font-bold text-[rgb(29,39,31)]">{displayName}</span>
                  <span className="text-base-content/80 font-medium">
                    ({toBengaliNumber(displayPrice)} টাকা/{displayUnit})
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs ${changeColor}`}>
                    {arrow} {toBengaliNumber(pctValue)}%
                  </span>
                  <span className="text-green-300 ml-2">●</span>
                </div>
              );
            })}
          </div>
        </MarqueeText>
      </div>
    </div>
  );
}