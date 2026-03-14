"use client";

import { useState } from "react";
import Sidebar from "@/components/learner/dashboard/Sidebar";
import Topbar from "@/components/learner/dashboard/Topbar";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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

{/* background overlay */}

<div className="absolute inset-0 bg-[#06010f]/60" />

{/* glow effects */}

<div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-purple-800/20 blur-[140px]" />
<div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-800/20 blur-[120px]" />
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-900/10 blur-[160px]" />

{/* glass container */}

<div
className="relative z-10 flex overflow-hidden"
style={{
width: "calc(100vw - 40px)",
height: "calc(100vh - 40px)",
borderRadius: "20px",
background: "rgba(6,2,18,0.45)",
backdropFilter: "blur(32px)",
border: "1px solid rgba(139,92,246,0.15)",
boxShadow:
"0 0 0 1px rgba(139,92,246,0.06), 0 40px 100px rgba(0,0,0,0.7)",
}}
>

<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

<div className="flex-1 flex flex-col overflow-hidden">

<Topbar />

<div className="flex-1 overflow-y-auto p-4">

{children}

</div>

</div>

</div>

</div>

);
}