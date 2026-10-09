export default function Footer() {
  return (
    <footer className="bg-[rgb(250,252,250)] border-t border-green-100 text-base-content mt-auto py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="font-medium text-sm text-[rgb(29,39,31)]">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
        <p className="text-xs text-base-content/60">
          সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}