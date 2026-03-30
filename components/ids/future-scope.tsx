"use client"

import { Rocket, Radio, Server, Cloud, Network, Zap } from "lucide-react"

const futureFeatures = [
  {
    icon: Radio,
    title: "Real-time Packet Capture",
    description: "Live network traffic monitoring and analysis",
    status: "planned"
  },
  {
    icon: Server,
    title: "SIEM Integration",
    description: "Connect with Splunk, ELK Stack, and more",
    status: "in-progress"
  },
  {
    icon: Cloud,
    title: "Cloud-based Monitoring",
    description: "Scalable cloud infrastructure support",
    status: "planned"
  },
  {
    icon: Network,
    title: "Multi-sensor Support",
    description: "Distributed sensor network architecture",
    status: "research"
  },
  {
    icon: Zap,
    title: "Deep Learning Models",
    description: "Advanced neural network detection",
    status: "research"
  }
]

const statusStyles = {
  planned: {
    bg: "bg-[#00d4ff]/10",
    text: "text-[#00d4ff]",
    border: "border-[#00d4ff]/30"
  },
  "in-progress": {
    bg: "bg-[#ffaa00]/10",
    text: "text-[#ffaa00]",
    border: "border-[#ffaa00]/30"
  },
  research: {
    bg: "bg-[#a855f7]/10",
    text: "text-[#a855f7]",
    border: "border-[#a855f7]/30"
  }
}

export function FutureScope() {
  return (
    <section className="rounded-xl border border-[#2a2a3e] bg-[#12121a] p-5 md:p-6">
      <h2 className="text-lg font-semibold text-[#e4e4e7] mb-5 flex items-center gap-2">
        <Rocket className="w-5 h-5 text-[#00d4ff]" />
        Future Roadmap
      </h2>

      <div className="space-y-3">
        {futureFeatures.map((feature) => {
          const Icon = feature.icon
          const style = statusStyles[feature.status as keyof typeof statusStyles]
          
          return (
            <div
              key={feature.title}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] hover:border-[#00d4ff]/30 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg ${style.bg} border ${style.border} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${style.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-medium text-[#e4e4e7]">{feature.title}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${style.bg} ${style.text} border ${style.border}`}>
                    {feature.status.replace("-", " ")}
                  </span>
                </div>
                <p className="text-xs text-[#71717a] mt-0.5">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
