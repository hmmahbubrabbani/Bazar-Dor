// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Input, Button } from "@heroui/react";
// import { authClient } from "@/lib/auth-client";

// export default function ProfileUpdatePage() {
//   const router = useRouter();
//   const { data: session, isPending, refetch } = authClient.useSession();

//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // সেশন থেকে ইউজারের নাম লোড করা
//   useEffect(() => {
//     if (!isPending && !session) {
//       router.push("/signin");
//     } else if (session?.user) {
//       setName(session.user.name || "");
//     }
//   }, [session, isPending, router]);

//   // প্রোফাইল আপডেট হ্যান্ডলার
//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const { data, error: updateError } = await authClient.updateUser({
//         name: name,
//       });

//       if (updateError) {
//         throw new Error(updateError.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।");
//       }

//       setSuccess("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
//       refetch(); // সেশন ডেটা রিফ্রেশ করা

//       setTimeout(() => {
//         router.push("/profile");
//       }, 1500);
//     } catch (err: any) {
//       setError(err.message || "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isPending) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <span className="loading loading-spinner loading-lg text-success"></span>
//           <p className="text-xs text-gray-500 font-medium">লোড হচ্ছে...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session) return null;

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[rgb(240,245,240)]">
//       <div className="max-w-md w-full bg-[rgb(250,252,250)] p-8 rounded-3xl border border-green-100 shadow-sm space-y-6">
        
//         {/* হেডার */}
//         <div className="text-center space-y-2">
//           <Link href="/profile" className="inline-block">
//             <span className="text-2xl p-2.5 bg-white rounded-2xl border border-green-100 shadow-xs inline-block">
//               ✏️
//             </span>
//           </Link>
//           <h1 className="text-2xl font-black text-[rgb(29,39,31)]">
//             প্রোফাইল আপডেট করুন
//           </h1>
//           <p className="text-xs text-base-content/60 font-medium">
//             আপনার অ্যাকাউন্টের তথ্য পরিবর্তন করুন
//           </p>
//         </div>

//         {/* এরর বা সাকসেস মেসেজ */}
//         {error && (
//           <div className="bg-error/10 border border-error/20 text-error text-xs p-3 rounded-xl font-semibold text-center animate-shake">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="bg-success/10 border border-success/20 text-success text-xs p-3 rounded-xl font-semibold text-center">
//             {success}
//           </div>
//         )}

//         {/* আপডেট ফর্ম */}
//         <form onSubmit={handleUpdateProfile} className="space-y-4">
//           <Input 
//             type="text" 
//             label="আপনার নাম"
//             placeholder="আপনার নাম লিখুন" 
//             variant="bordered"
//             isRequired
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             classNames={{
//               inputWrapper: "border-green-200 bg-white data-[hover=true]:border-green-500 group-data-[focus=true]:border-green-600 rounded-xl h-12",
//               label: "text-xs font-semibold text-[rgb(29,39,31)]",
//             }}
//           />

//           <div>
//             <label className="block text-xs font-semibold text-[rgb(29,39,31)] mb-1">
//               ইমেল ঠিকানা (পরিবর্তনযোগ্য নয়)
//             </label>
//             <input 
//               type="email" 
//               disabled
//               value={session.user.email} 
//               className="input input-bordered w-full bg-gray-100 text-gray-500 border-gray-200 text-sm h-11 rounded-xl cursor-not-allowed"
//             />
//           </div>

//           <Button 
//             type="submit" 
//             isLoading={loading}
//             className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-11 rounded-xl shadow-sm text-sm"
//           >
//             পরিবর্তন সংরক্ষণ করুন
//           </Button>
//         </form>

//         {/* ব্যাক বাটন */}
//         <div className="text-center pt-2">
//           <Link href="/profile" className="text-xs text-green-700 font-bold hover:underline">
//             ← প্রোফাইলে ফিরে যান
//           </Link>
//         </div>

//       </div>
//     </div>
//   );
// }