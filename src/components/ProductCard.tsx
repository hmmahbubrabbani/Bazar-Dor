import Link from "next/link";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | string;
    pct: number;
  };
  markets: Market[];
}

interface ProductCardProps {
  product: Product;
}


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
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((digit) => (/[0-9]/.test(digit) ? bengaliDigits[Number(digit)] : digit))
    .join("");
};

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  
 
  const changeColor = isUp ? "text-error bg-error/10" : isDown ? "text-success bg-success/10" : "text-base-content/70 bg-base-200";
  const arrow = isUp ? "▲" : isDown ? "▼" : "—";
  const displayUnit = getBanglaUnit(product.unit);

  return (
    <Link 
      href={`/product/${product.slug}`} 
      className="card bg-[rgb(250,252,250)] border border-green-100 shadow-xs hover:shadow-md hover:border-green-300 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between p-3.5 space-y-2 block group cursor-pointer"
    >
   
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
          {product.image || "📦"}
        </div>
        <div className="overflow-hidden w-full">
          <h3 className="font-bold text-sm text-[rgb(29,39,31)] truncate group-hover:text-primary transition-colors">
            {product.nameBn}
          </h3>
          <span className="text-[11px] text-[rgb(29,39,31)] font-medium">প্রতি {displayUnit}</span>
        </div>
      </div>

    
      <div className="flex items-end justify-between px-0.5 pt-1">
        <div>
          <span className="text-[14px] text-[rgb(29,39,31)] block leading-tight mb-0.5">আজকের দাম</span>
          <div>
            <span className="text-base font-black text-[rgb(29,39,31)]">
              {toBengaliNumber(product.today)} টাকা
            </span>
          </div>
        </div>
        <div>
          <span className={`badge text-[10px] font-bold px-2 py-0.5 rounded-full h-auto ${changeColor}`}>
            {arrow} {toBengaliNumber(product.change?.pct)}%
          </span>
        </div>
      </div>
    </Link>
  );
}