"use client";

import { useEffect, useState } from "react";
import { Mail, Bell } from "lucide-react";

type Props = {
  name?: string;
};

export default function Topbar({ name }: Props) {
  const [resolvedName, setResolvedName] = useState(name ?? "Akash");

  useEffect(() => {
    if (name) {
      setResolvedName(name);
      return;
    }
    const stored = sessionStorage.getItem("cosmos_name");
    if (stored) setResolvedName(stored);
  }, [name]);

return (

<header
className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] shrink-0"
style={{ background: "rgba(10,4,30,0.3)" }}
>

<div>

<p className="text-gray-500 text-xs">
Welcome Back, <span className="text-violet-300 font-semibold">{resolvedName}</span>
</p>

<p className="text-white font-bold text-base tracking-tight">
Learner Dashboard
</p>

</div>

<div className="flex items-center gap-2">

{[Mail, Bell].map((Icon, i) => (

<button
key={i}
className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-gray-500 hover:text-violet-300 hover:border-violet-500/30 transition"
>

<Icon size={13} />

</button>

))}

<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-black cursor-pointer shadow-[0_0_12px_rgba(124,58,237,0.4)]">

{resolvedName.trim().charAt(0) || 'A'}

</div>

</div>

</header>

);

}
