"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

const ForgotPassword = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [userFound, setUserFound] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus();

    const res = await fetch("/api/auth/resetPassword", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.status === 200 && !userFound) {
      setUserFound(true);
      setStatus("User found! Please enter new password.");
    } else if (data.status === 200 && userFound) {
      setStatus("✅ Password updated successfully. You can now log in.");
      router.push("/login");
    } else {
      setStatus("❌ " + data.message);
    }

    setLoading(false);
  };

  return (
    <div className="w-screen h-screen bg-[#D8E3EB] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#93AEC5] py-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Reset your password</h2>
          <p className="text-sm text-white mt-1">
            Reset your password with ease
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Status */}
          {status && (
            <p className="text-center text-sm text-blue-600 font-semibold">
              {status}
            </p>
          )}
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#93AEC5] focus:ring-2 focus:ring-[#93AEC5]/30 outline-none transition-all"
              required
              placeholder="you@example.com"
            />
          </div>

          {userFound && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#93AEC5] focus:ring-2 focus:ring-[#93AEC5]/30 outline-none transition-all"
                required
                placeholder="New password"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#93AEC5] hover:bg-[#829cb3] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Finding your account...
              </span>
            ) : userFound ? (
              "Update password"
            ) : (
              "Find your account"
            )}
          </button>

          {/* Footer Links */}
          <div className="text-center space-y-4 text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#93AEC5] font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
