"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, BrainCircuit, MessageSquare, Map,
  FileText, Briefcase, LogOut, ChevronLeft, ChevronRight,
  MoreHorizontal, Mail, Bell, Check, Flame, Star, Zap, Target,
} from "lucide-react";

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import Link from "next/link";

import ArcGauge from "@/components/ArcGauge";

const PROFILE = { name: "Akash", streak: 52, readiness: 68, targetRole: "Backend Developer" };
const SKILL_BREAKDOWN = [
  { label: "DSA",             val: 62, color: "#818cf8" },
  { label: "Web Dev",         val: 40, color: "#a78bfa" },
  { label: "Problem Solving", val: 72, color: "#c084fc" },
  { label: "Communication",   val: 55, color: "#e879f9" },
];
const RADAR_DATA = [
  { subject: "DSA",            A: 62 },
  { subject: "Web Dev",        A: 40 },
  { subject: "System Design",  A: 50 },
  { subject: "Communication",  A: 55 },
];
const WEEK_TASKS = [
  { label: "Solve 10 array problems", done: true,  date: "04 Jan" },
  { label: "Build REST API",          done: true,  date: "12 Feb" },
  { label: "Deploy backend project",  done: false, date: "1 Apr"  },
];
const STREAK_DAYS = [
  { day: "M", done: true },{ day: "T", done: true },{ day: "W", done: true },
  { day: "T", done: true },{ day: "F", done: true },{ day: "S", done: false },{ day: "S", done: false },
];
const OPPORTUNITIES = [
  { id: 1, title: "Backend Internship",      company: "StartupX",  tag: "Internship", tagColor: "#7c3aed", ago: "1d", iconBg: "from-red-500 to-orange-500",   icon: "S"   },
  { id: 2, title: "SolveForIndia Hackathon", company: "HackShore", tag: "Hackathon",  tagColor: "#be185d", ago: "3d", iconBg: "from-pink-600 to-rose-500",    icon: "⚡"  },
  { id: 3, title: "Open Source Backend APIs",company: "DevNet",    tag: "DevNet",     tagColor: "#065f46", ago: "5d", iconBg: "from-emerald-600 to-teal-500", icon: "</>" },
];
const RESUME_SUGGESTIONS = [
  "Improve your skills section",
  "Add one more backend project",
  "Highlight API experience",
];
const NAV = [
  { label: "Dashboard",      href: "/learner/dashboard",     icon: LayoutDashboard },
  { label: "Assessment",     href: "/learner/assessment",    icon: BrainCircuit    },
  { label: "Digital Mentor", href: "/learner/mentor",        icon: MessageSquare   },
  { label: "Roadmap",        href: "/learner/roadmap",       icon: Map             },
  { label: "Resume Builder", href: "/learner/resume",        icon: FileText        },
  { label: "Opportunities",  href: "/learner/opportunities", icon: Briefcase       },
];


const glass = "rounded-2xl border border-white/[0.08] backdrop-blur-md p-4";
const cardBg = "bg-gradient-to-br from-white/[0.05] to-white/[0.02]";

