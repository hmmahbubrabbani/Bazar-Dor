import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-6">
      <div className="text-8xl">🔍</div>
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-base-content/60 max-w-md mx-auto">
          আপনি যে পেজটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি ভুল রয়েছে।
        </p>
      </div>
      <div>
        <Link href="/" className="btn btn-primary px-6 shadow-md">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}