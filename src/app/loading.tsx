export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-base-content/60 font-medium">বাজারের তথ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
    </div>
  );
}