export default function LearnerDashboard() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="flex items-center justify-center w-screen h-screen overflow-hidden text-white"
      style={{
        backgroundImage: "url('/images/dash-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#06010f]/60 pointer-events-none" />
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-purple-800/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-800/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-900/10 blur-[160px] pointer-events-none" />

      <div
        className="relative z-10 flex overflow-hidden"
        style={{
          width: "calc(100vw - 40px)",
          height: "calc(100vh - 40px)",
          borderRadius: "20px",
          background: "rgba(6, 2, 18, 0.45)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: "1px solid rgba(139,92,246,0.15)",
          boxShadow: "0 0 0 1px rgba(139,92,246,0.06), 0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <aside className={`relative flex flex-col h-full shrink-0 border-r border-white/[0.06] transition-all duration-300 ${collapsed ? "w-14" : "w-48"}`}
          style={{ background: "rgba(10,4,30,0.5)" }}>
          <div className={`flex items-center gap-2 px-4 py-4 border-b border-white/[0.06] ${collapsed ? "justify-center" : ""}`}>
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-black shadow-[0_0_12px_rgba(139,92,246,0.6)]">✦</div>
            {!collapsed && <span className="font-black tracking-[0.2em] text-xs bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">COSMOS</span>}
          </div>
          <nav className="flex-1 py-3 px-2 space-y-0.5">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = href === "/learner/dashboard";
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 ${active ? "bg-violet-600/70 text-white shadow-[0_0_16px_rgba(124,58,237,0.5)]" : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"} ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? label : undefined}>
                  <Icon size={15} className="shrink-0" />
                  {!collapsed && <span className="font-medium">{label}</span>}
                </Link>
              );
            })}
          </nav>
          <div className={`px-2 py-3 border-t border-white/[0.06] ${collapsed ? "flex justify-center" : ""}`}>
            <button onClick={() => router.push("/login")}
              className={`flex items-center gap-2 text-gray-600 hover:text-red-400 text-xs transition px-3 py-2 rounded-xl hover:bg-red-500/10 ${collapsed ? "justify-center" : "w-full"}`}>
              <LogOut size={13} />
              {!collapsed && "Logout"}
            </button>
          </div>
          <button onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0d0520] border border-violet-500/30 flex items-center justify-center text-violet-400 hover:text-white z-20 shadow-[0_0_10px_rgba(139,92,246,0.3)]">
            {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
          </button>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] shrink-0"
            style={{ background: "rgba(10,4,30,0.3)" }}>
            <div>
              <p className="text-gray-500 text-xs">Welcome Back, <span className="text-violet-300 font-semibold">{PROFILE.name}</span></p>
              <p className="text-white font-bold text-base tracking-tight">Learner Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              {[Mail, Bell].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-violet-300 hover:border-violet-500/30 transition">
                  <Icon size={13} />
                </button>
              ))}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-black cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.4)]">A</div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-12 grid-rows-[auto_auto_auto] gap-3 h-full" style={{ gridTemplateRows: "1fr 1fr 1fr" }}>

              {/* ROW 1 */}

              {/* Readiness Score — col 4 */}
              <div className={`col-span-4 row-span-1 ${glass} ${cardBg} flex flex-col`}
                style={{ boxShadow: "inset 0 0 40px rgba(124,58,237,0.06), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-white font-bold text-xs tracking-wide flex items-center gap-1.5">
                    <Target size={13} className="text-violet-400" /> Your Readiness Score
                  </h2>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <Flame size={11} className="text-orange-400" />
                    <span className="text-orange-300 text-[10px] font-bold">{PROFILE.streak}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div className="shrink-0"><ArcGauge value={PROFILE.readiness} /></div>
                  <div className="flex-1 space-y-1.5">
                    <div className="mb-2">
                      <p className="text-[10px] text-gray-500 mb-0.5">Target Role</p>
                      <p className="text-violet-200 font-bold text-xs">{PROFILE.targetRole}</p>
                    </div>
                    {SKILL_BREAKDOWN.map(({ label, val, color }) => (
                      <div key={label}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[10px] text-gray-400">{label}</span>
                          <span className="text-[10px] font-bold text-white">{val}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full" style={{ width: `${val}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skill Radar — col 4 */}
              <div className={`col-span-4 row-span-1 ${glass} ${cardBg} flex flex-col`}
                style={{ boxShadow: "inset 0 0 40px rgba(168,85,247,0.05), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-white font-bold text-xs tracking-wide flex items-center gap-1.5">
                    <Zap size={13} className="text-purple-400" /> Skill Radar
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ boxShadow: "0 0 6px #a855f7" }} />
                    <span className="text-[10px] text-gray-500">Current</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius="65%">
                      <PolarGrid stroke="rgba(139,92,246,0.12)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 10 }} />
                      <Radar dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.18} strokeWidth={1.5}
                        style={{ filter: "drop-shadow(0 0 10px rgba(168,85,247,0.8))" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Daily Streak — col 4 */}
              <div className={`col-span-4 row-span-1 ${glass} ${cardBg} flex flex-col`}
                style={{ boxShadow: "inset 0 0 40px rgba(251,146,60,0.05), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-bold text-xs tracking-wide flex items-center gap-1.5">
                    <Flame size={13} className="text-orange-400" /> Daily Streak
                  </h2>
                  <span className="text-[10px] text-gray-500 px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">14 days to free assessment</span>
                </div>
                <div className="flex items-end gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Flame size={32} className="text-orange-400" style={{ filter: "drop-shadow(0 0 10px rgba(251,146,60,0.8))" }} />
                    <span className="text-5xl font-black text-white" style={{ textShadow: "0 0 20px rgba(251,146,60,0.4)" }}>{PROFILE.streak}</span>
                  </div>
                  <span className="text-gray-500 text-xs mb-2">active days</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 mb-3">
                  {STREAK_DAYS.map(({ day, done }, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[9px] text-gray-600 font-medium">{day}</span>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${done ? "bg-violet-600/60 border border-violet-400/40 shadow-[0_0_8px_rgba(124,58,237,0.5)]" : "bg-white/[0.04] border border-white/[0.06]"}`}>
                        {done && <Check size={11} className="text-violet-200" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-end gap-px h-10">
                  {[3,5,4,7,6,5,4,6,5,8,7,6,8,7].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm"
                      style={{ height: `${h * 5}%`, background: `rgba(139,92,246,${0.2 + h * 0.04})` }} />
                  ))}
                </div>
              </div>

              {/* ROW 2 */}

              {/* Roadmap Progress — col 6 */}
              <div className={`col-span-6 row-span-1 ${glass} ${cardBg} flex flex-col`}
                style={{ boxShadow: "inset 0 0 40px rgba(99,102,241,0.05), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-bold text-xs tracking-wide flex items-center gap-1.5">
                    <Map size={13} className="text-indigo-400" /> Roadmap Progress
                  </h2>
                  <span className="text-[10px] font-bold text-indigo-300 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">Week 1</span>
                </div>
                <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-xl bg-violet-900/20 border border-violet-500/15">
                  <span className="text-xs text-violet-300 font-semibold shrink-0">Weekly Progress</span>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06]">
                    <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      style={{ boxShadow: "0 0 10px rgba(139,92,246,0.6)" }} />
                  </div>
                  <span className="text-violet-300 text-xs font-bold">35%</span>
                </div>
                <div className="space-y-2.5 flex-1">
                  {WEEK_TASKS.map((t) => (
                    <div key={t.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${t.done ? "bg-violet-900/15 border-violet-500/15" : "bg-white/[0.03] border-white/[0.05]"}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all ${t.done ? "bg-violet-500 border-violet-400 shadow-[0_0_8px_rgba(124,58,237,0.6)]" : "border-gray-700 bg-white/[0.04]"}`}>
                        {t.done && <Check size={10} className="text-white" />}
                      </div>
                      <span className={`flex-1 text-xs font-medium ${t.done ? "text-gray-500 line-through" : "text-gray-200"}`}>{t.label}</span>
                      <span className="text-[10px] text-gray-600 shrink-0">{t.date}</span>
                      {t.done && <div className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ boxShadow: "0 0 4px #a855f7" }} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Strength — col 6 */}
              <div className={`col-span-6 row-span-1 ${glass} ${cardBg} flex flex-col`}
                style={{ boxShadow: "inset 0 0 40px rgba(236,72,153,0.04), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-bold text-xs tracking-wide flex items-center gap-1.5">
                    <FileText size={13} className="text-fuchsia-400" /> Resume Strength
                  </h2>
                  <MoreHorizontal size={14} className="text-gray-600" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#resumeGrad)" strokeWidth="6"
                        strokeLinecap="round" strokeDasharray={`${2*Math.PI*26 * 0.72} ${2*Math.PI*26}`} />
                      <defs>
                        <linearGradient id="resumeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-black text-white">72</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-2xl mb-0.5">72 <span className="text-gray-500 text-sm font-normal">/ 100</span></p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= 3 ? "bg-fuchsia-500" : "bg-white/[0.08]"}`}
                          style={i <= 3 ? { boxShadow: "0 0 6px rgba(217,70,239,0.6)" } : {}} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mb-2 font-semibold uppercase tracking-widest">Suggestions</p>
                <ul className="space-y-1.5 flex-1">
                  {RESUME_SUGGESTIONS.map((s) => (
                    <li key={s} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      <div className="w-1 h-1 rounded-full bg-fuchsia-500 shrink-0" style={{ boxShadow: "0 0 4px #d946ef" }} />
                      <span className="text-[11px] text-gray-400">{s}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/learner/mentor"
                  className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
                  Ask Digital Mentor <ChevronRight size={13} />
                </Link>
              </div>

              {/* ROW 3 */}

              {/* Mentor Insights — col 5 */}
              <div className={`col-span-5 row-span-1 ${glass} ${cardBg} flex flex-col`}
                style={{ boxShadow: "inset 0 0 40px rgba(99,102,241,0.05), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-bold text-xs tracking-wide flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-cyan-400" /> Mentor Insights
                  </h2>
                  <MoreHorizontal size={14} className="text-gray-600" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {[
                      { icon: "📈", text: "Problem Solving improved by 5% this week — great momentum!", color: "from-emerald-900/30 to-transparent", border: "border-emerald-500/20" },
                      { icon: "🎯", text: "Focus on System Design next to unlock Senior Dev paths.", color: "from-violet-900/30 to-transparent", border: "border-violet-500/20" },
                      { icon: "⚡", text: "3 backend tasks due this week — stay on track!", color: "from-amber-900/20 to-transparent", border: "border-amber-500/20" },
                    ].map((tip, i) => (
                      <div key={i} className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r ${tip.color} border ${tip.border}`}>
                        <span className="text-sm shrink-0 mt-0.5">{tip.icon}</span>
                        <p className="text-xs text-gray-300 leading-relaxed">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/learner/mentor"
                    className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #0e7490, #7c3aed)", boxShadow: "0 0 20px rgba(14,116,144,0.3)" }}>
                    Ask Digital Mentor <ChevronRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Recommended Opportunities — col 7 */}
              <div className={`col-span-7 row-span-1 ${glass} ${cardBg} flex flex-col`}
                style={{ boxShadow: "inset 0 0 40px rgba(99,102,241,0.04), 0 0 0 1px rgba(139,92,246,0.1)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-bold text-xs tracking-wide flex items-center gap-1.5">
                    <Star size={13} className="text-amber-400" /> Recommended Opportunities
                  </h2>
                  <Link href="/learner/opportunities" className="text-[10px] text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-0.5 transition">
                    View All <ChevronRight size={11} />
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2.5 flex-1">
                  {OPPORTUNITIES.map((opp) => (
                    <div key={opp.id} className="flex flex-col rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 cursor-pointer hover:border-violet-500/30 hover:bg-violet-900/10 transition-all group">
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${opp.iconBg} flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-lg`}>
                          {opp.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-[11px] font-bold leading-tight">{opp.title}</p>
                          <p className="text-gray-600 text-[9px] mt-0.5">{opp.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[9px] px-2 py-0.5 rounded-md font-semibold text-white" style={{ background: opp.tagColor }}>{opp.tag}</span>
                        <span className="text-[9px] text-gray-600">{opp.ago} ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
