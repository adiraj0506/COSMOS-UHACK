"use client";

import Link from "next/link";

export default function Navbar() {
  return (

    <nav className="w-full fixed top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* LOGO */}

        <Link
          href="/"
          className="text-2xl font-bold tracking-widest bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          COSMOS
        </Link>


        {/* NAV LINKS */}

        <div className="hidden md:flex items-center gap-10 text-gray-300">

          <Link href="/" className="hover:text-white transition">
            Home
          </Link>

          <Link href="/about" className="hover:text-white transition">
            About
          </Link>

          <Link href="/features" className="hover:text-white transition">
            Features
          </Link>

          <Link href="/learners" className="hover:text-white transition">
            Learners
          </Link>

          <Link href="/recruiters" className="hover:text-white transition">
            Recruiters
          </Link>

          <Link href="/colleges" className="hover:text-white transition">
            Colleges
          </Link>

        </div>


        {/* ACTION BUTTONS */}

        <div className="flex items-center gap-4">

          <Link href="/login">

            <button className="px-5 py-2 rounded-lg border border-white/20 text-gray-200 hover:bg-white/10 transition">
              Login
            </button>

          </Link>

          <Link href="/signup">

            <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 transition shadow-lg shadow-blue-500/30">
              Get Started →
            </button>

          </Link>

        </div>

      </div>

    </nav>

  );
}