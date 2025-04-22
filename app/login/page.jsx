"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.status === 401) {
      setStatus(data.message);
      setLoading(false);
    } else if (data.status === 404) {
      setStatus(data.message);
      setLoading(false);
    } else {
      setStatus(data.message);
      setUser(data);
      setLoading(false);

      router.push("/face-scan");
    }
  };

  return (
    <div className="w-screen h-screen bg-[#D8E3EB] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#93AEC5] py-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-white mt-1">
            Please sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#93AEC5] focus:ring-2 focus:ring-[#93AEC5]/30 outline-none transition-all"
              required
              placeholder="••••••••"
            />
            {status !== "Login successful" ? (
              <p className="text-sm text-red-500 mt-2">{status}</p>
            ) : (
              <p className="text-sm text-green-500 mt-2">{status}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#93AEC5] hover:bg-[#829cb3] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Footer Links */}
          <div className="text-center space-y-4 text-sm">
            <a
              href="/forgot-password"
              className="text-[#93AEC5] hover:underline block"
            >
              Forgot your password?
            </a>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[#93AEC5] font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
