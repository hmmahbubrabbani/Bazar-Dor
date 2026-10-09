"use client";

import { useState, useEffect, use } from "react";
import { fetchBazarApi } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
const toBengaliNumber = (num: number) => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => (/[0-9]/.test(digit) ? bengaliDigits[Number(digit)] : digit))
    .join("");
};

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);

  const [products, setProducts] = useState<any[]>([]);
  const [currentCategoryName, setCurrentCategoryName] = useState(slug);
  const [currentCategoryIcon, setCurrentCategoryIcon] = useState("📦");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const productData = await fetchBazarApi("/products");
        const allProducts = productData?.products || productData || [];

        const categoryData = await fetchBazarApi("/categories");
        const categories = categoryData?.categories || categoryData || [];

        const matchedCategory = categories.find((c: any) => c.slug === slug);
        if (matchedCategory) {
          setCurrentCategoryName(matchedCategory.nameBn);
          setCurrentCategoryIcon(matchedCategory.icon || "📦");
        }

        const filtered = allProducts.filter((p: any) => p.category === slug);
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // সর্টিং লজিক
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") {
      return (a.today || a.price || 0) - (b.today || b.price || 0);
    }
    if (sortBy === "price-desc") {
      return (b.today || b.price || 0) - (a.today || a.price || 0);
    }
    if (sortBy === "name-asc") {
      const nameA = a.nameBn || a.name || "";
      const nameB = b.nameBn || b.name || "";
      return nameA.localeCompare(nameB, "bn");
    }
    return 0; // default
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-500 font-medium">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ক্যাটাগরি হেডার */}
        <div className="bg-[rgb(250,252,250)] p-6 md:p-8 rounded-3xl border border-green-100 shadow-sm flex items-center gap-4">
          <span className="text-5xl p-3 bg-white rounded-2xl shadow-inner border border-base-200 shrink-0">
            {currentCategoryIcon}
          </span>
          <div>
            <h1 className="text-3xl font-black text-[rgb(29,39,31)]">
              {currentCategoryName}
            </h1>
            <p className="text-sm text-base-content/60 mt-1 font-medium">
               {toBengaliNumber(products.length)} টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* আলাদা বক্স: ডানপাশে "সাজান" এবং কাস্টম ড্রপডাউন */}
        <div className="bg-[rgb(250,252,250)] px-6 py-4 rounded-2xl border border-green-100 shadow-xs flex items-center justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">সাজান</span>
            <div className="relative inline-block">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-green-200 text-sm h-9 px-3 pr-8 rounded-lg focus:outline-none focus:border-green-600 shadow-xs cursor-pointer text-gray-700 font-medium"
              >
                <option value="default">ডিফল্ট</option>
                <option value="name-asc">নাম অনুযায়ী (ক - ৳)</option>
                <option value="price-asc">দাম: কম থেকে বেশি</option>
                <option value="price-desc">দাম: বেশি থেকে কম</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* পণ্যের গ্রিড */}
        <p className="text-sm text-base-content/60 mt-1 font-medium">
              মোট {toBengaliNumber(products.length)} টি পণ্য দেখানো হচ্ছে
            </p>
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-[rgb(250,252,250)] border border-green-100 rounded-3xl space-y-3 shadow-sm">
            <p className="text-3xl">📭</p>
            <p className="text-lg font-semibold text-base-content/70">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
            <Link href="/" className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none mt-2">হোম পেজে ফিরে যান</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product: any) => (
              <ProductCard key={product.id || product._id || product.slug} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}