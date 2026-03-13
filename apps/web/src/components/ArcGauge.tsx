"use client"

import { useEffect, useState } from "react"

type Props = {
  value: number
}

export default function ArcGauge({ value }: Props) {
  const [progress, setProgress] = useState(0)

  const size = 160
  const strokeWidth = 10
  const radius = 60
  const circumference = Math.PI * radius

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProgress(value)
    }, 200)

    return () => clearTimeout(timeout)
  }, [value])

  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height="110"
        viewBox="0 0 160 110"
      >
        <defs>
          <linearGradient id="cosmosGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* background arc */}
        <path
         
  d="M 20 90 A 60 60 0 0 1 140 90"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* progress arc */}
        <path
          d=" M 20 90 A 60 60 0 0 1 140 90"
          
          fill="none"
          stroke="url(#cosmosGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: "stroke-dashoffset 1.2s ease"
          }}
          filter="url(#glow)"
        />
      </svg>

      {/* center value */}
      <div className="absolute text-center">
        <div className="text-3xl font-bold text-white">
          {progress}%
        </div>
        <div className="text-xs text-gray-400 tracking-wide">
          READINESS
        </div>
      </div>
    </div>
  )
}