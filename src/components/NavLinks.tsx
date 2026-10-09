"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="py-2.5 overflow-x-auto scrollbar-none">
      <ul className="flex items-center justify-start gap-2 min-w-max">
        <li>
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname === "/" ? "bg-green-600 text-white font-bold shadow-sm" : "hover:bg-green-50 text-[rgb(29,39,31)]"
            }`}
          >
            <span>🏠</span> হোম
          </Link>
        </li>
        {categories.map((cat) => {
          const isActive = pathname === `/category/${cat.slug}`;
          return (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "bg-green-600 text-white font-bold shadow-sm"
                    : "hover:bg-green-50 text-[rgb(29,39,31)]"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}