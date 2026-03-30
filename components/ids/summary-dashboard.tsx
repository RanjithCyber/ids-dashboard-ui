"use client"

import { Database, AlertOctagon, ShieldCheck, Target } from "lucide-react"
import type { AnalysisData } from "@/app/page"

interface SummaryDashboardProps {
  data: AnalysisData
}

const statCards = [
  {
    key: "totalRecords",
    label: "Total Records",
    icon: Database,
    color: "text-[#00d4ff]",
    bgColor: "bg-[#00d4ff]/10",
    borderColor: "border-[#00d4ff]/30",
    glowColor: "hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
  },
  {
    key: "totalAttacks",
    label: "Total Attacks",
    icon: AlertOctagon,
    color: "text-[#ff3366]",
    bgColor: "bg-[#ff3366]/10",
    borderColor: "border-[#ff3366]/30",
    glowColor: "hover:shadow-[0_0_20px_rgba(255,51,102,0.3)]"
  },
  {
    key: "normalTraffic",
    label: "Normal Traffic",
    icon: ShieldCheck,
    color: "text-[#00ff88]",
    bgColor: "bg-[#00ff88]/10",
    borderColor: "border-[#00ff88]/30",
    glowColor: "hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
  },
  {
    key: "mostFrequentAttack",
    label: "Most Frequent Attack",
    icon: Target,
    color: "text-[#ffaa00]",
    bgColor: "bg-[#ffaa00]/10",
    borderColor: "border-[#ffaa00]/30",
    glowColor: "hover:shadow-[0_0_20px_rgba(255,170,0,0.3)]"
  }
]

export function SummaryDashboard({ data }: SummaryDashboardProps) {
  const getValue = (key: string) => {
    switch (key) {
      case "totalRecords":
        return data.totalRecords.toLocaleString()
      case "totalAttacks":
        return data.totalAttacks.toLocaleString()
      case "normalTraffic":
        return data.normalTraffic.toLocaleString()
      case "mostFrequentAttack":
        return data.mostFrequentAttack
      default:
        return "—"
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-[#e4e4e7] mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#00d4ff] rounded-full" />
        Analysis Summary
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.key}
              className={`relative overflow-hidden rounded-xl border ${card.borderColor} ${card.bgColor} p-5 transition-all duration-300 ${card.glowColor} group`}
            >
              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${card.bgColor} rounded-bl-full opacity-50`} />
              
              <div className="relative space-y-3">
                <div className={`w-10 h-10 rounded-lg ${card.bgColor} border ${card.borderColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                
                <div>
                  <p className="text-sm text-[#71717a] mb-1">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`}>
                    {getValue(card.key)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
