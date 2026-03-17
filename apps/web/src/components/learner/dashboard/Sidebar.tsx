"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BrainCircuit,
  MessageSquare,
  Map,
  FileText,
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/learner/dashboard", icon: LayoutDashboard },
  { label: "Assessment", href: "/learner/assessment", icon: BrainCircuit },
  { label: "Saarthi", href: "/learner/mentor", icon: MessageSquare },
  { label: "Roadmap", href: "/learner/roadmap", icon: Map },
  { label: "Resume Builder", href: "/learner/resume", icon: FileText },
  { label: "Opportunities", href: "/learner/opportunities", icon: Briefcase },
];

type Props = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

export default function Sidebar({ collapsed, setCollapsed }: Props) {

  const router = useRouter();
  const pathname = usePathname();

  return (

<aside
className={`relative flex flex-col h-full shrink-0 border-r border-white/[0.06] transition-all duration-300 ${collapsed ? "w-14" : "w-48"}`}
style={{ background: "rgba(10,4,30,0.5)" }}
>

{/* LOGO */}

<div className={`flex items-center gap-2 px-4 py-4 border-b border-white/[0.06] ${collapsed ? "justify-center" : ""}`}>

<div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-black shadow-[0_0_12px_rgba(139,92,246,0.6)]">

✦

</div>

{!collapsed && (
<span className="font-black tracking-[0.2em] text-xs bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">

COSMOS

</span>
)}

</div>

{/* NAVIGATION */}

<nav className="flex-1 py-3 px-2 space-y-0.5">

{NAV.map(({ label, href, icon: Icon }) => {

const active = pathname === href;

return (

<Link
key={href}
href={href}
className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150
${active
? "bg-violet-600/70 text-white shadow-[0_0_16px_rgba(124,58,237,0.5)]"
: "text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]"
}
${collapsed ? "justify-center" : ""}
`}
title={collapsed ? label : undefined}
>

<Icon size={15} className="shrink-0" />

{!collapsed && <span className="font-medium">{label}</span>}

</Link>

);

})}

</nav>

{/* LOGOUT */}

<div className={`px-2 py-3 border-t border-white/[0.06] ${collapsed ? "flex justify-center" : ""}`}>

<button
onClick={() => router.push("/login")}
className={`flex items-center gap-2 text-gray-600 hover:text-red-400 text-xs transition px-3 py-2 rounded-xl hover:bg-red-500/10 ${collapsed ? "justify-center" : "w-full"}`}
>

<LogOut size={13} />

{!collapsed && "Logout"}

</button>

</div>

{/* COLLAPSE BUTTON */}

<button
onClick={() => setCollapsed(!collapsed)}
className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0d0520] border border-violet-500/30 flex items-center justify-center text-violet-400 hover:text-white z-20 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
>

{collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}

</button>

</aside>

);

}