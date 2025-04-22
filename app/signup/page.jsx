"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.status === 200) {
      router.push("/login");
      setLoading(false);
    } else {
      setStatus(data.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen  flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 py-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Sign Up</h2>
          <p className="text-white mt-1 text-sm">
            Join us and get started today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#93AEC5] focus:ring-2 focus:ring-[#93AEC5]/30 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#93AEC5] focus:ring-2 focus:ring-[#93AEC5]/30 outline-none transition-all"
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
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#93AEC5] focus:ring-2 focus:ring-[#93AEC5]/30 outline-none transition-all"
              placeholder="••••••••"
            />
            {status && <p className="text-sm text-red-500 mt-2">{status}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Footer */}
          <div className="text-center text-sm mt-4 text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
