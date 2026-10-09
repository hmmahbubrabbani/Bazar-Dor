"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    } else if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session, isPending, router]);

 
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const { error } = await authClient.updateUser({
        name: name,
      });

      if (error) {
        throw new Error(error.message || "আপডেট করতে সমস্যা হয়েছে।");
      }

      setSuccessMessage("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      refetch();
    } catch (err: any) {
      setErrorMessage(err.message || "একটি ত্রুটি ঘটেছে।");
    } finally {
      setLoading(false);
    }
  };

 
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-success"></span>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user;

  const userImage = user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

  return (
    <div className="min-h-[85vh] bg-[rgb(240,245,240)] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
       
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-[rgb(29,39,31)]">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs md:text-sm text-base-content/60 font-medium">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

   
        <div className="bg-[rgb(250,252,250)] p-6 rounded-3xl border border-green-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-green-200 shrink-0 bg-white shadow-xs">
              <Image 
                src={userImage} 
                alt={user.name || "User"} 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[rgb(29,39,31)]">
                {user.name}
              </h2>
              <p className="text-xs md:text-sm text-base-content/60 font-medium">
                {user.email}
              </p>
            </div>
          </div>

          <button 
            onClick={handleSignOut}
            className="btn btn-sm btn-outline border-error text-error hover:bg-error hover:text-white hover:border-error rounded-xl px-4 py-2 font-semibold h-10 w-full sm:w-auto transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>🚪</span> সাইন আউট
          </button>
        </div>

       
        <div className="bg-[rgb(250,252,250)] p-6 md:p-8 rounded-3xl border border-green-100 shadow-sm space-y-6">
          <h2 className="text-lg md:text-xl font-bold text-[rgb(29,39,31)] border-b border-green-50 pb-3">
            তথ্য
          </h2>

          {successMessage && (
            <div className="bg-success/10 text-success text-xs p-3 rounded-xl font-semibold text-center border border-success/20">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-error/10 text-error text-xs p-3 rounded-xl font-semibold text-center border border-error/20">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-semibold text-[rgb(29,39,31)]">
                নাম
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input input-bordered w-full bg-white border-green-200 text-sm h-12 focus:outline-none focus:border-green-600 rounded-xl shadow-xs"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#008236] hover:bg-[#006b2c] text-white font-semibold h-12 rounded-xl shadow-sm text-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span> আপডেট হচ্ছে...
                </>
              ) : (
                "আপডেট"
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}