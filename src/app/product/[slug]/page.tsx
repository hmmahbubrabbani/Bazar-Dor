import { fetchBazarApi } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ইংরেজি ইউনিটকে বাংলায় রূপান্তর করার ফাংশন
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

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
const toBengaliNumber = (num: number | string) => {
  if (num === undefined || num === null) return "N/A";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => (/[0-9]/.test(digit) ? bengaliDigits[Number(digit)] : digit))
    .join("");
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let product = null;

  try {
    const data = await fetchBazarApi("/products");
    const products = data?.products || data || [];
    product = products.find((p: any) => p.slug === slug);
  } catch (error) {
    console.error("Failed to fetch product detail:", error);
  }

  // পণ্য না পাওয়া গেলে 404 দেখাবে
  if (!product) {
    notFound();
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const changeColor = isUp ? "text-error bg-error/10" : isDown ? "text-success bg-success/10" : "text-base-content/70 bg-base-200";
  const arrow = isUp ? "▲" : isDown ? "▼" : "—";
  const displayUnit = getBanglaUnit(product.unit);

  // দামের পার্থক্য হিসাব করা (আজকের দাম - গতকালের দাম)
  const priceDiff = Math.abs((product.today || 0) - (product.yesterday || 0));
  const diffText = isUp 
    ? `গতকালের তুলনায় আজ দাম বেড়েছে - ${toBengaliNumber(priceDiff)} টাকা` 
    : isDown 
    ? `গতকালের তুলনায় আজ দাম কমেছে - ${toBengaliNumber(priceDiff)} টাকা` 
    : "গতকালের তুলনায় আজ দাম অপরিবর্তিত রয়েছে";

  // বাজারগুলো থেকে সর্বনিম্ন ও সর্বাধিক দাম এবং বাজার নির্ণয়
  let minMarket = { name: "তথ্য নেই", price: product.today || 0 };
  let maxMarket = { name: "তথ্য নেই", price: product.today || 0 };

  if (product.markets && product.markets.length > 0) {
    let lowest = product.markets[0];
    let highest = product.markets[0];

    product.markets.forEach((m: any) => {
      if (m.min < lowest.min) lowest = m;
      if (m.max > highest.max) highest = m;
    });

    minMarket = { name: lowest.market, price: lowest.min };
    maxMarket = { name: highest.market, price: highest.max };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* ব্রেডক্রাম্ব: হোম > categoryName > productName */}
      <div className="text-xs md:text-sm font-medium text-base-content/70 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-primary transition-colors">
          হোম
        </Link>
        <span>{'>'}</span>
        <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors">
          {product.categoryNameBn || product.category}
        </Link>
        <span>{'>'}</span>
        <span className="text-base-content font-bold truncate">
          {product.nameBn}
        </span>
      </div>

      {/* প্রোডাক্ট হেডার কার্ড */}
      <div className="bg-[rgb(250,252,250)] p-6 md:p-8 rounded-3xl border border-green-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-4xl shadow-inner border border-green-100 shrink-0">
            {product.image || "📦"}
          </div>
          <div>
            <h1 className="text-3xl font-black text-[rgb(29,39,31)]">
              {product.nameBn}
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              প্রতি {displayUnit} -  {product.categoryNameBn}
            </p>
            <p className="text-xs font-semibold mt-1.5 text-gray-500">
              {diffText}
            </p>
          </div>
        </div>

        {/* ডান পাশের বক্স */}
        <div className="text-center md:text-right bg-white p-5 rounded-2xl shadow-xs border border-green-100 w-full 
        md:w-auto flex flex-col items-center md:items-center gap-1.5 min-w-[140px]">
          <p>আজকের দাম</p>
          <span className="text-3xl font-extrabold text-[rgb(29,39,31)]">
            {toBengaliNumber(product.today)}
          </span>
          <span className="text-xs font-medium text-gray-500">
            টাকা / {displayUnit}
          </span>
          <span className={`badge text-xs font-bold px-2.5 py-1 rounded-full h-auto ${changeColor}`}>
            {arrow} {toBengaliNumber(product.change?.pct)}%
          </span>
        </div>
      </div>

      {/* দামের সারসংক্ষেপ সেকশন */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[rgb(29,39,31)]">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* সর্বনিম্ন দাম কার্ড */}
          <div className="bg-[rgb(250,252,250)] border border-green-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 block mb-1">সর্বনিম্ন দাম</span>
            <span className="text-2xl font-black text-success my-1">
              {toBengaliNumber(minMarket.price)} টাকা
            </span>
            <span className="text-xs text-base-content/70 mt-1">
              সবচেয়ে কম দামের বাজার: <strong className="text-[rgb(29,39,31)]">{minMarket.name}</strong>
            </span>
          </div>

          {/* সর্বাধিক দাম কার্ড */}
          <div className="bg-[rgb(250,252,250)] border border-green-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 block mb-1">সর্বাধিক দাম</span>
            <span className="text-2xl font-black text-error my-1">
              ৳ {toBengaliNumber(maxMarket.price)}
            </span>
            <span className="text-xs text-base-content/70 mt-1">
              সবচেয়ে বেশি দামের বাজার: <strong className="text-[rgb(29,39,31)]">{maxMarket.name}</strong>
            </span>
          </div>

          {/* গড় দাম কার্ড */}
          <div className="bg-[rgb(250,252,250)] border border-green-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <span className="text-xs font-semibold text-gray-500 block mb-1">গড় দাম</span>
            <span className="text-2xl font-black text-primary my-1">
              ৳ {toBengaliNumber(product.today)}
            </span>
            <span className="text-xs text-base-content/70 mt-1">
              প্রতি {displayUnit} - এর হিসাবে
            </span>
          </div>

        </div>
      </div>

      {/* বিভিন্ন বাজারের দামের তালিকা */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[rgb(29,39,31)]">বাজারভিত্তিক আজকের দাম</h2>
        
        {product.markets && product.markets.length > 0 ? (
          <div className="overflow-x-auto bg-[rgb(250,252,250)] border border-green-100 rounded-2xl shadow-xs">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="text-[rgb(29,39,31)]">বাজার</th>
                  <th className="text-[rgb(29,39,31)]">বিভাগ</th>
                  <th className="text-[rgb(29,39,31)]">সর্বনিম্ন</th>
                  <th className="text-[rgb(29,39,31)]">সর্বোচ্চ</th>
                  <th className="text-[rgb(29,39,31)]">গড়</th>
                </tr>
              </thead>
              <tbody>
                {product.markets.map((m: any, index: number) => {
                  const avgPrice = Math.round(((m.min || 0) + (m.max || 0)) / 2);
                  return (
                    <tr key={index}>
                      <td className="font-semibold text-[rgb(29,39,31)]">{m.market}</td>
                      <td><span className="badge badge-sm badge-ghost font-medium">{m.division}</span></td>
                      <td className="text-success font-bold">{toBengaliNumber(m.min)} টাকা</td>
                      <td className="text-error font-bold">{toBengaliNumber(m.max)} টাকা</td>
                      <td className="text-primary font-bold">{toBengaliNumber(avgPrice)} টাকা</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-base-content/60 text-center py-6 bg-[rgb(250,252,250)] border border-green-100 rounded-2xl">
            এই পণ্যের বাজারভিত্তিক কোনো তথ্য পাওয়া যায়নি।
          </p>
        )}
      </div>

    </div>
  );
}