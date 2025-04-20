"use client";
import HeaderScan from "@/components/HeaderScan";
import { useUser } from "@/hooks/useUser";

export default function ProfilePage() {
  const { user, loading, error } = useUser();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Failed to load user data.</p>
      </div>
    );
  }

  const name = user?.user?.name;
  const email = user?.user?.email;
  const initial = name?.[0]?.toUpperCase();

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderScan />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-400 text-white text-3xl font-bold">
              {initial}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </div>

          <hr />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Account Details</h3>
            <ul className="text-gray-600 space-y-1">
              <li>🆔 <span className="font-medium">User ID:</span> {user.user._id}</li>
              <li>📧 <span className="font-medium">Email:</span> {email}</li>
              <li>🗓️ <span className="font-medium">Joined:</span> {new Date(user.user.createdAt).toLocaleDateString()}</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
