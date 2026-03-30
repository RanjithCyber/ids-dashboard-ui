"use client"

import { Brain, Database, Target, Cpu, CheckCircle } from "lucide-react"

const modelSpecs = [
  {
    icon: Brain,
    label: "Model",
    value: "Random Forest Ensemble",
    color: "text-[#a855f7]"
  },
  {
    icon: Database,
    label: "Dataset",
    value: "NSL-KDD",
    color: "text-[#00d4ff]"
  },
  {
    icon: Target,
    label: "Accuracy",
    value: "~92.4%",
    color: "text-[#00ff88]"
  },
  {
    icon: Cpu,
    label: "Features",
    value: "41 Network Features",
    color: "text-[#ffaa00]"
  }
]

const capabilities = [
  "Multi-class attack classification",
  "Real-time traffic analysis",
  "Feature extraction pipeline",
  "Anomaly detection support"
]

export function ModelInfo() {
  return (
    <section className="rounded-xl border border-[#2a2a3e] bg-[#12121a] p-5 md:p-6">
      <h2 className="text-lg font-semibold text-[#e4e4e7] mb-5 flex items-center gap-2">
        <Brain className="w-5 h-5 text-[#a855f7]" />
        Model Information
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {modelSpecs.map((spec) => {
          const Icon = spec.icon
          return (
            <div
              key={spec.label}
              className="p-3 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e]"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${spec.color}`} />
                <span className="text-xs text-[#71717a]">{spec.label}</span>
              </div>
              <p className={`text-sm font-semibold ${spec.color}`}>{spec.value}</p>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t border-[#2a2a3e]">
        <p className="text-xs text-[#71717a] mb-3 uppercase tracking-wider">Capabilities</p>
        <ul className="space-y-2">
          {capabilities.map((cap) => (
            <li key={cap} className="flex items-center gap-2 text-sm text-[#e4e4e7]">
              <CheckCircle className="w-3.5 h-3.5 text-[#00ff88] flex-shrink-0" />
              {cap}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
