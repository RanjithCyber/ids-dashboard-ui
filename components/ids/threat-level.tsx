"use client"

import { Gauge } from "lucide-react"

interface ThreatLevelProps {
  totalRecords: number
  totalAttacks: number
}

export function ThreatLevel({ totalRecords, totalAttacks }: ThreatLevelProps) {
  const attackPercentage = totalRecords > 0 ? (totalAttacks / totalRecords) * 100 : 0
  
  let level: "low" | "medium" | "high" | "critical"
  let color: string
  let bgColor: string
  let borderColor: string
  let description: string
  
  if (attackPercentage === 0) {
    level = "low"
    color = "#00ff88"
    bgColor = "bg-[#00ff88]/10"
    borderColor = "border-[#00ff88]/30"
    description = "No threats detected"
  } else if (attackPercentage < 20) {
    level = "low"
    color = "#00ff88"
    bgColor = "bg-[#00ff88]/10"
    borderColor = "border-[#00ff88]/30"
    description = "Minimal threat activity"
  } else if (attackPercentage < 50) {
    level = "medium"
    color = "#ffaa00"
    bgColor = "bg-[#ffaa00]/10"
    borderColor = "border-[#ffaa00]/30"
    description = "Moderate threat activity"
  } else if (attackPercentage < 75) {
    level = "high"
    color = "#ff6644"
    bgColor = "bg-[#ff6644]/10"
    borderColor = "border-[#ff6644]/30"
    description = "High threat activity detected"
  } else {
    level = "critical"
    color = "#ff3366"
    bgColor = "bg-[#ff3366]/10"
    borderColor = "border-[#ff3366]/30"
    description = "Critical: Immediate action required"
  }

  return (
    <section className={`rounded-xl border ${borderColor} ${bgColor} p-5 md:p-6 h-full`}>
      <h2 className="text-lg font-semibold text-[#e4e4e7] mb-6 flex items-center gap-2">
        <Gauge className="w-5 h-5" style={{ color }} />
        Threat Level
      </h2>

      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Circular Gauge */}
        <div className="relative w-36 h-36">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke="#2a2a3e"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="72"
              cy="72"
              r="60"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${attackPercentage * 3.77} 377`}
              style={{
                filter: `drop-shadow(0 0 8px ${color}50)`,
                transition: "stroke-dasharray 1s ease-out"
              }}
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold"
              style={{ color }}
            >
              {attackPercentage.toFixed(1)}%
            </span>
            <span className="text-xs text-[#71717a]">Attack Rate</span>
          </div>
        </div>

        {/* Level Badge */}
        <div
          className={`px-4 py-2 rounded-full border ${borderColor} ${bgColor}`}
          style={{ borderColor: `${color}50` }}
        >
          <span
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color }}
          >
            {level} Risk
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[#71717a] text-center">{description}</p>

        {/* Stats */}
        <div className="w-full pt-4 mt-2 border-t border-[#2a2a3e] grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-[#ff3366]">{totalAttacks}</p>
            <p className="text-xs text-[#71717a]">Attacks</p>
          </div>
          <div>
            <p className="text-lg font-bold text-[#00ff88]">{totalRecords - totalAttacks}</p>
            <p className="text-xs text-[#71717a]">Normal</p>
          </div>
        </div>
      </div>
    </section>
  )
}
