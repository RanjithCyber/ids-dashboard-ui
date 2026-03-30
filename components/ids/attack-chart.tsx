"use client"

import { BarChart3 } from "lucide-react"

interface AttackChartProps {
  distribution: Record<string, number>
}

const COLORS: Record<string, string> = {
  normal: "#00ff88",
  DoS: "#ff3366",
  Probe: "#ffaa00",
  R2L: "#a855f7",
  U2R: "#00d4ff"
}

export function AttackChart({ distribution }: AttackChartProps) {
  const entries = Object.entries(distribution).sort(([,a], [,b]) => b - a)
  const maxValue = Math.max(...Object.values(distribution))
  const total = Object.values(distribution).reduce((a, b) => a + b, 0)

  return (
    <section className="rounded-xl border border-[#2a2a3e] bg-[#12121a] p-5 md:p-6">
      <h2 className="text-lg font-semibold text-[#e4e4e7] mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[#00d4ff]" />
        Attack Distribution
      </h2>

      {entries.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-[#71717a]">No data available. Upload a dataset to visualize.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(([type, count]) => {
            const percentage = ((count / total) * 100).toFixed(1)
            const barWidth = (count / maxValue) * 100
            const color = COLORS[type] || "#00d4ff"
            
            return (
              <div key={type} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-[#e4e4e7] capitalize">
                      {type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[#71717a]">{count.toLocaleString()}</span>
                    <span 
                      className="font-mono font-semibold"
                      style={{ color }}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-[#1a1a2e] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}50`
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-[#2a2a3e]">
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-[#71717a] capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
