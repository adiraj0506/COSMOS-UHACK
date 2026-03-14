"use client";

type Props = {
  value: number; // 0 - 100
};

export default function ArcGauge({ value }: Props) {
  const radius = 90;
  const stroke = 14;

  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * Math.PI;

  const progress = (value / 100) * circumference;

  return (
    <div className="relative w-[220px] h-[120px] flex items-center justify-center">

      <svg
        height={120}
        width={220}
        viewBox="0 0 220 120"
      >
        <defs>

          {/* Neon Gradient */}
          <linearGradient id="cosmosGauge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          {/* Glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

        </defs>

        {/* Background Arc */}

        <path
          d="M20 100 A90 90 0 0 1 200 100"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
        />

        {/* Progress Arc */}

        <path
          d="M20 100 A90 90 0 0 1 200 100"
          stroke="url(#cosmosGauge)"
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          filter="url(#glow)"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />

      </svg>

      {/* Percentage */}

      <div className="absolute top-[35px] text-3xl font-bold text-white">
        {value}%
      </div>

    </div>
  );
}