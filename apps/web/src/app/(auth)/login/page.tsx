"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const ROLE_ROUTES: Record<string, string> = {
  learner:   "/learner/dashboard",
  recruiter: "/recruiter/dashboard",
  college:   "/college/dashboard",
  admin:     "/admin/dashboard",
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) { setError(data.error); return; }

      // Store cosmosId in sessionStorage so dashboards can display it
      if (data.cosmosId) {
        sessionStorage.setItem("cosmos_id", data.cosmosId);
      }
      sessionStorage.setItem("cosmos_email", email);
      if (data.role) {
        sessionStorage.setItem("cosmos_role", data.role);
      }
      if (data.fullName) {
        sessionStorage.setItem("cosmos_name", data.fullName);
      }
      if (data.companyName) {
        sessionStorage.setItem("cosmos_org", data.companyName);
      }
      if (data.collegeName) {
        sessionStorage.setItem("cosmos_org", data.collegeName);
      }
      if (data.city) {
        sessionStorage.setItem("cosmos_city", data.city);
      }

      const route = ROLE_ROUTES[data.role];
      if (!route) { setError("Unknown role. Please contact support."); return; }

      router.push(route);

    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />
      <div className="orbit-ring absolute pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-6 left-10 z-20 text-xl font-bold tracking-widest bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        COSMOS
      </div>

      {/* Signup link */}
      <div className="absolute top-6 right-10 z-20 text-sm text-gray-300">
        New here?{" "}
        <span onClick={() => router.push("/signup")} className="text-blue-400 cursor-pointer hover:underline">
          Create account
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.08)]">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your COSMOS account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-xs text-gray-400 mb-1.5 block">Email address</label>
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-gray-400">Password</label>
              <span
                onClick={() => router.push("/forgot-password")}
                className="text-xs text-blue-400 cursor-pointer hover:underline"
              >
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                required
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-medium text-sm hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <span onClick={() => router.push("/signup")} className="text-blue-400 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
