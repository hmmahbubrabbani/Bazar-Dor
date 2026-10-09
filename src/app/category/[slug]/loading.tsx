export default function CategoryLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-base-content/60 font-medium">ক্যাটাগরির পণ্যসমূহ লোড হচ্ছে...</p>
    </div>
  );
}