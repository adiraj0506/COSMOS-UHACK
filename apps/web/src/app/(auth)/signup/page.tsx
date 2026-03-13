"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

// Role → dashboard route map
const ROLE_ROUTES: Record<string, string> = {
  learner: "/learner/dashboard",
  recruiter: "/recruiter/dashboard",
  college: "/college/dashboard",
  admin: "/admin/dashboard",
};

// ─── TODO for backend teammate ───────────────────────────────────────────────
// POST /api/auth/signup
// Body:    { fullName, email, password, role, cosmosId, ...extraFields }
// Server should:
//   1. supabase.auth.signUp({ email, password })
//   2. INSERT into profiles (id, full_name, role, cosmos_id, ...)
//   3. Verify cosmos_id uniqueness — regenerate if collision
//   4. Return { role, cosmosId } on success, { error } on failure
//
// Required profiles table addition:
//   cosmos_id  text unique not null   ← e.g. CSM-LRN-4821
// ─────────────────────────────────────────────────────────────────────────────

// Client-side COSMOS ID preview generator
// Format: CSM-{ROLE_PREFIX}-{4 random digits}
// Server must verify uniqueness and may regenerate before storing.
function generateCosmosId(role: string): string {
  const prefix: Record<string, string> = {
    learner: "LRN",
    recruiter: "RCT",
    college: "CLG",
    admin: "ADM",
  };
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `CSM-${prefix[role] ?? "USR"}-${digits}`;
}

const ROLES = [
  { value: "learner",   label: "Learner — Student / Job seeker" },
  { value: "recruiter", label: "Recruiter — Hire talent" },
  { value: "college",   label: "College — Track student readiness" },
  { value: "admin",     label: "Admin — Platform management" },
];

// Extra fields that appear when certain roles are selected
const ROLE_EXTRA: Record<string, { placeholder: string; field: string; required?: boolean }[]> = {
  recruiter: [{ placeholder: "Company name", field: "companyName", required: true }],
  college:   [
    { placeholder: "Institution name", field: "collegeName", required: true },
    { placeholder: "City",             field: "city" },
  ],
  admin: [{ placeholder: "Invite code", field: "inviteCode", required: true }],
};

const ROLE_PREFIX: Record<string, string> = {
  learner: "LRN", recruiter: "RCT", college: "CLG", admin: "ADM",
};

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirm: "", role: "",
    companyName: "", collegeName: "", city: "", inviteCode: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [createdId, setCreatedId] = useState(""); // success state

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.role)                            { setError("Please select a role."); return; }
    if (form.password !== form.confirm)        { setError("Passwords do not match."); return; }
    if (form.password.length < 8)             { setError("Password must be at least 8 characters."); return; }

    const cosmosId = generateCosmosId(form.role);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cosmosId }),
      });

      const data = await res.json();
      if (data.error) { setError(data.error); return; }

      // Show the confirmed COSMOS ID (server may have regenerated it)
      setCreatedId(data.cosmosId ?? cosmosId);
      setTimeout(() => router.push(ROLE_ROUTES[form.role] ?? "/login"), 3000);

    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const extraFields = ROLE_EXTRA[form.role] ?? [];

  // ── Success screen ────────────────────────────────────────────────────────
  if (createdId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 relative text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/images/login-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="relative z-10 text-center p-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 max-w-sm w-full shadow-[0_0_60px_rgba(99,102,241,0.2)]">
          <div className="w-14 h-14 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center mx-auto mb-5 text-teal-400 text-2xl">
            ✓
          </div>
          <h2 className="text-xl font-semibold text-white mb-1">Account created!</h2>
          <p className="text-gray-400 text-sm mb-6">Your unique COSMOS ID — save this</p>
          <div className="px-5 py-4 rounded-xl bg-blue-500/10 border border-blue-400/30 font-mono text-xl font-bold tracking-widest text-blue-300 mb-3">
            {createdId}
          </div>
          <p className="text-gray-500 text-xs">This ID is linked to your account and used during login matching.</p>
          <p className="text-gray-600 text-xs mt-2">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Signup form ───────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />
      <div className="orbit-ring absolute pointer-events-none" />

      {/* Logo */}
      <div className="absolute top-6 left-10 z-20 text-xl font-bold tracking-widest bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        COSMOS
      </div>

      {/* Already have account */}
      <div className="absolute top-6 right-10 z-20 text-sm text-gray-300">
        Already have an account?{" "}
        <span onClick={() => router.push("/login")} className="text-blue-400 cursor-pointer hover:underline">
          Sign in
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.08)]">

        <div className="text-center mb-7">
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Create account
          </h1>
          <p className="text-gray-400 text-sm mt-1">You'll receive a unique COSMOS ID on signup</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Full name */}
          <input
            required
            placeholder="Full name"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition"
          />

          {/* Email */}
          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition"
          />

          {/* Role dropdown */}
          <div className="relative">
            <select
              required
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0d1729] border border-white/15 text-sm focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
              style={{ color: form.role ? "white" : "#6b7280" }}
            >
              <option value="" disabled>Select your role</option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value} style={{ color: "white", background: "#0d1729" }}>
                  {r.label}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▾</span>
          </div>

          {/* Dynamic role-specific fields */}
          {extraFields.map(({ placeholder, field, required }) => (
            <input
              key={field}
              required={required}
              placeholder={placeholder}
              value={(form as Record<string, string>)[field]}
              onChange={(e) => update(field, e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          ))}

          {/* Password */}
          <div className="relative">
            <input
              required
              type={showPass ? "text" : "password"}
              placeholder="Password (min 8 chars)"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
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

          {/* Confirm password */}
          <input
            required
            type="password"
            placeholder="Confirm password"
            value={form.confirm}
            onChange={(e) => update("confirm", e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition"
          />

          {/* COSMOS ID preview — visible once role is chosen */}
          {form.role && (
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="text-blue-400 text-xs">Your COSMOS ID format</span>
              <span className="font-mono text-sm font-bold text-blue-300 tracking-wider">
                CSM-{ROLE_PREFIX[form.role]}-????
              </span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-medium text-sm hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create account & get my ID"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{" "}
          <span onClick={() => router.push("/login")} className="text-blue-400 cursor-pointer hover:underline">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
